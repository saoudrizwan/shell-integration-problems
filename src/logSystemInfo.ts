import * as vscode from "vscode"
import { execSync } from "child_process"
import * as os from "os"

/**
 * This function logs various system details:
 * - Operating System information (platform, release, type, architecture)
 * - Shell information (name, path, version)
 * - Node.js version
 * - VSCode version
 *
 * The collected information is useful for troubleshooting and providing context
 * when reporting issues related to shell integration or other system-dependent
 * functionalities.
 */
export async function logSystemInfo() {
	let info = ""

	// Get OS info
	const platform = os.platform() // e.g., 'win32', 'darwin', 'linux'
	const release = os.release() // e.g., '10.0.19042'
	const infoType = os.type() // e.g., 'Windows_NT', 'Darwin', 'Linux'
	const arch = os.arch() // e.g., 'x64', 'arm'
	info += `OS: ${infoType} ${platform} ${arch} ${release}\n`

	// Get default shell
	let shellPath: string | undefined
	if (process.platform === "win32") {
		shellPath = process.env.COMSPEC || "cmd.exe"
	} else {
		try {
			const { shell } = os.userInfo()
			if (shell) {
				shellPath = shell
			}
		} catch {}
		if (!shellPath) {
			if (process.platform === "darwin") {
				shellPath = process.env.SHELL || "/bin/zsh"
			} else {
				shellPath = process.env.SHELL || "/bin/sh"
			}
		}
	}
	info += `Shell: ${shellPath}\n`

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

	// Get Node.js version
	info += `Node.js Version: ${process.version}\n`

	// Get VSCode version
	info += `VSCode Version: ${vscode.version}\n`

	console.log(info)
}
