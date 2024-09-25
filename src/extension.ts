import * as util from "util"
import * as vscode from "vscode"
import { logSystemInfo } from "./logSystemInfo"
import { waitFor } from "./waitFor"

/*
This extension provides functionality to run shell commands in a VSCode terminal
and interact with the Terminal Shell Integration API. It allows users to:

1. Enter shell commands through an input box
2. Execute these commands in a terminal
3. Utilize shell integration features when available
4. Fall back to basic text sending when shell integration is not available
5. Log output and system information for debugging purposes

The extension is designed to help reproduce and report issues related to
VSCode's Terminal Shell Integration API, particularly for users of the
Claude Dev extension experiencing shell integration problems.

Resources:
- v1.93 Terminal Shell Integration API: https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api
- vscode-extension-samples/terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/terminal-sample/src/extension.ts
- vscode-extension-samples/shell-integration-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/shell-integration-sample/src/extension.ts
- vscode-extension-samples/extension-terminal-sample: https://github.com/microsoft/vscode-extension-samples/blob/main/extension-terminal-sample/src/extension.ts
- Shell Integration API Types: https://github.com/microsoft/vscode/blob/f0417069c62e20f3667506f4b7e53ca0004b4e3e/src/vscode-dts/vscode.d.ts#L10743-L10794
*/
export function activate(context: vscode.ExtensionContext) {
	let lastUsedTerminal: vscode.Terminal | undefined

	logSystemInfo()

	context.subscriptions.push(
		vscode.commands.registerCommand("shell-integration-problems.runInTerminal", async () => {
			let command = await vscode.window.showInputBox({ prompt: "Enter command to run in the terminal" })
			if (!command) {
				return
			}
			console.log(`Running command: ${command}`)
			const terminal =
				lastUsedTerminal ??
				vscode.window.createTerminal({
					name: "shell-integration-problems",
					iconPath: new vscode.ThemeIcon("robot"),
				})
			terminal.show()
			try {
				console.log("Waiting for shell integration...")
				await waitFor(() => !!terminal.shellIntegration, { interval: 200, timeout: 5_000 })
				console.log("Shell integration available")
				const execution = terminal.shellIntegration!.executeCommand(command)
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
		vscode.window.onDidStartTerminalShellExecution(async (event) => {
			console.log(`Shell execution started in terminal ${event.terminal.name}`)
		})
	)

	context.subscriptions.push(
		vscode.window.onDidChangeTerminalShellIntegration((event) => {
			console.log(`Shell integration changed for terminal ${event.terminal.name}`)
		})
	)

	context.subscriptions.push(
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
}
