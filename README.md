<img src="https://cloud.githubusercontent.com/assets/2157285/17261214/d2ee31f4-55e9-11e6-9e8e-4980ffe43c68.png" width="100" />

**The Universal Color Scheme Generator**

## What is this?

When you're writing a color scheme you end up having some concerns:

- There are many editors to support.
- You have to develop both for **Light** and **Dark**. The only difference between
  light and dark is the tone of the colors — why not define both in one place
  and let the software generate the rest?
- Colors defined by you are not always rendered correctly — some editors apply
  their own filters on top of your theme ([see this VSCode issue](https://github.com/Microsoft/vscode/issues/9629)).
  themeX bypasses this by adjusting colors at generation time so they render
  exactly as you intended.

themeX solves all of that. You define a theme **once**, alongside both its
**dark** and **light** variants, and themeX compiles it into the format your
editor actually wants.

This is the **second-generation** implementation. The original was a Node /
TypeScript project. This one is a **single static Go binary** with **zero
runtime dependencies** and **zero build dependencies** (just the Go standard
library). It currently targets **Visual Studio Code**; the original plugin
("adaptor") architecture was removed in favor of one well-tested builder.

## How to get it

### From source

```bash
git clone https://github.com/karyfoundation/themeX.git
cd themeX
make
sudo make install
```

That installs `themex` to `/usr/local/bin/themex`. To install elsewhere:

```bash
make install PREFIX=$HOME/.local      # no sudo needed
```

### Requirements

- Go ≥ 1.21 (build time only).
- Nothing at runtime. The binary is fully static.

## Creating a theme project

A themeX project is **just a folder ending in `.themex`** containing two YAML
files:

```
my-theme.themex/
├── theme.yml      # the theme definition (required)
└── project.yml    # extension metadata   (optional)
```

There is no `themex init` in this version — just create the folder and files
yourself:

```bash
mkdir my-theme.themex
cd my-theme.themex
$EDITOR theme.yml
$EDITOR project.yml
```

## `theme.yml`

This is the heart of themeX. It defines your colors, both the dark and light
variants, and the syntax rules shared between them.

```yaml
version: 1.0.0
author: Your Name
description: A cool theme
colorSpaceName: sRGB

themes:
  - name: My Dark Theme
    uuid: 00000000-0000-0000-0000-000000000001
    baseColor: dark
    style: dark
    colors:
      red: FF0000
      green: 00FF00
      blue: 61AFEF
      comment: 6A9955
    settings:
      background: "#1e1e1e"
      foreground: "#d4d4d4"
      caret: "#ffffff"
      invisibles: "#404040"
      lineHighlight: "#2a2a2a"
      selection: "#264f78"
      comment: ".comment"

  - name: My Light Theme
    uuid: 00000000-0000-0000-0000-000000000002
    baseColor: light
    style: light
    colors:
      red: D32F2F
      green: 388E3C
      blue: 1976D2
      comment: 008000
    settings:
      background: "#ffffff"
      foreground: "#000000"
      caret: "#000000"
      invisibles: "#e0e0e0"
      lineHighlight: "#f5f5f5"
      selection: "#add6ff"
      comment: ".comment"

rules:
  - name: Keywords
    scope: keyword
    color: ".blue"
    bold: true
  - name: Strings
    scope: string
    color: ".green"
  - name: Comments
    scopes:
      - comment
      - comment.line
    color: ".comment"
```

### Field reference

**Top level**

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Theme version. |
| `author` | string | Author name. |
| `description` | string | Theme description. |
| `colorSpaceName` | string (optional) | Recorded in the output. |
| `themes` | list | One entry per variant (dark, light, …). |
| `rules` | list | Shared syntax rules applied to every theme. |

**Each entry in `themes`**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name. Used for the output filename and extension label. |
| `uuid` | string | Unique identifier. |
| `baseColor` | string | `dark` or `light`. Controls the fallback color and the generated VS Code `type`. |
| `style` | string | Alias for `baseColor` — kept for backwards compatibility. |
| `colors` | map | Named colors, referenced from rules as `.name`. |
| `settings` | map | Editor chrome colors (see below). |

**`settings`**

| Key | Description |
|-----|-------------|
| `background` | Editor background (required). |
| `foreground` | Default text color (required). |
| `caret` | Cursor color. |
| `invisibles` | Whitespace markers. |
| `lineHighlight` | Current-line highlight. |
| `selection` | Selection background. |
| `comment` | Default color for `comment`-scope tokens. |

**Each entry in `rules`**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name. |
| `scope` | string (optional) | Single TextMate scope. |
| `scopes` | list (optional) | Multiple scopes. Use instead of `scope`. |
| `color` | string | Color — hex or `.name`. |
| `bold` | bool (optional) | Render bold. |
| `italic` | bool (optional) | Render italic. |
| `underline` | bool (optional) | Render underlined. |

At least one of `scope` or `scopes` must be present on every rule.

## `project.yml`

Optional. Supplies the metadata VS Code uses for the **extension** wrapper
around your theme.

```yaml
name: my-theme                          # extension id (defaults to folder name)
publisher: your-publisher-id            # VS Code marketplace publisher
repository: https://github.com/you/my-theme
```

Only used when generating `package.json`. Skip the file entirely if you just
want the raw `.json` theme files.

## Colors

A color value in a `rule` or in `settings` can be:

- **A hex color:** `"#61AFEF"`, `"61afef"`, `"#61AFEFFF"`. The leading `#`
  is optional; case is normalized to uppercase in the output.
- **A named reference:** `".blue"` — resolved against `themes[].colors.blue`
  **for that specific variant**. This is how one rule produces a different
  color in the dark and light theme.

If the value can't be resolved (bad hex, unknown name), themeX falls back to
`#FFFFFF` on a dark theme and `#000000` on a light theme.

## Building

From **inside** the `.themex` folder:

```bash
themex
```

Or point at it from anywhere:

```bash
themex path/to/my-theme.themex
```

Both do the same thing. Output goes to a `builds/` directory **next to** the
`.themex` folder:

```
my-theme.themex/          ← your project
builds/
└── vscode/               ← generated
    ├── mydarktheme-color-theme.json
    ├── mylighttheme-color-theme.json
    └── package.json      ← only if project.yml is present
```

`builds/vscode/` is a valid VS Code extension folder. You can either:

- Point `--extensionDevelopmentPath` at it while developing, or
- Package it with [`vsce`](https://github.com/microsoft/vscode-vsce)
  (`cd builds/vscode && vsce package`) and install the resulting `.vsix`.

## Validating

```bash
themex test
```

Runs the same validation `themex` uses before generating, but without writing
anything. Useful for CI. Returns `0` on success, `1` on error.

## CLI reference

```
themex                   Build the .themex folder in the current directory.
themex <dir>.themex      Build the given folder.
themex test              Validate the project in the current directory.
```

Anything else prints the help banner.

## Building from source

```bash
make           # build → dist/themex
make test      # go test ./...
make vet       # go vet ./src
make fmt       # gofmt -w ./src
make clean     # rm -rf dist
make run ARGS="test"
```

## Project layout

```
themeX/
├── Makefile
├── go.mod
├── README.md
├── src/
│   ├── main.go     # CLI entrypoint, banner, help
│   ├── yaml.go     # tiny YAML parser (stdlib only)
│   ├── theme.go    # data model, loader, validator
│   ├── colors.go   # hex / .named color resolution
│   └── vscode.go   # VS Code theme + extension generator
└── dist/           # build output (gitignored)
```

## What changed from the original

If you used themeX before, the important differences are:

- **Go instead of Node / TypeScript.** No `npm install`, no `tsc`.
- **No adaptor plugin system.** Only the VS Code builder ships.
- **No `themex init`.** Create the folder yourself.
- **Real VS Code output.** The original shipped a `vscode.adaptorX` that was
  a stub; this one produces complete `*-color-theme.json` files plus a
  `package.json` extension manifest.
- **Same `.themex` format.** Existing `theme.yml` files work as-is.
- **Same output location.** `../builds/<editor>/`.

## License

Apache-2.0. Copyright 2016-present Kary Foundation, Inc.
