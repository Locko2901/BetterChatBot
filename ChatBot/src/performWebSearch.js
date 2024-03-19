const axios = require('axios');
const { ppkey } = require('../../config.json');

const perplexityAPIKey = ppkey;

async function performSearchWithSonarMediumOnline(userMessage) {
    try {
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: "sonar-medium-online",
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${perplexityAPIKey}`,
          'Content-Type': 'application/json',
        }
      });
  
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }
  
module.exports = performSearchWithSonarMediumOnline;