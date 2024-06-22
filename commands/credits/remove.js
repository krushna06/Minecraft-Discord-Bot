const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { ownerId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removecredit')
        .setDescription('Remove credits from a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to remove credits from')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of credits to remove')
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

        const userCredits = creditsData[targetUser.id] || 0;
        if (userCredits < amount) {
            return interaction.reply({ content: 'The user does not have enough credits.', ephemeral: true });
        }

        creditsData[targetUser.id] = userCredits - amount;

        fs.writeFileSync(creditsPath, JSON.stringify(creditsData));

        await interaction.reply(`You have removed ${amount} credits from ${targetUser.username}.`);
    },
};
