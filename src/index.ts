import { Client, Intents } from 'discord.js'

import { buildCommands } from './commands'
import Rock from './rock'

type Guilds = {
  [id: string]: {
    parseCommand: Function
  }
}

const guilds: Guilds = {}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on('messageCreate', async message => {
  const id = message.guildId! 
  const content = message.content

  console.log(guilds)
  if (guilds[id]) {
    guilds[id].parseCommand(content)
  } else {
    const rock = new Rock(message.channel as any)

    rock.init()

    guilds[id] = buildCommands({
      identifier: '!rock',
      cmds: [
        {
          name: 'say it',
          func: rock.play
        }
      ]
    })
  }
});

client.login(process.env.TOKEN);
