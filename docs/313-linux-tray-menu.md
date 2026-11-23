# Linux tray menu (#313)

The tray menu has an "Open GifBar" item on every platform.
Tauri 2 does not emit tray click events on Linux (libappindicator), so a left click never reaches the app there.
The menu item is the only way to open the window on Linux.
