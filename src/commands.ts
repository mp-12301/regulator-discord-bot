export enum Command {
  Identifier = '!rock',
  Start = 'start',
}

export enum Mode {
  Hard = 'hard',
  Normal = 'normal',
  Easy = 'slow',
}

export function checkCommand(msg: string): void {
  try {
    const strs: string[] = msg.split(' ')
    const id: string = strs[0]
    const command: string = strs[1]
  
    if (id === Command.Identifier) {
      switch(command) {
        case Command.Start:
          // start
          break
        default:
          // say shut up
      }
    }
  } catch(e) {

  }
}