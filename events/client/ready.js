const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const { log } = require('../../handler/logging');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await log(`Ready! Logged in as ${client.user.tag}`);

        if (!config.statusrole) {
            await log('Status role feature is disabled in config.');
            return;
        }

        const checkMemberStatus = async (member) => {
            if (!member.presence) {
                return;
            }

            const hasMatchingStatus = member.presence.activities.some(activity => activity.state?.includes(config.statusname));
            const role = member.guild.roles.cache.get(config.statusroleid);

            if (hasMatchingStatus) {
                if (role && !member.roles.cache.has(config.statusroleid)) {
                    try {
                        await member.roles.add(role);
                        await log(`Role ${role.name} added to member ${member.user.tag} due to matching status.`);
                    } catch (error) {
                        await log(`Failed to add role to member ${member.user.tag}: ${error}`);
                    }
                }
            } else {
                if (role && member.roles.cache.has(config.statusroleid)) {
                    try {
                        await member.roles.remove(role);
                        await log(`Role ${role.name} removed from member ${member.user.tag} due to status change.`);
                    } catch (error) {
                        await log(`Failed to remove role from member ${member.user.tag}: ${error}`);
                    }
                }
            }
        };

        client.on('presenceUpdate', async (oldPresence, newPresence) => {
            if (!newPresence) return;
            const member = newPresence.member;

            const oldStatus = oldPresence?.activities.some(activity => activity.state?.includes(config.statusname));
            const newStatus = newPresence.activities.some(activity => activity.state?.includes(config.statusname));

            if (oldStatus !== newStatus) {
                await checkMemberStatus(member);
            }
        });

        // Initial scan when the bot starts
        client.guilds.cache.forEach(async (guild) => {
            await log(`Processing guild: ${guild.name}`);

            try {
                const members = await guild.members.fetch();
                members.forEach(member => {
                    checkMemberStatus(member);
                });
            } catch (error) {
                await log(`Error fetching members for guild ${guild.name}: ${error}`);
            }
        });
    },
};
