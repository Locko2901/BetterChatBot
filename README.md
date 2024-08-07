# BetterChatBot
A revised version of my ChatBot, integrating the capabilities of GPT-4o and llama-3.1-sonar-large-128k-online. It also includes an easy command setup, along with a few commands already configured.

# Bot Setup Guide

## Project Overview

This guide provides detailed instructions for setting up and running my bot. I will be focusing on the setup using the terminal.

## Project Structure

Upon cloning the repository, you will find the following structure:

```shell
.
├── BasicSetup
│   └── BetterChatBot
│       ├── ChatBot
│       │   ├── package.json
│       │   ├── package-lock.json
│       │   └── src
│       │       ├── data
│       │       │   └── conversation_history.json
│       │       ├── index.js
│       │       └── modules
│       │           ├── conversationHistory.js
│       │           ├── countTokens.js
│       │           ├── currentTime.js
│       │           ├── discordBot.js
│       │           ├── evaluateMessageForWebSearch.js
│       │           └── performWebSearch.js
│       ├── config.json
│       ├── ecosystem.config.js
│       ├── ExampleBot
│       │   ├── package.json
│       │   ├── package-lock.json
│       │   └── src
│       │       └── index.js
│       ├── installer.sh
│       └── Setup.zip
├── ChatBot
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── data
│       │   └── conversation_history.json
│       ├── index.js
│       └── modules
│           ├── conversationHistory.js
│           ├── countTokens.js
│           ├── currentTime.js
│           ├── discordBot.js
│           ├── evaluateMessageForWebSearch.js
│           └── performWebSearch.js
├── config.json
├── ExampleBot
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── commands
│       │   ├── app
│       │   │   ├── authorize.js
│       │   │   ├── reset.js
│       │   │   ├── set.js
│       │   │   └── unauthorize.js
│       │   ├── chat
│       │   │   └── forget.js
│       │   └── fun
│       │       └── imagine.js
│       ├── data
│       │   ├── authorizedUsers.json
│       │   └── channels.json
│       ├── deploy-commands.js
│       ├── index.js
│       └── index.js.alt
├── LICENSE
└── README.md
```

## Installation Methods

There are several ways to install the bot, depending on your preference for simplicity and control over the setup process:

1. **Automatic Installation with the Installer Script**: This method is the simplest and involves using the `installer.sh` script provided in the latest release. It automates initial setup and dependency installation, suitable for users looking for a quick start.
   - Find the installer in the `Setup.zip` asset from the [Releases page](https://github.com/Locko2901/BetterChatBot/releases).

2. **Manual Installation (With Discord `/commands`)**: For users who opt to manually install the bot and wish to incorporate Discord `/commands`, this method involves a bit more setup. Detailed instructions can be found in the Manual Setup section of the readme.

3. **Manual Installation (Without Discord `/commands`)**: If you prefer a manual installation process and do not want to use Discord `/commands`, this method is also available. It involves manually configuring the bot without setting up `/commands`. Instructions are also provided in the Manual Setup section of the readme.

## Simplified Setup Using the Install Script

For users looking for a quicker setup experience, a new release now includes an `installer.sh` script. This script is part of the Basic Setup and automates the initial configuration and dependency installations, significantly cutting down the setup time and making the process more user-friendly. Please note that the Basic Setup does not include command setup.

### Using the Install Script

1. Download the latest release from the [Releases page](https://github.com/Locko2901/BetterChatBot/releases) on GitHub. Ensure to download the `Setup.zip` asset.
2. If you are installing on a local machine, proceed to step 3. If you are installing on a remote device, follow these steps to transfer `Setup.zip`:
   - Open a terminal.
   - Use the `scp` command to securely copy the file to the remote device. Replace `your_username@remote_host` with the username and IP address (or hostname) of your remote device, and replace `/path/to/remote/directory` with the directory path on the remote device where you want to place the file:
     ```shell
     scp ~/Downloads/Setup.zip your_username@remote_host:/path/to/remote/directory
     ```
   - Log into your remote device via SSH:
     ```shell
     ssh your_username@remote_host
     ```
   - Proceed to step 3 after successfully logging into your remote device.
3. Navigate to the directory where you downloaded or transferred `Setup.zip`:
   ```shell
   cd ~/Downloads  # Or the remote directory you transferred Setup.zip to
   ```
4. Extract the downloaded package to your desired location.
   - For Unix/Linux and macOS:
     ```shell
     unzip Setup.zip -d /path/to/extract/location
     ```
   - Replace `/path/to/extract/location` with the actual path where you wish to extract the files.
   
   - For distributions where `unzip` might not be installed by default, you can usually install it via your package manager:
     - On Debian/Ubuntu:
       ```shell
       sudo apt-get install unzip
       ```
     - On Fedora/RedHat:
       ```shell
       sudo dnf install unzip
       ```
     - On Arch Linux:
       ```shell
       sudo pacman -S unzip
       ```
     - After installing `unzip`, use the first command to extract the package.
   
   - For users on graphical interfaces (such as GNOME, KDE, etc.), you can often right-click the `Setup.zip` file and select an option like "Extract Here" or "Extract to..." without needing to use the terminal.
5. Navigate to the `BetterChatBot` directory within the extracted files.
   ```shell
   cd /path/to/extract/location/BasicSetup/BetterChatBot
   ```
6. Make the `installer.sh` script executable and run it:
   ```shell
   chmod +x installer.sh
   ./installer.sh
   ```
7. Follow the on-screen instructions provided by the script.

This script checks for Node.js, npm, and PM2 installations, configures your Discord bot account, sets up API keys, and much more—all from within a simplified, interactive command-line interface. Remember, the Basic Setup streamlines your initial setup process but does not cover command setup.

## Manual Setup

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

Begin by cloning the repository to download all necessary files and remove the `BasicSetup` directory as you won't be needing it:

```shell
git clone https://github.com/Locko2901/BetterChatBot
```
```shell
rm -rf BetterChatBot/BasicSetup
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
  "note" : "it is encouraged to use dotenv for the tokens",
  "token": "your_bot_token",
  "clientId": "your_bot_id",
  "guildId": "your_dev_server_id",
  "yourUserId": "your_user_id",
  "key": "your_openai_key",
  "ppkey": "your_perplexityai_key"
  "timezone": "your_timezone(eg. Europe/Berlin)",
}
```

Remember to save and exit the editor upon completion.

#### Tipp: Some of the Most Common Timezones Are:

1. `Africa/Johannesburg` - South African Standard Time (SAST)
2. `America/Chicago` - Central Standard Time (CST)/Central Daylight Time (CDT)
3. `America/Los_Angeles` - Pacific Standard Time (PST)/Pacific Daylight Time (PDT)
4. `America/Mexico_City` - Central Standard Time (CST)/Central Daylight Time (CDT)
5. `America/New_York` - Eastern Standard Time (EST)/Eastern Daylight Time (EDT)
6. `America/Sao_Paulo` - Brasília Time (BRT)/Brasília Summer Time (BRST)
7. `America/Toronto` - Eastern Standard Time (EST)/Eastern Daylight Time (EDT)
8. `Asia/Bangkok` - Indochina Time (ICT)
9. `Asia/Dubai` - Gulf Standard Time (GST)
10. `Asia/Kolkata` - Indian Standard Time (IST)
11. `Asia/Seoul` - Korea Standard Time (KST)
12. `Asia/Shanghai` - China Standard Time (CST)
13. `Asia/Singapore` - Singapore Standard Time (SGT)
14. `Asia/Tokyo` - Japan Standard Time (JST)
15. `Australia/Sydney` - Australian Eastern Standard Time (AEST)/Australian Eastern Daylight Time (AEDT)
16. `Europe/Berlin` - Central European Time (CET)/Central European Summer Time (CEST)
17. `Europe/Istanbul` - Turkey Time (TRT)
18. `Europe/London` - Greenwich Mean Time (GMT)/British Summer Time (BST)
19. `Europe/Moscow` - Moscow Standard Time (MSK)
20. `Europe/Paris` - Central European Time (CET)/Central European Summer Time (CEST)

## Personalization

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

## Enabling Commands in ExampleBot

#### If you don't want commands you can use the `index.js.alt` file and skip this part.

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

#### Controlling Bot Communication in Channels

By default, the bot is not allowed to communicate in any channel. To enable communication, you must explicitly authorize the bot for your desired channel. This is achieved through the use of the `/cb-set` command. Executing this command will allow the bot to begin interacting within the channel. 

To reverse this permission and prevent the bot from further communicating in the channel, you can use the `/cb-reset` command. This will disable the bot's ability to interact within that specific channel.

It's important to note that this setting only affects the bot's chat communication. Commands issued to the bot will still be processed in channels where the bot is a member, even if chat communications are disabled through `/cb-set` and `/cb-reset` commands.

In cases where you want to grant other users the ability to authorize or deauthorize the bot's communication in channels, you can utilize the `/cb-authorize` and `/cb-unauthorize` commands accordingly. These commands allow you to manage which users have the authority to set or reset the bot's communication capabilities within channels.

When the bot begins to act unpredictably or if it starts generating responses based on unintended inputs—perhaps because a user fed it unrelated or nonsensical information—the `/forget` command can come in handy. This command serves to reset the bot's state, clearing any temporary data or context that might be influencing its behavior. It's a useful tool for restoring the bot to a more expected operational state without affecting its overall settings or permissions.

Remember, these commands provide vital control over the bot's interaction within your workspace, ensuring that chat messages are allowed only in channels where they are expressly permitted, while still allowing command processing across all channels the bot is part of. Use them judiciously to maintain the desired level of engagement and operational consistency.

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
     }, {
       name: 'ExampleBot',
       script: './ExampleBot/src/index.js',
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

## Deployment Recommendations

This bot is designed to run on various server environments, including home servers, Raspberry Pi, cloud instances (such as droplets on DigitalOcean), or any similar platforms. This flexibility allows for an efficient use of resources and easy access from anywhere.

## Communication Endpoints

The bot utilizes the following communication endpoints for interacting with the server:

- User Message Endpoint: `const serverUserMessageEndpoint = 'http://localhost:4000/userMessage';`
- Assistant Response Endpoint: `const serverAssistantResponseEndpoint = 'http://localhost:4000/assistantResponse';`

These endpoints are set to work with a local server setup by default. However, you can easily configure them to use more professional, domain-based endpoints for a production environment.

### Advanced Setup: Attaching a Custom Domain (Optional)

#### Attention: Only recommended for users familiar with server management and DNS configurations.

Attaching a custom domain to your server hosting the bot not only enhances the professionalism of your endpoints but also makes them more memorable. Here is a tiny guide to get you started with attaching a custom domain and setting up SSL:

1. **Acquire a Domain**: Purchase a domain from a domain registrar of your choice.
2. **Point Your Domain to Your Server**: Update the DNS records at your domain registrar to point to your server's IP address.
3. **Set Up SSL for Secure Communication**:
   - Install Certbot on your server (for Let's Encrypt free SSL certificates).
   - Run `certbot --standalone`.
   - Follow the interactive prompt to select your domain and finalize the SSL setup.
   - Ensure your server is configured to redirect HTTP traffic to HTTPS.

These steps are a starting foundation. Depending on your server setup and the specific requirements of your project, additional configuration may be necessary.
