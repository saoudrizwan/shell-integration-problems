import * as vscode from "vscode"
import { execSync } from "child_process"

export async function logSystemInfo(): Promise<string> {
	let info = ""

	// Get OS info
	const platform = process.platform
	const release = process.release
	info += `OS: ${platform} ${release.name} ${release.lts || ""}\n`

	// Get shell info
	const shell = process.env.SHELL || process.env.ComSpec
	info += `Shell: ${shell}\n`

	// Get shell version (this may not work for all shells)
	try {
		let shellVersion: string
		if (process.platform === "win32") {
			// For PowerShell
			shellVersion = execSync(`${shell} -Version`).toString().trim()
		} else {
			// For Unix-like shells
			shellVersion = execSync(`${shell} --version`).toString().trim()
		}
		info += `Shell Version: ${shellVersion}\n`
	} catch (error) {
		info += `Shell Version: Unable to determine\n`
	}

	// Get VSCode version
	info += `VSCode Version: ${vscode.version}\n`

	// Get Node.js version
	info += `Node.js Version: ${process.version}\n`

	return info
}
