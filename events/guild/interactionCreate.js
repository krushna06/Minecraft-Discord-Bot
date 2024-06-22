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
        } else if (interaction.isButton()) {
            if (interaction.customId === 'vouch') {
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
            } else if (interaction.customId === 'refresh_stock') {
                try {
                    const stockEmbed = await createStockEmbed();
                    await interaction.update({ embeds: [stockEmbed] });
                } catch (error) {
                    console.error(error);
                    await interaction.reply({ content: 'There was an error while refreshing the stock!', ephemeral: true });
                }
            } else if (interaction.customId === 'purchase') {
                await interaction.reply({ content: 'Purchase button clicked!', ephemeral: true });
            } else if (interaction.customId === 'ticket') {
                await interaction.reply({ content: 'Ticket button clicked!', ephemeral: true });
            }
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
