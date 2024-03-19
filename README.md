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
  "userId": "your_user_id",
  "ppkey": "your_perplexityai_key"
}
```

When you're done, save the file by pressing `ctrl + o`, confirm with `enter` and exit the editor by pressing `ctrl + x`.

## Enabling Commands in ExampleBot

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

## (optional) Running Bots with PM2

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

Your bots should now be correctly set up and running. ^^


