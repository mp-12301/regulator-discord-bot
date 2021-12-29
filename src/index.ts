import { Client, Intents, Message } from 'discord.js'

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

  if (!guilds[id]) {
    const rock = new Rock()

    guilds[id] = buildCommands({
      identifier: '!rock',
      cmds: [
        {
          name: 'say it',
          func: function() {
            rock.play.apply(rock)
          }
        },
        // {
        //   name: 'set',
        //   func: function() {
        //     rock.set.apply(rock)
        //   }
        // },
        {
          name: '',
          func: function(message: Message) {
            rock.join.apply(rock, [message])
            // rock.play.apply(rock)
            rock.intro.apply(rock)
            rock.listen.apply(rock)
          }
        }
      ]
    })
  }

  guilds[id].parseCommand(message)
});

client.login(process.env.TOKEN);
