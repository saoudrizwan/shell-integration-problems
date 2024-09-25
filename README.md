## Shell Integration Problems

This repository is designed to help reproduce and report issues with VSCode 1.93's new [Terminal Shell Integration API](https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api). It was created for users of the [Claude Dev extension](https://github.com/saoudrizwan/claude-dev) who are experiencing problems related to shell integration.

The main goals of this repository are:

-   To provide a minimal reproducible environment for shell integration issues.
-   To help the VSCode team debug and fix problems with the Shell Integration API.
-   To assist users of the Claude Dev extension in reporting shell integration-related issues.

## Process for Submitting Issues

1. [Prerequisites: Setting Up Shell Integration](#1-prerequisites-setting-up-shell-integration)
2. [Reproducing the Issue with This Extension](#2-reproducing-the-issue-with-this-extension)
3. [Observing Results and Reporting Issues](#3-observing-results-and-reporting-issues)

### 1. Prerequisite: Setting Up Shell Integration

Before using this extension, ensure that you have properly tried to set up shell integration:

1. Update VSCode to the latest version:
    - Open the Command Palette (Cmd+Shift+P on Mac, Ctrl+Shift+P on Windows/Linux)
    - Type "Check for Updates" and select it
    - Install any available updates
2. Configure VSCode to use a supported shell (zsh, bash, fish, or PowerShell):
    - Open the Command Palette
    - Type "Terminal: Select Default Profile" and select one of the supported shells: zsh, bash, fish, or PowerShell.
3. Restart VSCode and try the shell integration again.

If you're still experiencing issues, try the following additional steps:

4. For Windows PowerShell users:
    - Ensure you're using PowerShell v7+
    - Check and update your execution policy if necessary:
        - Open PowerShell as an Administrator: Press Win + X and select "Windows PowerShell (Administrator)" or "Windows Terminal (Administrator)".
        - Check Current Execution Policy by running this command:
            ```
            Get-ExecutionPolicy
            ```
            - If the output is already RemoteSigned, Unrestricted, or Bypass, you likely don't need to change your execution policy. These policies should allow shell integration to work.
            - If the output is Restricted or AllSigned, you may need to change your policy to enable shell integration.
        - Change the Execution Policy by running the following command:
            ```
            Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
            ```
            This sets the policy to RemoteSigned for the current user only, which is safer than changing it system-wide.
        - Confirm the Change by typing Y and pressing Enter when prompted.
        - Verify the Policy Change by running `Get-ExecutionPolicy` again to confirm the new setting.
        - Restart VSCode and try the shell integration again.
5. Consider manually installing shell integration:
   If you're still experiencing issues after trying the basic troubleshooting steps, you can try [manually installing](https://code.visualstudio.com/docs/terminal/shell-integration#_manual-installation) shell integration.

    For example, if you use zsh:

    - Run `code ~/.zshrc` in the terminal to open your zsh configuration file.
    - Add the following line to your ~/.zshrc:
        ```
        [[ "$TERM_PROGRAM" == "vscode" ]] && . "$(code --locate-shell-integration-path zsh)"
        ```
    - Save the file.
    - Restart VSCode and try the shell integration again.

    If you use PowerShell:

    - Run `code $Profile` in the terminal to open your PowerShell profile.
    - Add the following line to the file:
        ```
        if ($env:TERM_PROGRAM -eq "vscode") { . "$(code --locate-shell-integration-path pwsh)" }
        ```
    - Save the file.
    - Restart VSCode and try the shell integration again.

### 2. Reproducing the Issue with This Extension

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
4. Press F5 to run the extension in a new VSCode window.

The extension provides a command:

`shell-integration-problems: Run in Terminal`

You can access this command through the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).

If your command is specific to your original project where you used Claude Dev:

5. In the new VSCode window (debugger window):
   a. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).
   b. Select "File: Open Folder" and choose your original project folder.
6. Navigate to your project files and use the `shell-integration-problems: Run in Terminal` command for project-specific tasks.

### 3. Observing Results and Reporting Issues

1. Open the Debug Console to see detailed logs.
2. Run the commands and observe the output in this panel.
3. After reproducing the issue, right-click in the Debug Console and select "Copy All" to copy all logs.

![Debug Console with Copy All option]()

If you encounter any problems or unexpected behavior:

1. Go to the [Issues](https://github.com/saoudrizwan/shell-integration-problems/issues) page of this repository.
2. Click on "New Issue".
3. Select the "Bug Report" template.
4. Fill out the bug report form with the following information:
    - Commands Run: List the commands you executed using the extension.
    - Command Results: Paste the console logs from the extension.ts file for the commands you ran.
    - Additional Context: Provide any other relevant information about the issue.

Your contributions will help improve the Shell Integration API and the Claude Dev extension. Thank you for your help!
