const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
// Import the exec function
const { exec } = require('child_process');

const config = require('../../../../config.json');
const yourUserId = config.yourUserId;
const conversationHistoryPath = path.join(__dirname, '..', '..', '..', '..', 'ChatBot', 'src', 'data', 'conversation_history.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forget')
    .setDescription('Clear the conversation history.'),
  async execute(interaction) {
    if (interaction.user.id === yourUserId) {
      try {
        fs.writeFileSync(conversationHistoryPath, '');
        await interaction.reply('The conversation history has been cleared.');

        exec('pm2 restart ChatBot', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });

      } catch (err) {
        console.error(err);
        await interaction.reply('An error occurred while clearing the conversation history.');
      }
    } else {
      await interaction.reply("You don't have permission to use this command.");
    }
  },
};
