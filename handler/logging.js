const { WebhookClient } = require('discord.js');
const { webhookURL } = require('../config.json');

const webhookClient = new WebhookClient({ url: webhookURL });

const log = async (message) => {
    try {
        await webhookClient.send(message);
    } catch (error) {
        console.error('Error sending webhook message:', error);
    }
};

module.exports = { log };
