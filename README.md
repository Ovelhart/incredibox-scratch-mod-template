# incredibox-scratch-mod-template

This is a template for converting Scratch-based Incredibox mods into websites, which can then be turned into Android and desktop applications.

[![GitHub stars](https://img.shields.io/github/stars/Ovelhart/incredibox-scratch-mod-template)](https://github.com/Ovelhart/incredibox-scratch-mod-template/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Ovelhart/incredibox-scratch-mod-template)](https://github.com/Ovelhart/incredibox-scratch-mod-template/network/members)

# Features

* The mod's theme can change based on the player's selected theme. For example, if the player selects dark mode, the mod will reflect that choice when the game starts.

* To achieve this, the `"Dark mode"` actor's costume is set to `1` for dark mode and `0` for light mode. The setting is checked and updated every two seconds.


# How to change the colors

To modify the colors in `index.html` (the interface with the "Play" button), edit the `colors.json` file. It contains six colors in the same order as Incredibox. If you're having trouble getting the colors to look right, I recommend using [this tool](https://ovelhart.github.io/Incredibox-Tools/tools/colors.html) that I created for this purpose.

To change the colors of the loading screen and the game background in `app.html`, edit the `app-colors.json` file. It contains the colors for both dark and light modes.

# How to change the settings

To change the settings, edit the `app.json` file in the mod folder. It contains the following configuration:

```json
{
  "theme-toggle": true,
  "default-theme": "dark"
}
```

`"theme-toggle"` determines whether the theme toggle is enabled, while `"default-theme"` sets the default theme, which can be `"dark"` or `"light"`.

# How to change the mod name and credits

To change the mod's name and credits, edit the `"port-by": "your name"` and `"mod-by": "GamerXD1010"` fields in the `app.json` file located in the mod folder.

# How to change the title to an image

To use an image as the title, change the `"mode"` field in `app.json` to `"image"`. If the image appears too small, adjust the `"size"` field. If your title image has a different filename, update the `"image"` field accordingly.

# Information

I used forkphorus to run the project.

If you'd like to test it, here is the [link](https://ovelhart.github.io/incredibox-scratch-mod-template/).
