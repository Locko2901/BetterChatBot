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

## Pre-requisites

### Creating a Discord Bot Account

To interact with Discord servers through your applications, a bot account on Discord is necessary. Here are the steps to set one up:

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and log in with your Discord credentials.
2. Select the "New Application" button, name your application, and click on "Create".
3. Copy the "Application ID" from the "General Information" tab and save it.
4. In the "Bot" tab:
   - Customize your bot's username and profile image.
   - Disable *"Public Bot"* and leave *"Requires OAuth2 Code Grant"* deactivated.
   - Enable *"Presence Intent"*, *"Server Members Intent"*, and *"Message Content Intent"*.
5. Under "TOKEN", click "Copy" to save your bot's token. This token and the application ID will be needed for the `config.json` file configuration.

**Security Tip:** Keep your bot's token secure to prevent unauthorized access.

### (Optional) Set Up a Development Server

A development server is recommended for thorough testing and locally deploying commands. To set one up:

1. Enable Developer Mode in `User Settings > App Settings > Advanced` by toggling Developer Mode on.
2. Right-click on the server name in the sidebar and select "Copy ID" to save your server ID for the `config.json`.

### Inviting Your Bot to a Server

To make your bot operational on a Discord server:

1. Access your bot's application page in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Navigate to the "OAuth2" tab and use the "URL Generator":
   - In “Scopes”, select “bot” and "applications.commands".
   - Under “Bot Permissions”, choose the necessary permissions, or select "Administrator".
3. Copy the "Generated URL", paste it into a web browser, select a server, and confirm to add your bot.

## Acquiring API Keys

### OpenAI API Key

1. Visit [OpenAI's official platform website](https://platform.openai.com/api-keys) and log in or create a new account.
2. Go to "API keys" and select "Create New Secret Key" to generate an API key.
3. Save the API key immediately. Note that new users receive $5 in credits which expire after three months.

### Perplexity API Key

1. Visit the [Perplexity API Settings page](https://www.perplexity.ai/settings) and sign up or log in.
2. Enter your billing information (initial charges are not applied).
3. Maintain a nonzero balance as API keys require credits for generation.

**Remember:** Store all keys securely as they will be needed in the `config.json`.

## Initial Setup

### Setting up Your Files

Open a terminal and navigate to the directory folder where you plan to store your files. If you don't have one yet you can create and enter it using the command below:

```shell
mkdir AIProjects && cd AIProjects
```

### Install/Check Node.js and npm

Ensure `Node.js` and `npm` are installed on your computer, as they are vital for running and managing the bot's dependencies. You can verify their installation and check their versions with the following commands:

```shell
node -v
npm -v
```

If version numbers are displayed for both, your setup is complete. If not, or if you need to install them, visit [Node.js's official website](https://nodejs.org/en/download/) to download the latest LTS installer, which includes `npm`.

#### Alternative Installation Methods:

- **Ubuntu/Debian and Derivatives**:
  Install using NodeSource:
  ```shell
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- **CentOS/RHEL/Fedora**:
  Install using NodeSource:
  For CentOS/RHEL:
  ```shell
  curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
  sudo yum install -y nodejs
  ```
  For newer Fedora versions, use `dnf`:
  ```shell
  sudo dnf install -y nodejs
  ```

- **Arch Linux**:
  Install from the official package repository:
  ```shell
  sudo pacman -S nodejs npm
  ```

- **SUSE/openSUSE**:
  Install using NodeSource:
  ```shell
  curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
  sudo zypper install -y nodejs
  ```

- **Using nvm (Node Version Manager)**:
  To manage multiple Node.js versions, install `nvm`:
  ```shell
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  ```
  After installation, you may need to restart your terminal or source your profile. Install the latest LTS version of Node.js with:
  ```shell
  nvm install --lts
  ```

**General Notes for Node.js Installation**:
- If `curl` is unavailable, substitute `curl -O` with `wget`.
- Refer to the [nvm GitHub repo](https://github.com/nvm-sh/nvm?tab=readme-overview) for updated installation instructions or troubleshooting tips.
- Some commands may require `sudo` for execution due to permission requirements.

Verify the installation by running the version check commands again.

### Install/Check Git

Ensure `Git` is installed on your machine. Its installation and version can be confirmed by running:

```shell
git --version
```

A displayed version number indicates a successful installation. To install or upgrade, visit [Git's official website](https://git-scm.com/downloads) for the latest release.

#### Alternative Installation Methods:

- **Ubuntu/Debian and Derivatives**:
  ```shell
  sudo apt-get update
  sudo apt-get install git
  ```

- **CentOS/RHEL 7 and Earlier** / **Fedora (legacy)**:
  ```shell
  sudo yum install git
  ```

- **CentOS/RHEL 8** and **Fedora**:
  Use `dnf` for these distributions:
  ```shell
  sudo dnf install git
  ```
  
- **Arch Linux**:
  Install from the official repository:
  ```shell
  sudo pacman -S git
  ```

- **openSUSE**:
  ```shel
  sudo zypper install git
  ```

#### Configuring Git:

Configuring your global username and email for commits is advised:
```shell
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

**General Notes for Git Installation**:
- Update your package manager before installation to ensure you're getting the latest version of Git.
- For comprehensive documentation or troubleshooting, refer to the [official Git documentation](https://git-scm.com/doc).

Verify Git's installation by rerunning the version check command.

### Step 1: Clone the Repository

Begin by cloning the repository to download all necessary files:

```shell
git clone https://github.com/Locko2901/BetterChatBot
```

### Step 2: Install Dependencies

For each bot directory (`ChatBot` and `ExampleBot`), you need to install Node.js dependencies:

```shell
cd ChatBot
npm install
```
```shell
cd ../ExampleBot
npm install
```

### Step 3: Configure `config.json`

Return to the main project directory:

```shell
cd ../
```

Edit the `config.json` file with your preferred code editor (e.g., using `nano`):

```shell
nano config.json
```

The structure should be as follows:

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

Remember to save and exit the editor upon completion.

## Personalization (Optional)

Customize your bot to suit your preferences:

### Modifying Bot Behavior

Adjust the `personalityPrompt` to define the bot's behavior/character by editing `index.js` in the `ChatBot` directory:

```shell
nano ChatBot/src/index.js
```

Locate and modify the line:

`let personalityPrompt = ...`

This will be marked with `TODO` and additional instructions.

### Changing Bot Name

To alter the name the bot responds to (`targetContent`), edit `index.js` in the `ExampleBot` directory:

```shell
nano ExampleBot/src/index.js
```

Look for the line:

`const targetContent = 'ExampleBot';`

Marked as `TODO`.

## Enabling Commands in ExampleBot (Optional)

Enable command handling by uncommenting sections in `index.js` and `deploy-commands.js` and follow the guided instructions after `// TODO`:

```shell
nano ExampleBot/src/index.js
```
```shell
nano ExampleBot/src/deploy-commands.js
```

Deploy the commands with:

```shell
node ExampleBot/src/deploy-commands.js
```

## Running Bots with PM2 (Optional)

PM2 is a robust Node.js process manager to increase bot uptime:

### Setting Up PM2

1. **Create an `ecosystem.config.js` File**

   Navigate to the main directory and create `ecosystem.config.js`:

   ```shell
   nano ecosystem.config.js
   ```

   Insert the following configurations:

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

2. **Installing PM2**

   If PM2 is not installed, proceed with its installation:

   ```shell
   npm install pm2 -g
   ```

3. **Launching the Bots**

   Start the bots using PM2:

   ```shell
   pm2 start ecosystem.config.js
   ```

   PM2 Commands:

   - List all processes: `pm2 ls`
   - Monitor logs: `pm2 monit`
   - View logs in real-time: `pm2 logs`
   - Stop all applications: `pm2 stop all`
   - Restart all applications: `pm2 restart all`

These steps ensure your bot is properly set up, customized to your preference, and reliably running.
