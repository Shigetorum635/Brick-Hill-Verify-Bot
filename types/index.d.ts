import { Client, Message } from 'discord.js';

// Lame? Yes, but it does kinda work.
export interface IClient extends Client {
	usersVerifying: object;
	rateLimit: Set<string>;
	prefix: string;
}

export type IRateLimited = (message: Message) => void | boolean;

export type IDynamoInteraction = (
	discordId: string,
	userId?: number
) => Promise<object>;

export interface Key {
	discordId: string;
}

export interface Item extends Key {
	userId: number;
	verified: boolean;
}

export interface IParams {
	TableName: string;
	Key: Key;
}

export interface ISetParams {
	TableName: string;
	Item: Item;
}

export interface IUser {
	username?: string;
	description?: string;
	userId: number;
	code?: string;
	timer?: any;
}

export type IRoleInteraction = (
	memberId: any,
	roleName?: string,
	userId?: number
) => Promise<any>;
