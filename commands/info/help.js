const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all commands'),
    async execute(interaction) {
        const commandsByCategory = {};
        const commandsPath = path.resolve(__dirname, '../../commands');

        function readCommands(directory, category = '') {
            const files = fs.readdirSync(directory, { withFileTypes: true });

            for (const file of files) {
                const fullPath = path.join(directory, file.name);
                if (file.isDirectory()) {
                    readCommands(fullPath, file.name);
                } else if (file.isFile() && file.name.endsWith('.js')) {
                    const command = require(fullPath);
                    if (command.data && command.data.name) {
                        if (!commandsByCategory[category]) {
                            commandsByCategory[category] = [];
                        }
                        commandsByCategory[category].push(command.data);
                    }
                }
            }
        }

        readCommands(commandsPath);

        const helpEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Help - List of Commands')
            .setTimestamp();

        for (const [category, commands] of Object.entries(commandsByCategory)) {
            const commandDescriptions = commands.map(command => `/${command.name} - ${command.description || 'No description available'}`).join('\n');
            helpEmbed.addFields({ name: category.charAt(0).toUpperCase() + category.slice(1), value: commandDescriptions, inline: false });
        }

        const purchaseButton = new ButtonBuilder()
            .setCustomId('purchase')
            .setLabel('Purchase')
            .setStyle(ButtonStyle.Primary);

        const ticketButton = new ButtonBuilder()
            .setCustomId('ticket')
            .setLabel('Ticket')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(purchaseButton, ticketButton);

        await interaction.reply({ embeds: [helpEmbed], components: [row] });
    }
};
