const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { logChannelId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gen')
        .setDescription('Generate an account')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of account to generate')
                .setRequired(true)
                .addChoices(
                    { name: 'Minecraft', value: 'minecraft' },
                    { name: 'Netflix', value: 'netflix' },
                    { name: 'Steam', value: 'steam' }
                )),
    async execute(interaction) {
        const accountType = interaction.options.getString('type');
        const accountFiles = {
            minecraft: 'minecraft.txt',
            netflix: 'netflix.txt',
            steam: 'steam.txt'
        };

        const creditsPath = path.resolve(__dirname, '../../', 'credits.json');
        let creditsData;
        try {
            creditsData = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
        } catch (error) {
            console.error('Error reading credits file:', error);
            return interaction.reply({ content: 'An error occurred while reading the credits file.', ephemeral: true });
        }

        const userCredits = creditsData[interaction.user.id] || 0;
        if (userCredits <= 0) {
            return interaction.reply({ content: 'You have no credits left.', ephemeral: true });
        }

        const accountsPath = path.resolve(__dirname, '../../', accountFiles[accountType]);
        let accounts;
        try {
            accounts = fs.readFileSync(accountsPath, 'utf-8').split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Error reading account file:', error);
            return interaction.reply({ content: 'An error occurred while reading the account file.', ephemeral: true });
        }

        if (accounts.length === 0) {
            return interaction.reply({ content: 'No accounts available.', ephemeral: true });
        }

        const account = accounts.shift(); // Get the first account and remove it from the list
        fs.writeFileSync(accountsPath, accounts.join('\n')); // Save the updated list back to the file

        const [email, password] = account.split(' : ');

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Your Account')
            .addFields(
                { name: 'Email', value: email, inline: true },
                { name: 'Password', value: password, inline: true },
                { name: 'Account Type', value: accountType.charAt(0).toUpperCase() + accountType.slice(1), inline: true }
            )
            .setTimestamp();

        const vouchButton = new ButtonBuilder()
            .setCustomId('vouch')
            .setLabel('Vouch')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(vouchButton);

        try {
            await interaction.user.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: 'Check your DMs for the account details!', ephemeral: true });

            // Log the redeemed account
            const logChannel = interaction.client.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Account Redeemed')
                    .addFields(
                        { name: 'User', value: interaction.user.tag, inline: true },
                        { name: 'Email', value: email, inline: true },
                        { name: 'Account Type', value: accountType.charAt(0).toUpperCase() + accountType.slice(1), inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error('Log channel not found');
            }

            // Deduct a credit after generating an account
            creditsData[interaction.user.id] = userCredits - 1;
            fs.writeFileSync(creditsPath, JSON.stringify(creditsData));

        } catch (error) {
            console.error('Error sending DM:', error);
            await interaction.reply({ content: 'I was unable to send you a DM. Please check your DM settings and try again.', ephemeral: true });
        }
    },
};
