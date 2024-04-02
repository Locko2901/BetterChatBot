const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const EventEmitter = require('events');

const evaluateMessageForWebSearch = require('../../ChatBot/src/modules/evaluateMessageForWebSearch');
const { token, name } = require('../../config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const serverUserMessageEndpoint = 'http://localhost:4000/userMessage';
const serverAssistantResponseEndpoint = 'http://localhost:4000/assistantResponse';

const eventEmitter = new EventEmitter();

const messageQueue = [];
let isProcessing = false;

client.on('ready', () => {
    console.log(`${client.user.tag} is online.`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }

    const targetContent = name;
    const lowerCaseMessage = message.content.toLowerCase();

    if (lowerCaseMessage.includes(targetContent.toLowerCase()) || message.mentions.has(client.user)) {
        if (message.mentions.everyone || message.mentions.here) {
            return;
        }

        const messageContent = `${message.member.displayName}:${message.content}`;

        const data = {
            userQuery: messageContent,
            server: message.guild.name,
        };

        messageQueue.push({ message, data });

        if (!isProcessing) {
            processNextMessage();
        }
    }
});

async function processNextMessage() {
    if (messageQueue.length > 0) {
        isProcessing = true;
        const { message, data } = messageQueue.shift();

        message.channel.sendTyping();

        let preliminaryMessage = null;

        const needsWebSearch = await evaluateMessageForWebSearch(data.userQuery);

        if (needsWebSearch) {
            preliminaryMessage = await message.channel.send("Invoking web search...");
        }

        try {
            const response = await axios.post(serverUserMessageEndpoint, data);
            const serverResponses = response.data.chatbotResponse;
            console.log('Server Responses:', serverResponses);

            if (preliminaryMessage) {
                await preliminaryMessage.delete().catch(error => {
                    if (error.code === 10008) {
                        console.warn('Attempted to delete an unknown message. It might have been already deleted.');
                    } else {
                        throw error;
                    }
                });
            }

            for (const serverResponse of serverResponses) {
                if (serverResponse.trim() !== '') {
                    const responseParts = splitLongMessage(serverResponse);
                    for (const part of responseParts) {
                        await message.channel.send(part);
                    }
                }
            }
        } catch (error) {
            console.error('Error sending/receiving messages:', error.message);
            await message.channel.send('An error occurred while communicating with the server.');
        } finally {
            isProcessing = false;
            processNextMessage();
        }
    }
}

eventEmitter.on('botResponse', async (responseData) => {
    const responseBatch = responseData.responseBatch;

    try {
        const responseParts = splitLongMessage(responseBatch);
        for (const part of responseParts) {
            await responseData.message.reply(part);
        }
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
});

function splitLongMessage(message) {
    const maxLength = 1000;
    const parts = [];
    const sentences = message.split(/(?<=\. )/);

    let currentPart = '';

    for (const sentence of sentences) {
        if (sentence.length > maxLength) {
            let remainingSentence = sentence;
            while (remainingSentence.length > 0) {
                const chunk = remainingSentence.substring(0, maxLength);
                parts.push(chunk);
                remainingSentence = remainingSentence.substring(maxLength);
            }
        } else {
            if (currentPart.length + sentence.length <= maxLength) {
                currentPart += sentence;
            } else {
                parts.push(currentPart);
                currentPart = sentence;
            }
        }
    }

    if (currentPart.length > 0) {
        parts.push(currentPart);
    }

    return parts;
}

client.login(token); 
