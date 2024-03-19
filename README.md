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
        │       └── imagine.js
        ├── deploy-commands.js
        └── index.js
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

Properly fill out the `config.json` located in the main project directory as follows:

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

## Enabling Commands in ExampleBot

Uncomment specific sections within the `index.js` and `deploy-commands.js` file (marked as `TODO`)of ExampleBot to enable command handling. Deploy the commands using:

```shell
node src/deploy-commands.js
```

## Running Bots with PM2

To manage your bots with PM2, a powerful Node.js process manager, follow the instructions below:

### 1. Creating ecosystem.config.js

In the main project directory, create an `ecosystem.config.js` file with the following example content:

```shell
// Adjust as needed
module.exports = {
  apps : [{
    name: 'ChatBot',
    script: './ChatBot/src/discordBot.js',
    watch: true,
  }, {
    name: 'ExampleBot',
    script: './ExampleBot/src/index.js',
    watch: true,
  }]
};
```

### 2. Install PM2

If not already installed, install PM2 globally using npm:

```shell
npm install pm2 -g
```

### 3. Start the Bots

Navigate to the main project directory (where your `ecosystem.config.js` file is located) and start your bots:

```shell
pm2 start ecosystem.config.js
```

### 4. Monitor and Manage Processes
* List all running processes: `pm2 ls`
* Monitor logs and application information: `pm2 monit`
* View logs in real-time: `pm2 logs`
* Stop all applications: `pm2 stop all`
* Restart all applications: `pm2 restart all`

PM2 ensures your bots auto-restart in case of a crash, offering higher uptime and reliability.

Your bots should now be correctly set up and running. This comprehensive guide should assist you in managing your bots efficiently. Happy developing!


