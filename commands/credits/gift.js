const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { log } = require('../../handler/logging');
const { ownerId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gift')
        .setDescription('Gift credits to another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to gift credits to.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of credits to gift.')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: "You can't gift credits to yourself.", ephemeral: true });
        }

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

        creditsData[interaction.user.id] = userCredits - amount;
        creditsData[targetUser.id] = (creditsData[targetUser.id] || 0) + amount;

        try {
            fs.writeFileSync(creditsPath, JSON.stringify(creditsData));
        } catch (error) {
            console.error('Error writing credits file:', error);
            return interaction.reply({ content: 'An error occurred while writing the credits file.', ephemeral: true });
        }

        await interaction.reply(`You have gifted ${amount} credits to ${targetUser.username}.`);

        // Log the transaction to the webhook
        await log(`User ${interaction.user.tag} (${interaction.user.id}) has gifted ${amount} credits to ${targetUser.tag} (${targetUser.id}).`);
    },
};
