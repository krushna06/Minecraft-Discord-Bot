const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all commands'),
    async execute(interaction) {
        const commands = [];
        const commandsPath = path.resolve(__dirname, '../../commands');
        
        function readCommands(directory) {
            const files = fs.readdirSync(directory, { withFileTypes: true });

            for (const file of files) {
                const fullPath = path.join(directory, file.name);
                if (file.isDirectory()) {
                    readCommands(fullPath);
                } else if (file.isFile() && file.name.endsWith('.js')) {
                    const command = require(fullPath);
                    if (command.data && command.data.name) {
                        commands.push(command.data);
                    }
                }
            }
        }

        readCommands(commandsPath);

        const helpEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Help - List of Commands')
            .setTimestamp();

        for (const command of commands) {
            helpEmbed.addFields({ name: `/${command.name}`, value: command.description || 'No description available', inline: true });
        }

        await interaction.reply({ embeds: [helpEmbed] });
    }
};
