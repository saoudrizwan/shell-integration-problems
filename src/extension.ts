import * as vscode from "vscode"

/*


Resources:
- v1.93 Terminal shell integration API: https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api
- vscode-extension-samples/terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/terminal-sample/src/extension.ts
- vscode-extension-samples/shell-integration-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/shell-integration-sample/src/extension.ts
- vscode-extension-samples/extension-terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/extension-terminal-sample/src/extension.ts
- https://github.com/microsoft/vscode/blob/f0417069c62e20f3667506f4b7e53ca0004b4e3e/src/vscode-dts/vscode.d.ts#L10743-L10794
*/

const terminalProfileName = "Shell-Integration-Problems"

export function activate(context: vscode.ExtensionContext) {
	let lastUsedTerminal: vscode.Terminal | undefined

	async function runCommand(terminal: vscode.Terminal, command: string): Promise<void> {
		terminal.show()
		try {
			console.log("Waiting for shell integration...")
			await waitFor(() => !!terminal.shellIntegration, { interval: 100, timeout: 10_000 })
			console.log("Shell integration available")
			const execution = terminal.shellIntegration!.executeCommand(command)
			console.log({ execution })
			const stream = execution.read()
			for await (const chunk of stream) {
				console.log({ chunk })
			}
		} catch (error) {
			console.error("Timed out waiting for shell integration, falling back to sendText")
		} finally {
			terminal.sendText(command)
			console.log(`Command "${command}" sent to terminal without shell integration`)
			lastUsedTerminal = terminal
		}
	}

	// Run a command in a new terminal
	const runInNewTerminal = vscode.commands.registerCommand(
		"shell-integration-problems.runInNewTerminal",
		async () => {
			const input = await vscode.window.showInputBox({ prompt: "Enter command to run in new terminal" })
			if (input) {
				const terminal = vscode.window.createTerminal({
					name: terminalProfileName,
					iconPath: new vscode.ThemeIcon("robot"),
				})
				runCommand(terminal, input)
			}
		}
	)

	// Run a command in an existing terminal
	const runInLastUsedTerminal = vscode.commands.registerCommand(
		"shell-integration-problems.runInLastUsedTerminal",
		async () => {
			if (lastUsedTerminal) {
				const input = await vscode.window.showInputBox({ prompt: "Enter command to run in last used terminal" })
				if (input) {
					runCommand(lastUsedTerminal, input)
				}
			} else {
				console.error("No terminal found")
			}
		}
	)

	context.subscriptions.push(runInNewTerminal, runInLastUsedTerminal)

	// Terminal Lifecycle

	context.subscriptions.push(
		vscode.window.onDidOpenTerminal((terminal) => {
			console.log(`Terminal opened: ${terminal.name}`)
			console.log(`Total terminals: ${vscode.window.terminals.length}`)
		})
	)

	context.subscriptions.push(
		vscode.window.onDidCloseTerminal((terminal) => {
			console.log(`Terminal closed: ${terminal.name}`)
			console.log(`Total terminals: ${vscode.window.terminals.length}`)
			if (terminal.exitStatus) {
				console.log(`Exit code: ${terminal.exitStatus.code}`)
			}
		})
	)

	// Shell Integration

	context.subscriptions.push(
		/**
		 * This will be fired when a terminal command is started. This event will fire only when
		 * [shell integration](https://code.visualstudio.com/docs/terminal/shell-integration) is
		 * activated for the terminal.
		 */
		vscode.window.onDidStartTerminalShellExecution(async (event) => {
			const stream = event.execution.read()
			for await (const chunk of stream) {
				console.log({ chunk })
			}
			console.log(`Shell execution started in terminal: ${event.terminal.name}`)
		})
	)

	context.subscriptions.push(
		/**
		 * Fires when shell integration activates or one of its properties changes in a terminal.
		 */
		vscode.window.onDidChangeTerminalShellIntegration((event) => {
			console.log(`Shell integration changed for terminal: ${event.terminal.name}`)
			if (event.terminal.name === terminalProfileName) {
				console.log(`Terminal ${event.terminal.name} is now tracked`)
			}
		})
	)

	context.subscriptions.push(
		/**
		 * This will be fired when a terminal command is ended. This event will fire only when
		 * [shell integration](https://code.visualstudio.com/docs/terminal/shell-integration) is
		 * activated for the terminal.
		 */
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

	console.log("Shell-Integration-Problems extension activated")
}

/**
 * Waits for a condition to be true, checking at regular intervals.
 * @param condition A function that returns a boolean or a Promise<boolean>.
 * @param options.interval The interval between checks in milliseconds.
 * @param options.timeout The maximum time to wait in milliseconds.
 * @returns A Promise that resolves when the condition is true, or rejects on timeout.
 */
function waitFor(
	condition: () => boolean | Promise<boolean>,
	options: { interval: number; timeout: number }
): Promise<void> {
	const { interval, timeout } = options
	if (interval === undefined || timeout === undefined) {
		throw new Error("Both interval and timeout must be provided")
	}
	return new Promise((resolve, reject) => {
		const startTime = Date.now()
		const check = async () => {
			if (await condition()) {
				resolve()
			} else if (Date.now() - startTime >= timeout) {
				reject(new Error("Timeout waiting for condition"))
			} else {
				setTimeout(check, interval)
			}
		}
		check()
	})
}

export function deactivate() {
	console.log("Shell-Integration-Problems extension deactivated")
}
