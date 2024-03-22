const { OpenAI } = require('openai');
const { key } = require('../../config.json')
const express = require('express');
const bodyParser = require('body-parser');
const { EventEmitter } = require('events');
const cors = require('cors');
const evaluateMessageForWebSearch = require('./evaluateMessageForWebSearch');
const performWebSearch = require('./performWebSearch');
const { currentDate, currentTimeOnly } = require('./currentTime');
const {
  saveConversationHistoryToFile,
  loadConversationHistoryFromFile,
  pruneConversationHistory,
} = require('./conversationHistory');

const app = express();
const port = 4000;

const eventEmitter = new EventEmitter();

let sharedConversationHistory = loadConversationHistoryFromFile();

// Define the maximum history size and maximum message count
const maxHistorySize = 1 * 1024 * 1024; // Maximum size in bytes (e.g., 1 MB)
const maxMessageCount = 25; // Maximum number of messages

pruneConversationHistory(sharedConversationHistory, maxHistorySize, maxMessageCount);

const maxTotalTokens = 75000; 
const maxConvTokens = 20000; //Adjust as needed

// TODO: Set bot personality: About you - describes the bot; About your creator - only needed for better helping capabilities (not mandatory); General - leave untouched!!
let personalityPrompt = `
About you:

You are a bot designed to help.

About your creator:

A human.

General:

You are part of a dynamic duo with a specialized research assistant AI, designed to fetch real-time data and updates from across the globe. This assistant, which is constantly scanning the internet for the latest information, will provide you with Web Results that contain highly relevant, up-to-date data directly related to user queries. When you receive these Web Results, treat them as current insights that have been verified and confirmed up to the present moment. Your role is to seamlessly integrate this information into your responses, ensuring users receive the most accurate, timely, and comprehensive answers possible. Given your unique collaboration with this research assistant AI, your knowledge is continuously evolving, making you exceptionally well-informed about recent developments, even beyond your last training update.
`;

let chatPrompt = personalityPrompt;

app.use(bodyParser.json());
app.use(cors());

const openaiAPIKey = key; 
const openai = new OpenAI({ apiKey: openaiAPIKey });

const countTokens = (messages) => {
  return messages.reduce((totalTokens, message) => {
    if (message.content) {
      const tokenCount = message.content.split(' ').length; 
      return totalTokens + tokenCount;
    }
    return totalTokens;
  }, 0);
};

const splitLongMessages = (messageContent) => {
  const maxLength = 2000;
  const messageBatches = [];
  let currentMessage = '';

  messageContent.split('\n').forEach((line) => {
    if (currentMessage.length + line.length <= maxLength) {
      currentMessage += line + '\n';
    } else {
      messageBatches.push(currentMessage);
      currentMessage = line + '\n';
    }
  });

  if (currentMessage.length > 0) {
    messageBatches.push(currentMessage);
  }

  return messageBatches;
};

let userPrompts = {}; 
let userPrompt;

app.post('/userMessage', async (req, res) => {
  const userMessage = req.body.userQuery;
  const server = req.body.server;
  const username = userMessage.split(':')[0];
  let messageContent = userMessage.split(':')[1].trim();

  console.log('Username:', username);
  console.log('User Message:', messageContent);
  console.log('Server', server);

  if (!userPrompts[username]) {
    userPrompts[username] = personalityPrompt;
  }

  userPrompt = userPrompts[username];

  console.log('Prompt:', userPrompt);

  // Evaluate if the message requires a web search.
  const needsWebSearch = await evaluateMessageForWebSearch(messageContent);

  let webResults = '';
    if (needsWebSearch) {
      console.log('Performing web search for message:', messageContent);
      const searchResponse = await performWebSearch(messageContent);
      webResults = searchResponse.choices[0].message.content; 
      console.log('Web Results:', webResults);
    }

  // Prepare the message batch, including the potential web search result.
  const messageBatches = splitLongMessages(messageContent + (webResults ? ("\nWeb Results: " + webResults) : ""));

  const personalityPromptTokens = countTokens([{ content: userPrompt }]);

  const userMessageHistory = sharedConversationHistory.filter((message) => message.role === 'user');
  const assistantMessageHistory = sharedConversationHistory.filter((message) => message.role === 'assistant');

  let userMessageTokens = countTokens(userMessageHistory);
  let assistantMessageTokens = countTokens(assistantMessageHistory);

  const availableTokens = maxTotalTokens - personalityPromptTokens - userMessageTokens - assistantMessageTokens;

  messageBatches.forEach((batch) => {
    const currentMessageTokens = countTokens([{ content: batch }]);

    while (currentMessageTokens + userMessageTokens + assistantMessageTokens > maxConvTokens) {
      if (userMessageTokens > assistantMessageTokens) {
        const removedMessage = userMessageHistory.shift();
        userMessageTokens -= countTokens([{ content: removedMessage.content }]);
      } else {
        const removedMessage = assistantMessageHistory.shift();
        assistantMessageTokens -= countTokens([{ content: removedMessage.content }]);
      }
    }

    userMessageHistory.push({ role: 'user', username: username, server: server, content: messageContent });
      if (webResults) {
        userMessageHistory.push({ role: 'assistant', content: `Web Results:\n${webResults}` });
      }
    
    //userMessageHistory.push({ role: 'user', username: username, server: server, content: batch });
    userMessageTokens += currentMessageTokens;
  });

  sharedConversationHistory = [...userMessageHistory, ...assistantMessageHistory];

  eventEmitter.emit('userMessage', { userAttribution: 'user', userQuery: messageContent });

  const chatbotResponses = await generateResponses(messageBatches, userMessageHistory, assistantMessageHistory);

  chatbotResponses.forEach((response) => {
    const responseTokens = countTokens([{ content: response }]);

    while (responseTokens + userMessageTokens + assistantMessageTokens > maxConvTokens) {
      if (userMessageTokens > assistantMessageTokens) {
        const removedMessage = userMessageHistory.shift();
        userMessageTokens -= countTokens([{ content: removedMessage.content }]);
      } else {
        const removedMessage = assistantMessageHistory.shift();
        assistantMessageTokens -= countTokens([{ content: removedMessage.content }]);
      }
    }

    assistantMessageHistory.push({ role: 'assistant', content: response });
    assistantMessageTokens += responseTokens;
  });

  sharedConversationHistory = [...userMessageHistory, ...assistantMessageHistory];

  saveConversationHistoryToFile(sharedConversationHistory);

  res.json({ message: 'Message received by the server.', chatbotResponse: chatbotResponses });
});

async function generateResponses(messageBatches, userMessageHistory, assistantMessageHistory) {
  const responses = [];

  for (const batch of messageBatches) { 

    const systemMessage = `Your creator is standing in front of you at the moment. It's currently ${currentTimeOnly()}, and today's date is ${currentDate()}, formatted as DD/MM/YYYY.`; // Edit as you please; Time function might be useful.

    // Combine user and assistant history, then add the current batch message.
    const combinedMessages = [...userMessageHistory, ...assistantMessageHistory, { role: 'user', content: batch }];

    // Filter out unrecognized properties before API call, only include 'role' and 'content'.
    const filteredMessages = combinedMessages.map(({ role, content }) => ({ role, content }));

    // Prepare additional system message. Don't touch, borks easily!!
    const systemMessageContent = "Consider the web search results as the most current information available. They come from mostly verified and trusted sources. Integrate this information accurately into your responses.";

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: filteredMessages.concat([{ role: 'system', content: userPrompt + "\n\n" + systemMessageContent + "\n\n" + systemMessage }]),
        temperature: 0.7,
        max_tokens: 750,
      });

      responses.push(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating response:', error.message);
      responses.push('An error occurred while generating a response.');
    }
  }

  return responses;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
