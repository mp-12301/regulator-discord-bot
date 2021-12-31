import {
  VoiceBasedChannel,
  Message,
} from 'discord.js'

import {
  joinVoiceChannel,
  entersState,
  createAudioPlayer,
  createAudioResource,

  VoiceReceiver,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  AudioPlayer,
  DiscordGatewayAdapterCreator,
} from '@discordjs/voice'

type PeopleToShutUp = {
  [id: string]: {
    count: number,
    speaking: number,
    timer: any,
  }
}

type RockSettings = {
  duration: number,
  count: number
}

export default class Rock {
  connection?: VoiceConnection
  channel?: VoiceBasedChannel
  receiver?: VoiceReceiver
  player: AudioPlayer

  tracking: PeopleToShutUp
  settings: RockSettings

  constructor() {
    this.tracking = {}
    this.settings = {
      duration: 1,
      count: 5,
    }
    this.player = createAudioPlayer()
  }

  join (message: Message): void{
    const channel = message.member?.voice.channel

    if (this.connection && this.channel?.id !== channel?.id) {
      this.connection.destroy()
      this.tracking = {}
    }

    if (channel) {
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

  listen (): void{
    if (this.connection) {
      this.connection.receiver.speaking.on('start', (userId) => {
        // console.log('start', userId, this.connection?.receiver.speaking.users)

        try {
          this.tracking[userId] =
              this.tracking[userId] || {count: 0, speaking: 0, timer: null}
          this.tracking[userId].speaking = + new Date()

          if (this.tracking[userId].count > this.settings.count) {
            this.tracking[userId].timer = setTimeout(() => {
              this.play()
              this.tracking[userId].count = 0
            }, 300)
          }
        } catch(e) {
          console.error(e)

          this.tracking = {}
        }
      })

      this.connection.receiver.speaking.on('end', (userId) => {
        // console.log('end', userId, this.connection?.receiver.speaking.users)
        

        try {
          if (this.tracking[userId]?.timer) {
            clearTimeout(this.tracking[userId].timer)
          }

          const startTime = this.tracking[userId]?.speaking
          if (startTime) {
            const endTime = + new Date()

            const elapsedTime = endTime - startTime

            // console.log('elapsedTime', elapsedTime / 1000)

            if ((elapsedTime / 1000) > this.settings.duration) {
              this.tracking[userId].count = this.tracking[userId].count + 1 

              const otherUsers = Object.entries(this.tracking)
                  .filter(user => user[0] !== userId)

              if (otherUsers.find(user => user[1].count > 0)) {
                this.tracking = {}
              } 
            }
          }

          // console.log('speaking tracking', this.tracking)
        } catch(e) {
          console.error(e) 

          this.tracking = {}
        }
      })
    }
  }

  // set (count: number, duration: number): void{
  //   this.settings = {
  //     
  //   }
  // }

  intro (): void{
    const shutUp = createAudioResource('assets/intro.mp3', {
      inputType: StreamType.Arbitrary
    })

    this.player.play(shutUp)

    entersState(this.player, AudioPlayerStatus.Playing, 5e3)
  }

  play (): void{
    const shutUp = createAudioResource('assets/shut-up-bitch.mp3', {
      inputType: StreamType.Arbitrary
    })

    this.player.play(shutUp)

    entersState(this.player, AudioPlayerStatus.Playing, 5e3)
  }
}
