import {
  TextChannel,
} from 'discord.js'
import {
  joinVoiceChannel,
  entersState,
  createAudioPlayer,
  createAudioResource,

  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  AudioPlayer,
  AudioResource,
  DiscordGatewayAdapterCreator
} from '@discordjs/voice'

type RockAudioResource = {
  name: string,
  audioResource: AudioResource
}

const shutUp: RockAudioResource = {
  name: 'shut-up',
  audioResource: createAudioResource('assets/shut-up-bitch.mp3', {
    inputType: StreamType.Arbitrary
  })
}

export default class Rock {
  connection: VoiceConnection
  channel: TextChannel
  player: AudioPlayer
  sounds: RockAudioResource[]

  constructor(channel: TextChannel) {
    this.channel = channel
    this.connection = joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.channel.guild.id,
      adapterCreator: this.channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
    })
    this.player = createAudioPlayer()
    this.sounds = [shutUp]
  }

  init (): any {
    console.log('hello')
    entersState(this.connection, VoiceConnectionStatus.Ready, 30_000)
        .then(() => { console.log('foobar'); this.connection.subscribe(this.player);})
        .catch((error) => console.log(error))
  }

  play (): Promise<AudioPlayer> {
    this.player.play(this.sounds[0].audioResource)

    return entersState(this.player, AudioPlayerStatus.Playing, 5e3)
  }
}
