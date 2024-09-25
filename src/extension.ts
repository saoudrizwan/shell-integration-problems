import * as vscode from "vscode"
import * as util from "util"
import { logSystemInfo } from "./logSystemInfo"
import { waitFor } from "./waitFor"
/*


Resources:
- v1.93 Terminal shell integration API: https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api
- vscode-extension-samples/terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/terminal-sample/src/extension.ts
- vscode-extension-samples/shell-integration-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/shell-integration-sample/src/extension.ts
- vscode-extension-samples/extension-terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/extension-terminal-sample/src/extension.ts
- https://github.com/microsoft/vscode/blob/f0417069c62e20f3667506f4b7e53ca0004b4e3e/src/vscode-dts/vscode.d.ts#L10743-L10794
*/

export function activate(context: vscode.ExtensionContext) {
	let lastUsedTerminal: vscode.Terminal | undefined

	logSystemInfo()

	context.subscriptions.push(
		vscode.commands.registerCommand("shell-integration-problems.runInTerminal", async () => {
			let command = await vscode.window.showInputBox({ prompt: "Enter command to run in new terminal" })
			if (!command) {
				command = "date"
			}
			const terminal =
				lastUsedTerminal ??
				vscode.window.createTerminal({
					name: "shell-integration-problems",
					iconPath: new vscode.ThemeIcon("robot"),
				})
			terminal.show()
			try {
				console.log("Waiting for shell integration...")
				await waitFor(() => !!terminal.shellIntegration, { interval: 200, timeout: 4_000 })
				console.log("Shell integration available")
				const execution = terminal.shellIntegration!.executeCommand(command)
				console.log({ execution })
				const stream = execution.read()
				for await (const chunk of stream) {
					console.log("Read chunk:", util.inspect(chunk))
				}
			} catch (error) {
				console.error("Timed out waiting for shell integration, falling back to sendText")
				terminal.sendText(command)
				console.log(`Command "${command}" sent to terminal without shell integration`)
			} finally {
				lastUsedTerminal = terminal
			}
		})
	)

	context.subscriptions.push(
		/**
		 * This will be fired when a terminal command is started. This event will fire only when
		 * [shell integration](https://code.visualstudio.com/docs/terminal/shell-integration) is
		 * activated for the terminal.
		 */
		vscode.window.onDidStartTerminalShellExecution(async (event) => {
			console.log(`Shell execution started in terminal: ${event.terminal.name}`)
		})
	)

	context.subscriptions.push(
		/**
		 * Fires when shell integration activates or one of its properties changes in a terminal.
		 */
		vscode.window.onDidChangeTerminalShellIntegration((event) => {
			console.log(`Shell integration changed for terminal: ${event.terminal.name}`)
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
				`Shell execution ended in terminal ${event.terminal.name} with exit code ${
					event.exitCode ?? "undefined"
				} for command "${event.execution.commandLine.value}"`
			)
		})
	)

	context.subscriptions.push(
		vscode.window.onDidCloseTerminal((terminal) => {
			console.log(`Terminal ${terminal.name} closed`)
			if (terminal === lastUsedTerminal) {
				lastUsedTerminal = undefined
			}
		})
	)

	console.log("shell-integration-problems extension activated")
}

export function deactivate() {
	console.log("shell-integration-problems extension deactivated")
}
