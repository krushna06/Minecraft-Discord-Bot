const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        if (!config.statusrole) {
            console.log('Status role feature is disabled in config.');
            return;
        }

        const checkMemberStatus = async (member) => {
            if (!member.presence) {
                console.log(`Member ${member.user.tag} has no presence data.`);
                return;
            }

            const hasMatchingStatus = member.presence.activities.some(activity => activity.state?.includes(config.statusname));
            if (hasMatchingStatus) {
                console.log(`Member ${member.user.tag} has matching status: ${config.statusname}`);
                const role = member.guild.roles.cache.get(config.statusroleid);
                if (role) {
                    if (!member.roles.cache.has(config.statusroleid)) {
                        try {
                            await member.roles.add(role);
                            console.log(`Role ${role.name} added to member ${member.user.tag}`);
                        } catch (error) {
                            console.error(`Failed to add role to member ${member.user.tag}:`, error);
                        }
                    } else {
                        console.log(`Member ${member.user.tag} already has role ${role.name}`);
                    }
                } else {
                    console.error(`Role with ID ${config.statusroleid} not found in guild ${member.guild.name}`);
                }
            } else {
                console.log(`Member ${member.user.tag} does not have matching status.`);
            }
        };

        client.on('presenceUpdate', (oldPresence, newPresence) => {
            if (!newPresence) return;
            const member = newPresence.member;
            checkMemberStatus(member);
        });

        // Initial scan when the bot starts
        client.guilds.cache.forEach(async (guild) => {
            console.log(`Processing guild: ${guild.name}`);

            try {
                const members = await guild.members.fetch();
                members.forEach(member => {
                    checkMemberStatus(member);
                });
            } catch (error) {
                console.error(`Error fetching members for guild ${guild.name}:`, error);
            }
        });
    },
};
