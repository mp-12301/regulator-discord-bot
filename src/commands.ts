type CommandFuncion = {
  name: string,
  func: Function,
}

type CommandMap = {
  identifier: string,
  cmds: CommandFuncion[],
}

export function buildCommands(commandMap: CommandMap): {parseCommand: Function} {
  function parseCommand(msg: any): void {
    try {
      const content = msg.content
      const [id, ...rest]: string[] = content.split(' ')
      const commandName: string = rest.join(' ')

      if (id === commandMap.identifier) {
        const commandToExec = commandMap.cmds.find(cmd => cmd.name === commandName)
        if (typeof commandToExec?.func === 'function') {
          commandToExec.func(msg)
        }
      }
    } catch(e) {

    }
  }

  return {
    parseCommand,
  }
}
