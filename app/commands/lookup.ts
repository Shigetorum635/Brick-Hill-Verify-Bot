import { Message } from 'discord.js';
import dynamo from './../database/dynamodb.js';

const lookup = async (message: Message): Promise<Message<boolean>> => {
	message.channel.send(
		`:mag_right: Looking up verified information for ${message.author.id}`
	);
	// Forced to change the type because otherwise it won't work
	const verifiedUser: any = await dynamo.fetchUser(message.author.id);

	if (!verifiedUser)
		return message.channel.send(
			`:x: No verified user found for ${message.author.id}`
		);
	return message.channel.send(
		`Found user:\nhttps://brick-hill.com/user/${verifiedUser.userId}`
	);
};
export default { lookup };
