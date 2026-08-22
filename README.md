# incredibox-scratch-mod-template
This is a template for converting Scratch-based Incredibox mods into websites, which can then be turned into Android and desktop applications.

[![GitHub stars](https://img.shields.io/github/stars/Ovelhart/incredibox-scratch-mod-template)](https://github.com/Ovelhart/incredibox-scratch-mod-template/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Ovelhart/incredibox-scratch-mod-template)](https://github.com/Ovelhart/incredibox-scratch-mod-template/network/members)

# Features
* Supports multiple mods/versions from a single template, all listed in `versions.json` and picked with the `?v=` URL parameter.
* The mod's theme can change based on the player's selected theme. For example, if the player selects dark mode, the mod will reflect that choice when the game starts.
* To achieve this, the `"Dark mode"` actor's costume is set to `1` for dark mode and `0` for light mode. The setting is checked and updated every two seconds.
* It allows you to use an image as the mod's title.
* It allows you to set a custom background image for the home screen.
* To modify a mod's settings and colors, you only need to edit a single file: `versions.json`, located in the root folder.

# How versions work
Each mod is defined as an object inside `versions.json`. The `"folder"` field points to the mod's asset folder, and that same value is used in the URL (`app.html?v=folder-name`) to select which mod loads. This lets you keep several mods in the same template without duplicating any of the site files.

```json
[
  {
    "folder": "assets-v1",
    "icon": "assets-v1/icon.jpg",
    "background-image": "img/home-screen.jpg",
    "mod-name": "Modbox"
  }
]
```

Add more objects to the array to add more mods to the selection screen in `index.html`.

# How to change the colors
To modify the colors in `index.html` (the interface with the "Play" button), edit the `versions.json` file. Each mod entry contains a `"colors"` section listing six colors in the same order as in Incredibox. If you have trouble adjusting the colors correctly, I recommend using [this tool](https://ovelhart.github.io/Incredibox-Tools/tools/colors.html) that I created for this purpose.

To change the colors of the loading screen and the game background in `app.html`, edit the `"dark"` and `"light"` sections of that mod's entry:
```json
"dark": {
  "appBackgroundColor": "#000000"
},
"light": {
  "appBackgroundColor": "#ffffff"
}
```
These sections contain the colors for the dark and light modes, respectively.

# How to change the settings
To change the settings, edit the mod's entry in `versions.json`:
```json
"theme-toggle": true,
"default-theme": "dark",
```
`"theme-toggle"` determines whether the theme toggle is enabled, while `"default-theme"` sets the default theme, which can be `"dark"` or `"light"`.

# How to change the mod name and credits
To change the mod's name and credits, edit the `"port-by": "your name"` and `"mod-by": "GamerXD1010"` fields in that mod's entry in `versions.json`.

# How to change the title to an image
To use an image as the title, change the `"mode"` field inside `"title"` to `"image"`. If the image appears too small, adjust the `"size"` field. If your title image has a different filename, update the `"image"` field accordingly.

# How to change the home screen background
Set the `"background-image"` field in the mod's entry to the path of your image, relative to that mod's folder. It's applied automatically to the home screen when the mod loads.

# Information
I used Scaffolding to run the project.
If you'd like to test it, here is the [link](https://ovelhart.github.io/incredibox-scratch-mod-template/).
