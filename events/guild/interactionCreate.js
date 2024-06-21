const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { vouchChannelId } = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isModalSubmit()) return;

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton() && interaction.customId === 'vouch') {
            const modal = new ModalBuilder()
                .setCustomId('vouchModal')
                .setTitle('Vouch for the Account');

            const vouchInput = new TextInputBuilder()
                .setCustomId('vouchInput')
                .setLabel('Please provide your vouch message')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(vouchInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        } else if (interaction.isModalSubmit() && interaction.customId === 'vouchModal') {
            const vouchMessage = interaction.fields.getTextInputValue('vouchInput');
            const vouchChannel = interaction.client.channels.cache.get(vouchChannelId);

            if (vouchChannel) {
                const vouchEmbed = new EmbedBuilder()
                    .setColor(0x00AE86)
                    .setTitle('New Vouch')
                    .setDescription(vouchMessage)
                    .addFields(
                        { name: 'User', value: interaction.user.tag, inline: true }
                    )
                    .setTimestamp();

                await vouchChannel.send({ embeds: [vouchEmbed] });
                await interaction.reply({ content: 'Thank you for your vouch!', ephemeral: true });
            } else {
                console.error('Vouch channel not found');
                await interaction.reply({ content: 'There was an error processing your vouch.', ephemeral: true });
            }
        }
    },
};
