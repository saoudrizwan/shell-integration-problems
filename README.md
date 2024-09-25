# Shell Integration Problems

This repository provides a minimal reproducible environment to help report issues with VSCode 1.93's new [Terminal Shell Integration API](https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api). It aims to assist the VSCode team in improving the API, and was created for users of the [Claude Dev extension](https://github.com/saoudrizwan/claude-dev) experiencing shell integration problems.

1. [Prerequisite: Basic Shell Integration Troubleshooting](#1-prerequisite-basic-shell-integration-troubleshooting)
2. [Reproducing Shell Integration Problems with This Extension](#2-reproducing-shell-integration-problems-with-this-extension)
3. [Observing Results and Submitting a Report](#3-observing-results-and-submitting-a-report)

## 1. Prerequisite: Basic Shell Integration Troubleshooting

Before using this extension to report an issue, ensure that you have properly tried to set up shell integration:

1. Update VSCode to the latest version:
    - Open the Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
    - Type "Check for Updates" and install any available updates
2. Configure VSCode to use a supported shell (zsh, bash, fish, or PowerShell):
    - Open the Command Palette
    - Type "Terminal: Select Default Profile" and select one of the supported shells
3. Remove any shell customization frameworks like `Powerlevel10k` or `Oh My Zsh` (not to be confused with `zsh`, `Oh My Zsh` is an add-on to `zsh`)
    - For example, if you're using `Powerlevel10k` with `zsh`, you can disable it by commenting out the relevant line in your `~/.zshrc` file:
        ```
        # Comment out the Powerlevel10k source line
        # source /path/to/powerlevel10k/powerlevel10k.zsh-theme
        ```
4. Restart VSCode and try the shell integration again.

If you're still experiencing issues, try the following additional steps:

5. For Windows PowerShell users:
    - Ensure you're using PowerShell v7+:
        - Check your current PowerShell version by running: `$PSVersionTable.PSVersion`
        - If your version is below 7, [update PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7?view=powershell-7.4#installing-powershell-7).
    - Check and update your execution policy if necessary:
        - Open PowerShell as an Administrator: Press `Win+X` and select "Windows PowerShell (Administrator)" or "Windows Terminal (Administrator)".
        - Check Current Execution Policy by running this command: `Get-ExecutionPolicy`
            - If the output is already `RemoteSigned`, `Unrestricted`, or `Bypass`, you likely don't need to change your execution policy. These policies should allow shell integration to work.
            - If the output is `Restricted` or `AllSigned`, you may need to change your policy to enable shell integration.
        - Change the Execution Policy by running the following command: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.
        - Confirm the Change by typing `Y` and pressing Enter when prompted.
        - Verify the Policy Change by running `Get-ExecutionPolicy` again to confirm the new setting.
        - Restart VSCode and try the shell integration again.
6. If you're still experiencing issues after trying the basic troubleshooting steps, you can try [manually installing](https://code.visualstudio.com/docs/terminal/shell-integration#_manual-installation) shell integration.

    For example, if you use zsh:

    - Run `code ~/.zshrc` in the terminal to open your zsh configuration file, and add the following line:
        ```
        [[ "$TERM_PROGRAM" == "vscode" ]] && . "$(code --locate-shell-integration-path zsh)"
        ```
    - Save the file, restart VSCode, and try the shell integration again.

    If you use PowerShell:

    - Run `code $Profile` in the terminal to open your PowerShell profile, and add the following line:
        ```
        if ($env:TERM_PROGRAM -eq "vscode") { . "$(code --locate-shell-integration-path pwsh)" }
        ```
    - Save the file, restart VSCode, and try the shell integration again.

## 2. Reproducing Shell Integration Problems with This Extension

1. Clone this repository:
    ```
    git clone https://github.com/saoudrizwan/shell-integration-problems.git
    ```
2. Install the necessary dependencies:
    ```
    cd shell-integration-problems
    npm install
    ```
3. Open the cloned repository in VSCode.
4. Press F5 to run the extension in a new debugger window.

The extension provides a command you can access through the Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux):

`shell-integration-problems: Run in Terminal`

Selecting this command will prompt you to enter a shell command. The extension will attempt to execute the command in a terminal using shell integration, and the output will be logged in the primary window's Debug Console.

If your command is specific to your original project where you used Claude Dev:

1. In the debugger window, open the Command Palette.
2. Select "File: Open Folder" and choose your original project folder.
3. Use `shell-integration-problems: Run in Terminal` for project-specific commands.

## 3. Observing Results and Submitting a Report

1. Open the Debug Console in the primary window to see console logs.
2. Run the commands in the debugger window and observe the output in this panel.
3. After reproducing the issue, right-click in the Debug Console and select "Copy All" to copy all logs.

![Debug Console Screenshot](https://github.com/user-attachments/assets/cdf046e2-eb8c-4386-82ba-f70a2e5daef3)

4. Go to the [Report Shell Integration Problem](https://github.com/saoudrizwan/shell-integration-problems/issues/new?template=shell_integration_problem.yml) page.
5. Fill out the issue form with the following information:
    - Debug Console Logs: Paste the console logs from the Debug Console.
    - Additional Information: Provide any other relevant details about the issue.

Your report will help improve the Shell Integration API and the Claude Dev extension. Thank you for your help!
