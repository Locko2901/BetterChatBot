const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { EventEmitter } = require('events');
const { OpenAI } = require('openai');

const { key } = require('../../config.json');
const evaluateMessageForWebSearch = require('./modules/evaluateMessageForWebSearch');
const performWebSearch = require('./modules/performWebSearch');
const { currentDate, currentTimeOnly } = require('./modules/currentTime');
const {
  saveConversationHistoryToFile,
  loadConversationHistoryFromFile,
  pruneConversationHistory,
} = require('./modules/conversationHistory');

const app = express();
const port = 4000;

const eventEmitter = new EventEmitter();

let sharedConversationHistory = loadConversationHistoryFromFile();

const maxHistorySize = 1 * 1024 * 1024;
const maxMessageCount = 25;

pruneConversationHistory(sharedConversationHistory, maxHistorySize, maxMessageCount);

const maxTotalTokens = 50000;
const maxConvTokens = 15000;

let personalityPrompt = `
About you: ${aboutYou}

About your creator: ${aboutCreator}

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

let username;

app.post('/userMessage', async (req, res) => {
  const userMessage = req.body.userQuery;
  const server = req.body.server;
  username = userMessage.split(':')[0];
  let messageContent = userMessage.split(':')[1].trim();

  console.log('Username:', username);
  console.log('User Message:', messageContent);
  console.log('Server', server);

  if (!userPrompts[username]) {
    userPrompts[username] = personalityPrompt;
  }

  userPrompt = userPrompts[username];

  console.log('Prompt:', userPrompt);

  const needsWebSearch = await evaluateMessageForWebSearch(messageContent);

  let webResults = '';
  if (needsWebSearch) {
    console.log('Performing web search for message:', messageContent);
    const searchResponse = await performWebSearch(messageContent);
    webResults = searchResponse.choices[0].message.content;
    console.log('Web Results:', webResults);
  }

  const messageBatches = splitLongMessages(messageContent);

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

    userMessageHistory.push({
      role: 'user',
      username: username,
      server: server,
      timestamp: `${currentDate()} ${currentTimeOnly()}`,
      content: `name : ${username}, timestamp: ${currentDate()} ${currentTimeOnly()}, message: ${messageContent}`
    });

    if (webResults) {
      assistantMessageHistory.push({ role: 'assistant', content: `Web Results:\n${webResults}` });
    }

    userMessageTokens += currentMessageTokens;
  });

  sharedConversationHistory = [...userMessageHistory, ...assistantMessageHistory];

  eventEmitter.emit('userMessage', { userAttribution: 'user', userQuery: messageContent });

  const chatbotResponses = await generateResponses(messageBatches, userMessageHistory, assistantMessageHistory, webResults);

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

async function generateResponses(messageBatches, userMessageHistory, assistantMessageHistory, webResults) {
  const responses = [];

  for (const batch of messageBatches) {

    const systemMessage = `Your are now talking to ${username}. It's currently ${currentTimeOnly()}, and today's date is ${currentDate()}, formatted as DD/MM/YYYY.`;

    if (webResults && webResults.trim().length > 0) {
      systemMessage += `\n\nCurrent Web Results:\n${webResults}`;
    }

    const combinedMessages = [...userMessageHistory, ...assistantMessageHistory, { role: 'user', content: batch }];

    const filteredMessages = combinedMessages.map(({ role, content }) => ({ role, content }));

    const systemMessageContent = "Consider the web search results as the most current information available. They come from mostly verified and trusted sources. Since only you have access to these web results, integrate this information accurately into your responses.";

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
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
