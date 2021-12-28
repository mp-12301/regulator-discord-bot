const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus} = require('@discordjs/voice')

const client = new Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']});

let connection

const player = createAudioPlayer()

function playShutUp() {
  const resource = createAudioResource('assets/shut-up-bitch.mp3', {
    inputType: StreamType.Arbitrary
  })

  player.play(resource)

  return entersState(player, AudioPlayerStatus.Playing, 5e3)
}

async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.content === '--regulate') {
    const channel = message.member?.voice.channel

    connection = await connectToChannel(channel)
    connection.subscribe(player)

    message.reply('shut up')
  } else if (message.content === '--say-the-word') {
    await playShutUp()
  }
});

// client.login(process.env.TOKEN);
