const { DateTime } = require('luxon');
const fs = require('fs'); 

function loadConfig() {
    try {
        const rawData = fs.readFileSync('../../config.json', 'utf-8');
        const config = JSON.parse(rawData);
        return config;
    } catch (error) {
        throw new Error('Failed to load or parse the config.json file.');
    }
}

function currentTime(format = 'full') {
    let config;
    try {
        config = loadConfig();
    } catch (error) {
        console.error(error.message);
        return 'Error loading configuration.';
    }

    const timezone = config.timezone;
    if (!timezone) {
        console.error('Timezone setting is missing in config.json.');
        return 'Timezone setting is missing.';
    }

    try {
        const now = DateTime.now().setZone(timezone);
        if (!now.isValid) {
            throw new Error(`Invalid timezone "${timezone}" specified.`);
        }
        
        let formattedDateTime;
        switch (format) {
            case 'date':
                formattedDateTime = now.toFormat('dd/LL/yyyy');
                break;
            case 'time':
                formattedDateTime = now.toFormat('HH:mm:ss');
                break;
            default:
                formattedDateTime = now.toFormat('dd/LL/yyyy, HH:mm:ss');
                break;
        }

        return formattedDateTime;
    } catch (error) {
        console.error(error.message);
        return 'Error determining current time.';
    }
}

function currentDate() {
    return currentTime('date');
}

function currentTimeOnly() {
    return currentTime('time');
}

console.log(currentDate());
console.log(currentTimeOnly());

module.exports.currentDate = currentDate;
module.exports.currentTimeOnly = currentTimeOnly;