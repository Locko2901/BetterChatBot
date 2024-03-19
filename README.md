# BetterChatBot
A revised version of my ChatBot, integrating the capabilities of the GPT-4-Turbo Preview and Perplexity AI. It also includes an easy command setup, along with an example command already configured.

# ExampleBot and ChatBot Setup Guide

## Project Overview

This guide provides detailed instructions for setting up and running my bot. I will be focusing on the setup using the terminal.

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

## Pre Requisites

### Discord Bot Account

You will need to have a bot account on Discord through which your applications will interact with Discord servers. Follow the steps below to create one if needed:

* Go to the [Discord Developer Portal](https://discord.com/developers/applications) and log in with your Discord account.
* Click on the "New Application" button. Give your application a name and click "Create".
* In the "General Information" tab copy the "Application ID" and save it somewhere for later.
* Navigate to the "Bot" tab on the left sidebar and Customize your bot's username and profile picture according to your preference.
* In the same tab turn off "Public Bot", leave "Requires OAuth2 Code Grant" deactivated, then activate "Presence Intent", "Server Members Intent" and "Message Content Intent".
* Under the "TOKEN" section, click "Copy" to securely store your bot's token (you might have to reset it once); you will need this token and the app id for configuring your bot later in the `config.json` file.

Remember to keep your bot token secure, as it gives full access to your bot to anyone who possesses it.

### (Optional but recommended) Development Server

I recommend having a server to thoroughly test your bot. Bugs are not uncommon after all. You might also need it to locally test and deploy commands.

If you decide to create a dev-server, remember to copy and store your server id for later. You will need it in the `config.json`.

To get it simply enable Developer Mode by going to `User Settings > Appearance > Advanced` and toggle on Developer Mode. Then right-click on the server name in the left sidebar and click on "Copy ID" to copy the server ID to your clipboard.

### Invite Bot to Your Server

Once your bot account is set up, you'll need to invite it to a Discord server for it to become operational. To do this, you can follow there steps:

* In the  Developer Portal](https://discord.com/developers/applications), go to your bot's application page.
* Navigate to the "OAuth2" tab, then scroll down to the "URL Generator".
* Under “Scopes”, tick the “bot” and the "applications.commands" checkbox.
* Below, in “Bot Permissions”, select the permissions your bot requires to function as intended. For simplicity you can just select "Administrator".
* Scroll down to the "Generated URL" and copy it.
* Paste the copied URL into your web browser and select the server to which you want to add your bot.
* Confirm your choice and the bot will be added to the server.

## Acquire the API Keys

To get your OpenAI API Key you can follow the steps below:

* Visit [OpenAI's official platform website](https://platform.openai.com/api-keys) and create an account if you don't have one or log in to your OpenAI account using your email address and password or through Google/Microsoft accounts.
* Navigate to the tab that says "API keys".
* Click on "Create New Secret Key" to generate a new API key.
* Ensure to save the API key immediately as you won't be able to reopen the window once it closes.
* New users receive $5 worth of credit for free, which expires after three months.
* Enter billing details once the credit is used up or expired to continue using the API.

To get your pplx-api key you can follow these steps:

* Start by visiting the Perplexity API Settings page on the official [Perplexity website](https://www.perplexity.ai/settings) and creating an account.
* Register your credit card, which is required to get started but will not be charged initially.
* Ensure your balance is nonzero as API keys can only be generated when you have credits.

Remember to store the keys as you will need them in the `config.json`.

## Initial Setup

Open a terminal and navigate to the directory folder where you plan to store your files. If you don't have one yet you can create and enter it using the command below:

```shell
mkdir AIProjects && cd AIProjects
```

Also, make sure you have `Node.js` and `npm` installed on your computer. These are essential for running and managing the dependencies of the bot. You can check if they're installed and their version by running:

```shell
node -v
npm -v
```

If you see the version numbers for both, you're good to go! If not, or if you need to install them, head over to [Node.js's official website](https://nodejs.org/en/download/) and grab the latest LTS installer, which includes `npm`. After installation, run the above commands again to verify.

### Step 1: Clone the Repository

Clone the repository.This will download all the files needed to start working with the bot.

```shell
git clone https://github.com/Locko2901/BetterChatBot
```

### Step 2: Install Dependencies

Navigate to each bot directory (`ChatBot` and `ExampleBot`) and run `npm install` to install Node.js dependencies.

```shell
cd ChatBot
npm install
```

```shell
cd ../ExampleBot
npm install
```

### Step 3: Configure config.json

Navigate back into your main project directory:

```shell
cd ../
```

Properly fill out the `config.json` located there using the code editor of your choice. I'll be using `nano` in this example:

```shell
nano config.json
```

```shell
{
  "note" : "it is encouraged to use dotenv for this",
  "token": "your_bot_token",
  "clientId": "your_bot_id",
  "guildId": "your_dev_server_id",
  "key": "your_openai_key",
  "ppkey": "your_perplexityai_key"
}
```

When you're done, save the file by pressing `ctrl + o`, confirm with `enter` and exit the editor by pressing `ctrl + x`.

## (Optional but recommended) Personalizing Your Bot

There are 2 ways in which you can personalize the bot: With the personalityPrompt you can define the bots behaviour/character. To modify it, open the `index.js` file of the ChatBot:

```shell
nano ChatBot/src/index.js
```

And look for this line of code:

`let personalityPrompt = ...`

It will be marked with `TODO`, as well as instructions.

The targetContent defines the name that the bot listens to. To change it, open the `ìndex.js` file of the ExampleBot:

```shell
nano ExampleBot/src/index.js
```

And look for the following line of code:

`const targetContent = 'ExampleBot';`

It will also be marked as `TODO`.

## (Optional) Enabling Commands in ExampleBot

To enable command handling, you need to uncomment specific sections within the `index.js` and `deploy-commands.js` files of ExampleBot. These sections are marked with `TODO` comments to indicate where modifications are necessary. I'll be using `nano` again as my code editor.

```shell
nano ExampleBot/src/index.js
```

```shell
nano ExampleBot/src/deploy-commands.js
```

Once done, save and exit as described before.

Then deploy the commands using:

```shell
node ExampleBot/src/deploy-commands.js
```

## (Optional) Running Bots with PM2

To manage the bot with PM2, a powerful Node.js process manager, follow the instructions below:

### 1. Creating ecosystem.config.js

In the main project directory, create an `ecosystem.config.js` file:

```shell
nano ecosystem.config.js
```

And paste in the following lines of code:

```shell
// Adjust as needed
module.exports = {
  apps : [{
    name: 'ChatBot',
    script: './ChatBot/src/index.js',
    watch: true,
  }, {
    name: 'ExampleBot',
    script: './ExampleBot/src/index.js',
    watch: true,
  }]
};
```

Don't forget to save and exit. ;)

### 2. Install PM2

If not already installed, install PM2 globally using npm:

```shell
npm install pm2 -g
```

### 3. Start the Bots

Now all that is left to do is start the Bot by running the following command:

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

***

Your bot should now be correctly set up and running. ^^


