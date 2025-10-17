# Python Interpreter Favorites

## DISCLAIMER

This is almost entirely coded by AI and created for my personal needs.

Quickly switch between your favorite Python interpreters with a simple dropdown menu. No more hunting through the full list of discovered interpreters!

## Features

- ⚡ **Quick Switching**: Use the command palette to instantly switch between your favorite Python interpreters
- 🌍 **Global & Workspace Settings**: Configure favorites at both user (global) and workspace level
- 🔀 **Smart Merging**: Workspace favorites are combined with user favorites for maximum flexibility
- 📁 **Variable Substitution**: Use `${workspaceFolder}`, `${userHome}`, and environment variables in paths
- ✅ **Path Validation**: Visual warnings for interpreters with invalid paths
- 🎯 **Immediate Activation**: Selected interpreters are activated instantly without manual confirmation

## Usage

1. **Configure your favorites** in VS Code settings:
   - Press `Ctrl+,` (or `Cmd+,` on Mac) to open Settings
   - Search for "Python Interpreter Favorites"
   - Add your favorite interpreters

2. **Switch interpreters**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Python: Select Favorite Interpreter"
   - Select your desired interpreter from the dropdown

## Configuration

### User (Global) Settings

Configure interpreters that should be available in all workspaces:

```json
{
  "pythonInterpreterFavorites.interpreters": [
    {
      "label": "Python 3.11 System",
      "path": "/usr/bin/python3.11"
    },
    {
      "label": "Python 3.12 System",
      "path": "C:\\Python312\\python.exe"
    }
  ]
}
```

### Workspace Settings

Configure project-specific interpreters in `.vscode/settings.json`:

```json
{
  "pythonInterpreterFavorites.interpreters": [
    {
      "label": "Project Virtual Environment",
      "path": "${workspaceFolder}/.venv/bin/python"
    },
    {
      "label": "Project Conda Environment",
      "path": "${userHome}/anaconda3/envs/myproject/bin/python"
    }
  ]
}
```

### Variable Substitution

Supported variables:
- `${workspaceFolder}` - The path of the workspace folder
- `${userHome}` - The user's home directory
- `${env:VARIABLE}` - Environment variables (e.g., `${env:HOME}`)

## Requirements

- Visual Studio Code 1.85.0 or higher
- [Python Extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) by Microsoft

## Extension Settings

This extension contributes the following settings:

* `pythonInterpreterFavorites.interpreters`: Array of favorite Python interpreter configurations. Each entry requires:
  * `label`: Display name for the interpreter
  * `path`: Full path to the Python executable

## Tips

- Workspace-level favorites appear first in the dropdown, followed by user-level favorites
- Duplicate paths (same interpreter in both workspace and user settings) are automatically deduplicated, with workspace taking precedence
- Invalid paths are marked with a ⚠️ warning but can still be set if needed

## Release Notes

### 0.1.0

Initial release of Python Interpreter Favorites

- Quick switching between favorite interpreters
- User and workspace-level configuration
- Variable substitution in paths
- Path validation
- Immediate interpreter activation

## License

MIT

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/jh0ker/python-interpreter-favorites).

---

**Enjoy!** 🐍
