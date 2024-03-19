# BetterChatBot
A revised version of my ChatBot, integrating the capabilities of the GPT-4-Turbo Preview and Perplexity AI. It also includes an easy command setup, along with an example command already configured.

# ExampleBot and ChatBot Setup Guide

## Project Overview

This guide provides detailed instructions for setting up and running the ExampleBot and ChatBot. These bots, designed to work together, offer a rich interactive environment within Discord.

## Project Structure

Upon cloning the repository, you will find the following structure:
```shell
.
├── ChatBot
│   ├── conversation_history.json
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── conversationHistory.js
│       ├── conversation_history.json
│       ├── countTokens.js
│       ├── discordBot.js
│       ├── evaluateMessageForWebSearch.js
│       ├── index.js
│       └── performWebSearch.js
├── config.json
└── ExampleBot
    ├── package.json
    ├── package-lock.json
    └── src
        ├── commands
        │   └── fun
```

## Initial Setup

### Step 1: Clone the Repository

Clone the repository to your local machine to start working with the bots.

### Step 2: Install Dependencies

Navigate to each bot directory (`ChatBot` and `ExampleBot`) and run `npm install` to install Node.js dependencies.

```shell
cd ChatBot
npm install

cd ../ExampleBot
npm install
        │       └── imagine.js
        ├── deploy-commands.js
        └── index.js
```

### Step 3: Configure config.json

Properly fill out the config.json located in the main project directory as follows:

```shell
{
  "token": "your_bot_token",
  "clientId": "your_bot_id",
  "guildId": "your_dev_server_id",
  "key": "your_openai_key",
  "userId": "your_user_id",
  "ppkey": "your_perplexityai_key"
}
```

Replace placeholders with your actual data.




  
