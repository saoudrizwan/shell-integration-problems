import * as vscode from "vscode"
import { execSync } from "child_process"
import * as os from "os"
import * as path from "path"

export async function logSystemInfo() {
	let info = ""

	// Get OS info
	const platform = os.platform() // e.g., 'win32', 'darwin', 'linux'
	const release = os.release() // e.g., '10.0.19042'
	const infoType = os.type() // e.g., 'Windows_NT', 'Darwin', 'Linux'
	const arch = os.arch() // e.g., 'x64', 'arm'
	info += `OS: ${infoType} ${platform} ${arch} ${release}\n`

	// Get shell info
	let shellPath = process.env.SHELL || process.env.ComSpec || process.env.POWER_SHELL
	let shellName = "Unknown"
	if (shellPath) {
		shellName = path.basename(shellPath).toLowerCase()
		// On Windows, detect if it's PowerShell
		if (process.platform === "win32") {
			if (shellPath.toLowerCase().includes("powershell")) {
				shellName = "PowerShell"
			} else if (shellPath.toLowerCase().includes("cmd.exe")) {
				shellName = "Command Prompt (cmd.exe)"
			} else {
				shellName = path.basename(shellPath)
			}
		}
		info += `Shell: ${shellName} (${shellPath})\n`
	} else {
		info += `Shell: Not Detected\n`
	}

	// Get shell version
	try {
		let shellVersion = "Unable to determine"
		if (shellPath?.toLowerCase().includes("powershell")) {
			// For PowerShell, use the appropriate flag
			shellVersion = execSync(`${shellPath} -Command "$PSVersionTable.PSVersion"`, { encoding: "utf8" }).trim()
		} else {
			// Attempt a generic version flag
			shellVersion = execSync(`${shellPath} --version`, { encoding: "utf8" }).trim()
		}
		info += `Shell Version: ${shellVersion}\n`
	} catch (error) {
		info += `Shell Version: Unable to determine (${JSON.stringify(error)})\n`
	}

	// Get VSCode version
	info += `VSCode Version: ${vscode.version}\n`

	// Get Node.js version
	info += `Node.js Version: ${process.version}\n`

	console.log(info)
}
