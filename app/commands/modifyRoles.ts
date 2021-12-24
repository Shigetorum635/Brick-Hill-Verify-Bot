import { IRoleInteraction } from '../../types';
import client from '../index';
import api from './../api/brickHill.js';
const BRICK_HILL_ROLES = [
	'Verified',
	'Classic',
	'Donator',
	'Beta User',
	'Brick Saint'
];

export async function remove(memberId) {
	const guild = client.bot.guilds.cache.get(process.env.DISCORD_GUILD);
	const guildMember = await guild.members.fetch({
		user: memberId,
		force: true
	});

	if (!guildMember) return;

	const roles = guild.roles.cache.filter((role) =>
		BRICK_HILL_ROLES.includes(role.name)
	);

	return guildMember.roles.remove(roles, 'Removed by Brick Hill Verifier.');
}
const hasRole: IRoleInteraction = async (memberId, roleName: string) => {
	const guild = client.bot.guilds.cache.get(process.env.DISCORD_GUILD);
	const guildMember = await guild.members.fetch({
		user: memberId,
		force: true
	});

	if (!guildMember) return;

	return guild.roles.cache.some((role) => role.name === roleName);
};

const add: IRoleInteraction = async (memberId, _, userId) => {
	const guild = client.bot.guilds.cache.get(process.env.DISCORD_GUILD);
	const guildMember = await guild.members.fetch({
		user: memberId,
		force: true
	});

	if (!guildMember) return;

	let roles = [guild.roles.cache.find((role) => role.name === 'Verified')];

	if (userId <= 108)
		roles.push(guild.roles.cache.find((role) => role.name === 'Beta User'));

	const userData: any = await api.getUserData(userId);

	for (let award of userData.awards) {
		award = award.award;
		if (BRICK_HILL_ROLES.includes(award.name))
			roles.push(guild.roles.cache.find((role) => role.name === award.name));
	}

	await guildMember
		.setNickname(userData.username, 'Set by Brick Hill Verifier.')
		.catch((error) => console.error(error));

	return guildMember.roles.add(roles, 'Added by Brick Hill Verifier.');
};

export default { add, remove, hasRole };
