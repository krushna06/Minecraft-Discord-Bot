const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Show your credits'),
    async execute(interaction) {
        const creditsPath = path.resolve(__dirname, '../../', 'credits.json');
        let creditsData;
        try {
            creditsData = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
        } catch (error) {
            console.error('Error reading credits file:', error);
            return interaction.reply({ content: 'An error occurred while reading the credits file.', ephemeral: true });
        }

        const userCredits = creditsData[interaction.user.id] || 0;
        await interaction.reply(`You have ${userCredits} credits.`);
    },
};
