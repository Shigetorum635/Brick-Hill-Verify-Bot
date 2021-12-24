import { randomBytes } from 'crypto';
import { Message, MessageEmbed } from 'discord.js';
import * as client from '../index.js';
import * as dynamo from '../database/dynamodb.js';
import { IUser } from '../../types/index.js';
import api from './../api/brickHill';
const VERIFICATION_TIMEOUTS_MINS: number = 2;
/**
 * PHIN and Typescript are super gay, Phin always attempts to
 * force the Buffer type, it can fuck off
 */
function generateCode(): string {
	return `bh-${randomBytes(6).toString('hex')}`;
}
async function checkBlurbCode(user: IUser): Promise<boolean | void> {
	const userId: number = user.userId;
	const userData: any = api.getUserData(userId);
	if (!userData || !userData.description) return;
	return userData.includes(user.code);
}

function isWeekOld(joinDate: Date | number): boolean {
	const oneWeek = 1000 * 60 * 60 * 24 * 7;
	const oneWeekAgo = Date.now() - oneWeek;

	return joinDate <= oneWeekAgo;
}

async function startVerifyProcess(msg: Message, username: string) {
	if (client.default.settings.usersVerifying[msg.author.id])
		return msg.reply('You are currently verifying.');

	const verifyData = dynamo.fetchUser(msg.author.id);
	if (verifyData) return msg.reply('You are already verified.');

	if (!isWeekOld(msg.author.createdAt))
		return msg.reply(
			'Your Discord account must be older than a week to verify.'
		);

	const [id, error]: any = await api.getIdFromUsername(username);

	if (error && error.message === 'Record not found')
		return msg.reply('There is no user with that username');
	if (!id) return msg.reply('Unexpected error retrieving user data.');

	const userData: any = await api.getUserData(id);

	const code = generateCode();

	const embed = new MessageEmbed({
		author: {
			name: 'Brick-Hill Verifier',
			url: 'https://brick-hill.com'
		},
		color: '#fcfcfc',
		description:
			`Hello ${username}! :wave:\n` +
			`Add the code below to your profile to verify, [blurb](https://brick-hill.com/settings)\n` +
			`When you are finished, reply with \`${client.default.settings.prefix}done\` or \`${client.default.settings.prefix}cancel\`.`
	}).setThumbnail(`https://brkcdn.com/images/avatars/${userData.img}.png`);
	// @ts-expect-error
	await msg.channel.send('', { embeds: embed });

	let timer = setTimeout(() => {
		if (client.default.settings.usersVerifying[msg.author.id])
			delete client.default.settings.usersVerifying[msg.author.id];
		msg.reply('You ran out of time while verifying.');
	}, 1000 * 60 * VERIFICATION_TIMEOUTS_MINS);

	const user: IUser = {
		userId: id,
		code: code,
		timer: timer
	};
	client.default.settings.usersVerifying[msg.author.id] = user;
}
