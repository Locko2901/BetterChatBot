const { OpenAI } = require('openai');
const { key } = require('../../config.json'); // Loading API key from config

const openaiAPIKey = key;
const openai = new OpenAI({ apiKey: openaiAPIKey });

// Determine if a user message requires a web search
async function evaluateMessageForWebSearch(userMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Using GPT-4 for analysis
      messages: [
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "system",
          content: "Carefully evaluate the user's inquiry. If the question seems to benefit from the most current information available or specific data that could have emerged after the last update, respond with 'web_search_required'. Otherwise, for questions well addressed with existing general knowledge, specify 'no_web_search_needed'."
        }
      ],
      max_tokens: 100,
    });

    const evaluationResult = response.choices[0].message.content.trim();
    return evaluationResult === "web_search_required";
  } catch (error) {
    console.error('Error evaluating message for web search:', error);
    throw error;
  }
}

module.exports = evaluateMessageForWebSearch; 
