const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

async function execute(interaction) {
    const creditsPath = path.resolve(__dirname, '../../', 'credits.json');
    let creditsData;
    try {
        creditsData = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
    } catch (error) {
        console.error('Error reading credits file:', error);
        return interaction.reply({ content: 'An error occurred while reading the credits file.', ephemeral: true });
    }

    // Sort the creditsData object by credits in descending order
    const sortedCredits = Object.entries(creditsData).sort((a, b) => b[1] - a[1]);

    // Get the top 10 users with the most credits
    const topUsers = sortedCredits.slice(0, 10);

    // Create a formatted message with the top users
    let message = '**Top 10 Users with the Most Credits:**\n';
    for (let i = 0; i < topUsers.length; i++) {
        const [userId, credits] = topUsers[i];
        try {
            const user = await interaction.client.users.fetch(userId);
            const mentionableUsername = `<@${userId}>`;
            message += `${i + 1}. ${mentionableUsername}: ${credits} credits\n`;
        } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error);
            message += `${i + 1}. Unknown User: ${credits} credits\n`;
        }
    }

    await interaction.reply(message);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Show the top 10 users with the most credits'),
    execute,
};
