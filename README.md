# Shell Integration Problems

This repository is designed to help reproduce and report issues with VSCode's new Shell Integration API. It's particularly useful for users of the Claude Dev extension who are experiencing problems related to shell integration.

## Purpose

The main goals of this repository are:

1. To provide a minimal reproducible environment for shell integration issues.
2. To help the VSCode team debug and fix problems with the Shell Integration API.
3. To assist users of the Claude Dev extension in reporting shell integration-related issues.

## How to Use This Extension

### Setup

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

### Using the Extension

The extension provides two commands:

1. `shell-integration-problems: Run in New Terminal`
2. `shell-integration-problems: Run in Last Used Terminal`

You can access these commands through the Command Palette (Ctrl+Shift+P or Cmd+Shift+P).

### Observing Results and Reporting Issues

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
