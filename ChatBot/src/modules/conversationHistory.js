const fs = require('fs');
const path = require('path');

// Define the path to the conversation_history.json file in the Data directory
const filePath = path.join(__dirname, '..', 'data', 'conversation_history.json');

function saveConversationHistoryToFile(history) {
  // Update the method to use filePath
  fs.writeFileSync(filePath, JSON.stringify(history), 'utf8');
}

function loadConversationHistoryFromFile() {
  try {
    // Update the method to use filePath
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Function to prune old messages to limit the size or message count
function pruneConversationHistory(history, maxSize, maxMessageCount) {
  if (history.length > maxMessageCount) {
    history.splice(0, history.length - maxMessageCount);
  }

  let historySize = JSON.stringify(history).length;

  while (historySize > maxSize) {
    history.shift();
    historySize = JSON.stringify(history).length;
  }
}

module.exports = {
  saveConversationHistoryToFile,
  loadConversationHistoryFromFile,
  pruneConversationHistory,
};