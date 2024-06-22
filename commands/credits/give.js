const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give credits to a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give credits to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of credits to give')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        const creditsPath = path.resolve(__dirname, '../../', 'credits.json');
        let creditsData;
        try {
            creditsData = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
        } catch (error) {
            console.error('Error reading credits file:', error);
            return interaction.reply({ content: 'An error occurred while reading the credits file.', ephemeral: true });
        }

        const userCredits = creditsData[interaction.user.id] || 0;
        if (userCredits < amount) {
            return interaction.reply({ content: 'You do not have enough credits.', ephemeral: true });
        }

        // Deduct credits from the sender and add to the receiver
        creditsData[interaction.user.id] = userCredits - amount;
        creditsData[targetUser.id] = (creditsData[targetUser.id] || 0) + amount;

        fs.writeFileSync(creditsPath, JSON.stringify(creditsData));

        await interaction.reply(`You have given ${amount} credits to ${targetUser.username}.`);
    },
};
