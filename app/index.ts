import { Client, Message } from "discord.js";
import { IClient } from "../types";
import { IRateLimited } from '../types/index';

const client = new Client({
  intents: [
    "DIRECT_MESSAGES",
    "GUILDS",
    "GUILD_MEMBERS",
  ],
});

let clientSettings: IClient;
clientSettings.usersVerifying = {};
clientSettings.rateLimit = new Set();
clientSettings.prefix = process.env.prefix;



const rateLimited: IRateLimited = (msg) => {
    const id = msg.author.id;
    if(clientSettings.rateLimit.has(id)){
        msg.reply('You are sending commands too fast.');
        return true;
    }

    clientSettings.rateLimit.add(id);
    setTimeout(() => { clientSettings.rateLimit.delete(id);}, 5000)
}

client.on('ready', () => {
    console.log('Client has loaded successfully.')
    client.user.setActivity({
        type: 'COMPETING',
        url: 'https://brick-hill.com',
        name: 'Verifying users!'
    })
})

client.on('message', async (msg: Message): Promise<void> => {
    if(!msg  || !msg.author  || msg.author.bot) return;
    if(msg.channel.type !== 'DM') return
    if(!msg.content.startsWith(clientSettings.prefix)) return;

    const args : string[] = msg.content.slice(clientSettings.prefix.length).trim().split(/ +g/)
    const command : string = args.shift().toLowerCase()
})
export default {
  settings: clientSettings,
  bot : client
};