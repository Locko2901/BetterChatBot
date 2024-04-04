const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { exec } = require('child_process');

const channelsFilePath = path.join(__dirname, '..', '..', 'data', 'channels.json');
const authorizedUsersFilePath = path.join(__dirname, '..', '..', 'data', 'authorizedUsers.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cb-reset')
        .setDescription('(RESTRICTED) Remove a channel from the list of allowed channels.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select the channel to remove.')
                .setRequired(true)), async execute(interaction) {
                    const channelIdOption = interaction.options.getChannel('channel');
                    if (!channelIdOption) {
                        await interaction.reply('Invalid channel. Please select a valid channel.');
                        return;
                    }
                    const channelId = channelIdOption.id;

                    let channels;
                    try {
                        const fileContent = fs.readFileSync(channelsFilePath, 'utf-8');
                        channels = fileContent ? JSON.parse(fileContent) : { allowedChannels: {} };
                    } catch (error) {
                        await interaction.reply({ content: 'Failed to read the channels configuration. Please try again later.', ephemeral: true });
                        console.error('Error reading channels file:', error);
                        return;
                    }

                    const serverId = interaction.guild.id;

                    let authorizedUsers = [];
                    if (fs.existsSync(authorizedUsersFilePath)) {
                        try {
                            const fileContent = fs.readFileSync(authorizedUsersFilePath, 'utf-8');
                            authorizedUsers = fileContent ? JSON.parse(fileContent) : [];
                        } catch (error) {
                            console.error('Error reading authorized users file:', error);
                            await interaction.reply({ content: 'There was an error accessing the authorized users list. Please try again later.', ephemeral: true });
                            return;
                        }
                    } else {
                        console.error('Authorized users file does not exist.');
                    }

                    if (!authorizedUsers.includes(interaction.user.id)) {
                        await interaction.reply('You are not authorized to use this command.');
                        return;
                    }

                    if (channels.allowedChannels[serverId] && channels.allowedChannels[serverId].includes(channelId)) {
                        channels.allowedChannels[serverId] = channels.allowedChannels[serverId].filter(id => id !== channelId);

                        try {
                            fs.writeFileSync(channelsFilePath, JSON.stringify(channels, null, 2));
                            await interaction.reply(`Channel <#${channelId}> removed from the list of allowed channels.`);
                        } catch (error) {
                            await interaction.reply('Failed to update the channels configuration. Please try again later.');
                            console.error('Error writing to channels file:', error);
                        }
                    } else {
                        await interaction.reply(`Channel <#${channelId}> is not in the list of allowed channels.`);
                    }

                    exec('pm2 restart ExampleBot', (error, stdout, stderr) => { // Replace with your bot name.
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
                    });

                },
};