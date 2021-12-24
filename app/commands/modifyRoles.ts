import client from '../index'
const BRICK_HILL_ROLES = [
    "Verified",
    "Classic",
    "Donator",
    "Beta User",
    "Brick Saint"
]

async function remove(memberId) {
    const guild = client.bot.guilds.cache.get(process.env.DISCORD_GUILD)
    const guildMember = await guild.members.fetch({ user: memberId, force: true })
    
    if (!guildMember) return

    const roles = guild.roles.cache.filter(role => BRICK_HILL_ROLES.includes(role.name))

    return guildMember.roles.remove(roles, "Removed by Brick Hill Verifier.")
}