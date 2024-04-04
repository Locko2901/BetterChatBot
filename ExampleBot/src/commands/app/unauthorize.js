const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const authorizedUsersFilePath = path.join(__dirname, '..', '..', 'data', 'authorizedUsers.json');
const config = require('../../../../config.json');
const yourUserId = config.yourUserId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cb-unauthorize')
        .setDescription('(RESTRICTED) Remove authorization from a user to use the /cb-set command.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select the user to unauthorize.')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== yourUserId) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const user = interaction.options.getUser('user');
        if (!user) {
            await interaction.reply({ content: 'Failed to retrieve user from command option.', ephemeral: true });
            return;
        }

        let authorizedUsers = [];
        try {
            const data = fs.readFileSync(authorizedUsersFilePath, 'utf-8');
            authorizedUsers = data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Failed to read authorizedUsers file:", error);
            await interaction.reply({ content: 'There was an error accessing the authorized users list. Please try again later.', ephemeral: true });
            return;
        }

        if (authorizedUsers.includes(user.id)) {
            authorizedUsers = authorizedUsers.filter(id => id !== user.id);
            try {
                fs.writeFileSync(authorizedUsersFilePath, JSON.stringify(authorizedUsers, null, 2));
                await interaction.reply({ content: `User <@${user.id}> has been unauthorized to use the /cb-set command.`, ephemeral: true });
            } catch (error) {
                console.error("Failed to write to authorizedUsers file:", error);
                await interaction.reply({ content: 'Failed to update authorized users data. Please try again later.', ephemeral: true });
                return;
            }
        } else {
            await interaction.reply({ content: `User <@${user.id}> is not authorized.`, ephemeral: true });
        }
    },
};