const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { ownerId } = require('../../config.json');
const { log } = require('../../handler/logging');

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
        if (interaction.user.id !== ownerId) {
            return interaction.reply({ content: 'Only the owner/developer can use this command.', ephemeral: true });
        }

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

        creditsData[targetUser.id] = (creditsData[targetUser.id] || 0) + amount;

        try {
            fs.writeFileSync(creditsPath, JSON.stringify(creditsData));
        } catch (error) {
            console.error('Error writing credits file:', error);
            return interaction.reply({ content: 'An error occurred while writing the credits file.', ephemeral: true });
        }

        await interaction.reply(`You have given ${amount} credits to ${targetUser.username}.`);

        // Log the transaction to the webhook
        await log(`User ${interaction.user.tag} (${interaction.user.id}) has given ${amount} credits to ${targetUser.tag} (${targetUser.id}).`);
    },
};
