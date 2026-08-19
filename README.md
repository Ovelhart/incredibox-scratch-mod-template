# incredibox-scratch-mod-template

This is a template for converting Scratch-based Incredibox mods into websites, which can then be turned into Android and desktop applications.

# How to change the colors

To modify the colors in `index.html` (the interface with the "Play" button), edit the `colors.json` file. It contains six colors in the same order as Incredibox. If you're having trouble getting the colors to look right, I recommend using [this tool](https://ovelhart.github.io/Incredibox-Tools/tools/colors.html) that I created for this purpose.

To change the colors of the loading screen and the game background in `app.html`, edit the `app-colors.json` file. It contains the colors for both dark and light modes.

# How to change the settings

To change the settings, edit the `app-config.json` file. It contains the following configuration:

```json
{
  "theme-toggle": true,
  "default-theme": "dark"
}
```

`"theme-toggle"` determines whether the theme toggle is enabled, while `"default-theme"` sets the default theme, which can be either `"dark"` or `"light"`.
