import * as vscode from "vscode"

/*


Resources:
- v1.93 Terminal shell integration API: https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api
- vscode-extension-samples/terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/terminal-sample/src/extension.ts
- vscode-extension-samples/shell-integration-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/shell-integration-sample/src/extension.ts
- vscode-extension-samples/extension-terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/extension-terminal-sample/src/extension.ts
- https://github.com/microsoft/vscode/blob/f0417069c62e20f3667506f4b7e53ca0004b4e3e/src/vscode-dts/vscode.d.ts#L10743-L10794
*/

const terminalProfileName = "Shell-Integration-Example"

export function activate(context: vscode.ExtensionContext) {
	const trackedTerminals: Set<vscode.Terminal> = new Set()

	/*
	const commandLine = 'echo "Hello world"'
	if (term.shellIntegration) {
		const execution = shellIntegration.executeCommand({ commandLine })
		window.onDidEndTerminalShellExecution((event) => {
			if (event.execution === execution) {
				console.log(`Command exited with code ${event.exitCode}`)
			}
		})
	} else {
		term.sendText(commandLine)
		// Without shell integration, we can't know when the command has finished or what the
		// exit code was.
	}
	*/

	function runCommand(terminal: vscode.Terminal, command: string): void {
		if (terminal.shellIntegration) {
			const execution = terminal.shellIntegration.executeCommand(command)
			vscode.window.onDidEndTerminalShellExecution((event) => {
				if (event.execution === execution) {
					console.log(`Command "${command}" exited with code ${event.exitCode}`)
				}
			})
		} else {
			terminal.sendText(command)
			console.log(`Command "${command}" sent to terminal without shell integration`)
		}
	}

	// Command to run a command in a new terminal
	const runInNewTerminal = vscode.commands.registerCommand("shell-integration-example.runInNewTerminal", async () => {
		const input = await vscode.window.showInputBox({ prompt: "Enter command to run in new terminal" })
		if (input) {
			const terminal = vscode.window.createTerminal("New Terminal")
			runCommand(terminal, input)
		}
	})

	// Command to run a command in an existing terminal
	const runInExistingTerminal = vscode.commands.registerCommand(
		"shell-integration-example.runInExistingTerminal",
		async () => {
			const terminal = trackedTerminals.size > 0 ? Array.from(trackedTerminals).pop() : undefined
			if (terminal) {
				const input = await vscode.window.showInputBox({ prompt: "Enter command to run in existing terminal" })
				if (input) {
					runCommand(terminal, input)
				}
			} else {
				console.log("No active terminal found")
			}
		}
	)

	context.subscriptions.push(runInNewTerminal, runInExistingTerminal)

	// Terminal profile provider
	context.subscriptions.push(
		vscode.window.registerTerminalProfileProvider("shell-integration-example.profile", {
			provideTerminalProfile(token: vscode.CancellationToken) {
				return {
					options: {
						name: terminalProfileName,
					},
				}
			},
		})
	)

	// Shell integration change event
	context.subscriptions.push(
		vscode.window.onDidChangeTerminalShellIntegration((e) => {
			console.log(`Shell integration changed for terminal: ${e.terminal.name}`)
			if (e.terminal.name === terminalProfileName && !trackedTerminals.has(e.terminal)) {
				trackedTerminals.add(e.terminal)
				console.log(`Terminal ${e.terminal.name} is now tracked`)
			}
		})
	)

	// Terminal opened event
	context.subscriptions.push(
		vscode.window.onDidOpenTerminal((terminal) => {
			console.log(`Terminal opened: ${terminal.name}`)
			console.log(`Total terminals: ${vscode.window.terminals.length}`)
		})
	)

	// Terminal closed event
	context.subscriptions.push(
		vscode.window.onDidCloseTerminal((terminal) => {
			console.log(`Terminal closed: ${terminal.name}`)
			console.log(`Total terminals: ${vscode.window.terminals.length}`)
			if (terminal.exitStatus) {
				console.log(`Exit code: ${terminal.exitStatus.code}`)
			}
		})
	)

	// Active terminal changed event
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTerminal((terminal) => {
			console.log(`Active terminal changed: ${terminal ? terminal.name : "undefined"}`)
		})
	)

	// Terminal state changed event
	context.subscriptions.push(
		vscode.window.onDidChangeTerminalState((terminal) => {
			console.log(
				`Terminal state changed: ${terminal.name}, State: ${
					terminal.state.isInteractedWith ? "Interacted" : "Not Interacted"
				}`
			)
		})
	)

	// Shell execution events
	context.subscriptions.push(
		vscode.window.onDidStartTerminalShellExecution((event) => {
			console.log(`Shell execution started in terminal: ${event.terminal.name}`)
		})
	)

	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution((event) => {
			console.log(
				`Shell execution ended in terminal:`,
				event.terminal.name,
				event.execution.commandLine.value,
				event.exitCode
			)
			// exitCode 0 -> success
			if (event.exitCode !== undefined) {
				console.log(`Exit code: ${event.exitCode}`)
			}
		})
	)

	console.log("Shell integration example extension activated")
}

export function deactivate() {
	console.log("Shell integration example extension deactivated")
}
