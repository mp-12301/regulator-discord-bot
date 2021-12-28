import {
  VoiceBasedChannel,
  Message,
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
  DiscordGatewayAdapterCreator,
} from '@discordjs/voice'

export default class Rock {
  connection: VoiceConnection | null
  channel: VoiceBasedChannel | null
  player: AudioPlayer

  constructor() {
    this.connection = null
    this.channel = null
    this.player = createAudioPlayer()
  }

  join (message: Message): void{
    const channel = message.member?.voice.channel

    if (channel && channel.id !== this.channel?.id) {
      this.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
      this.channel = channel

      entersState(this.connection, VoiceConnectionStatus.Ready, 30_000)
          .then(() => this.connection?.subscribe(this.player))
          .catch((error) => {
            console.log('error', error)
            this.connection?.destroy()
          })
    }
  }

  play (): void{
    const shutUp = createAudioResource('assets/shut-up-bitch.mp3', {
      inputType: StreamType.Arbitrary
    })

    this.player.play(shutUp)

    entersState(this.player, AudioPlayerStatus.Playing, 5e3)
  }
}
