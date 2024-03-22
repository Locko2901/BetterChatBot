#!/bin/bash

echo "Starting the BetterChatBot setup..."

# Function to check and install missing software
function install_if_missing {
  local software_name=$1
  local install_command=$2
  command -v $software_name >/dev/null 2>&1 || { 
    echo >&2 "$software_name is not installed. Installing...";
    eval $install_command
    echo "$software_name installation completed."
  }  
}

# Function to display initial instructions for Discord bot account setup
function display_discord_instructions {
  cat <<EOF

### Creating a Discord Bot Account

To interact with Discord servers through your applications, a bot account on Discord is necessary:
1. Navigate to the Discord Developer Portal (https://discord.com/developers/applications) and log in with your Discord credentials.
2. Select the "New Application" button, name your application, and click on "Create".
3. Copy the "Application ID" from the "General Information" tab and save it.
4. In the "Bot" tab:
   - Customize your bot's username and image.
   - Disable "Public Bot" and leave "Requires OAuth2 Code Grant" deactivated.
   - Enable "Presence Intent", "Server Members Intent", and "Message Content Intent".
5. Under "TOKEN", click "Copy" to save your bot's token. This token and the application ID will be needed for the config.json configuration.

### (Optional) Set Up a Development Server

For thorough testing and local deployment of commands, a development server is recommended:
1. Enable Developer Mode in User Settings > App Settings > Advanced by toggling Developer Mode on.
2. Right-click on the server name in the sidebar and select "Copy ID" to save your server ID for the config.json.

EOF
}

echo "Step 1: Creating a Discord Bot Account"
display_discord_instructions

echo "Enter the details for your config.json file."
read -p "Bot Key: " botkey
read -p "Bot ID (Application ID): " botid
read -p "Dev Server ID (optional): " serverid

read -p "Press enter to continue after completing Discord Bot setup."

# Function to display instructions for inviting the bot and acquiring API keys
function display_api_instructions {
  cat <<EOF

### Inviting Your Bot to a Server

To make your bot operational on a Discord server:
1. Access your bot's application page in the Discord Developer Portal (https://discord.com/developers/applications).
2. Navigate to the "OAuth2" tab and use the "URL Generator":
   - In "Scopes", select "bot" and "applications.commands".
   - Under "Bot Permissions", choose the necessary permissions, or select "Administrator".
3. Copy the "Generated URL", paste it into a web browser, select a server, and confirm to add your bot.

## Acquiring API Keys

### OpenAI API Key

To get an OpenAI API key:
1. Visit OpenAI's official platform website (https://platform.openai.com/api-keys), log in or create a new account.
2. Go to "API keys" and select "Create New Secret Key" to generate an API key.
3. Save the API key immediately. Note: new users receive $5 in credits which expire after three months.

### Perplexity API Key

To get a Perplexity API key:
1. Visit the Perplexity API Settings page (https://www.perplexity.ai/settings), sign up or log in.
2. Enter your billing information (initial charges are not applied).
3. Maintain a nonzero balance as API keys require credits for generation.

EOF
}

echo "Step 2: Inviting Your Bot to a Server and Acquiring API Keys"
display_api_instructions

read -p "OpenAI API Key: " openaikey
read -p "Perplexity API Key: " perplexitykey

read -p "Press enter to continue after completing these steps."

echo "Checking for Node.js, npm, and PM2 installation..."
install_if_missing node "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -; sudo apt-get install -y nodejs"
install_if_missing pm2 "sudo npm install pm2@latest -g"

echo "Installing Node.js dependencies for ChatBot..."
cd ChatBot/
npm install

echo "Installing Node.js dependencies for ExampleBot..."
cd ../ExampleBot/
npm install

cd ../

read -p "Enter chatbot name: " botname
read -p "About your bot (default: 'You love to chat and learn new things!'): " botaboutyou
botaboutyou=${botaboutyou:-"You love to chat and learn new things!"}  
read -p "About the creator (optional, e.g., 'Created by Lockoo, an AI enthusiast.'): " botaboutcreator

read -p "Press enter to continue after completing these steps."

function display_timezones {
  cat <<EOF

  Please select your timezone from the list below:
  ------------------------------------------------------------
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

  ------------------------------------------------------------
  If your timezone is not listed here, please look it up and use the IANA timezone format (Region/City) corresponding to your local time.
  
EOF
}

echo "Last step: Configuring your timezone"
display_timezones

echo "Enter your timezone. Use the IANA timezone format (eg. Europe/Berlin)."
read -p "Timezone: " timezone

#if [ -z "$timezone" ]; then
#  echo "You didn't enter a timezone. Please try again."
#else
#  echo "Your selected timezone is: $timezone"
#fi

echo "Configuring the config.json file..."
cat > config.json <<EOT
{
  "token": "$botkey",
  "clientId": "$botid",
  "guildId": "$serverid",
  "key": "$openaikey",
  "ppkey": "$perplexitykey",
  "name": "$botname",
  "aboutYou": "$botaboutyou",
  "aboutCreator": "$botaboutcreator",
  "timezone": "$timezone"
}
EOT

echo "Configuration file setup complete."

read -p "Setup is complete. Do you want to run the bot now? (y/n) " answer
if [[ $answer =~ ^[Yy]$ ]]; then
  echo "Starting the bot using PM2..."
  pm2 start ecosystem.config.js
  echo "Bot is running."
fi

echo "Setup and installation are complete. Your chatbot is now ready to interact with users on your Discord server."