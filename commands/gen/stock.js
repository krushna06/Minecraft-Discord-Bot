const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stock')
        .setDescription('Show the stock of accounts'),
    async execute(interaction) {
        const stockEmbed = await createStockEmbed();
        const refreshButton = new ButtonBuilder()
            .setCustomId('refresh_stock')
            .setEmoji('1253951977738600458')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(refreshButton);
        const message = await interaction.reply({ embeds: [stockEmbed], components: [row], fetchReply: true });

        // Schedule the task to update the stock every 3 minutes
        cron.schedule('*/3 * * * *', async () => {
            const updatedEmbed = await createStockEmbed();
            await message.edit({ embeds: [updatedEmbed] });
        });
    }
};

async function createStockEmbed() {
    const accountFiles = {
        minecraft: 'minecraft.txt',
        netflix: 'netflix.txt',
        steam: 'steam.txt'
    };

    const accountCounts = {};

    for (const [accountType, filename] of Object.entries(accountFiles)) {
        const accountsPath = path.resolve(__dirname, '../../', filename);
        let accounts = [];
        try {
            accounts = fs.readFileSync(accountsPath, 'utf-8').split('\n').filter(line => line.trim() !== '');
        } catch (error) {
            console.error('Error reading account file:', error);
        }
        accountCounts[accountType] = accounts.length;
    }

    const stockEmbed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle('Account Stock')
        .setTimestamp();

    for (const [accountType, count] of Object.entries(accountCounts)) {
        stockEmbed.addFields({ name: accountType.charAt(0).toUpperCase() + accountType.slice(1), value: `[${count}]`, inline: true });
    }

    return stockEmbed;
}