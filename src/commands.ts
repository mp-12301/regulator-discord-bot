type CommandFuncion = {
  name: string,
  func: Function,
}

type CommandMap = {
  identifier: string,
  cmds: CommandFuncion[],
}

export function buildCommands(commandMap: CommandMap): {parseCommand: Function} {
  function parseCommand(msg: string): void {
    try {
      const strs: string[] = msg.split(' ')
      const id: string = strs[0]
      const commandName: string = strs[1]
    
      if (id === commandMap.identifier) {
        const commandToExec = commandMap.cmds.find(cmd => cmd.name === commandName)
        if (typeof commandToExec?.func === 'function') {
          commandToExec.func()
        }
      }
    } catch(e) {

    }
  }

  return {
    parseCommand,
  }
}
