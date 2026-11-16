package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type VSCodeTheme struct {
	Schema      string            `json:"$schema,omitempty"`
	Name        string            `json:"name"`
	Type        string            `json:"type"`
	Colors      map[string]string `json:"colors"`
	TokenColors []TokenColor      `json:"tokenColors"`
}

type TokenColor struct {
	Name     string        `json:"name,omitempty"`
	Scope    interface{}   `json:"scope,omitempty"`
	Settings TokenSettings `json:"settings"`
}

type TokenSettings struct {
	Foreground string `json:"foreground,omitempty"`
	FontStyle  string `json:"fontStyle,omitempty"`
}

type ExtensionManifest struct {
	Name        string            `json:"name"`
	DisplayName string            `json:"displayName"`
	Description string            `json:"description"`
	Version     string            `json:"version"`
	Publisher   string            `json:"publisher,omitempty"`
	Repository  *RepositoryRef    `json:"repository,omitempty"`
	Engines     map[string]string `json:"engines"`
	Categories  []string          `json:"categories"`
	Contributes Contributes       `json:"contributes"`
}

type RepositoryRef struct {
	Type string `json:"type"`
	URL  string `json:"url"`
}

type Contributes struct {
	Themes []ThemeContribution `json:"themes"`
}

type ThemeContribution struct {
	Label   string `json:"label"`
	UITheme string `json:"uiTheme"`
	Path    string `json:"path"`
}

func GenerateVSCode(b *Bundle) error {
	dir := filepath.Join(buildsDirectoryPath(b.Path), "vscode")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("creating build dir: %w", err)
	}

	var contributions []ThemeContribution
	for i := range b.Project.Themes {
		t := &b.Project.Themes[i]
		vt := buildVSCodeTheme(t, b.Project.Rules)

		data, err := json.MarshalIndent(vt, "", "    ")
		if err != nil {
			return fmt.Errorf("marshaling theme %q: %w", t.Name, err)
		}

		fileName := fileNameForTheme(t.Name) + "-color-theme.json"
		if err := os.WriteFile(filepath.Join(dir, fileName), data, 0o644); err != nil {
			return fmt.Errorf("writing theme %q: %w", t.Name, err)
		}

		contributions = append(contributions, ThemeContribution{
			Label:   t.Name,
			UITheme: uiThemeFor(t),
			Path:    "./" + fileName,
		})

		print(fmt.Sprintf("built %s", t.Name))
	}

	manifest := buildManifest(b, contributions)
	data, err := json.MarshalIndent(manifest, "", "    ")
	if err != nil {
		return fmt.Errorf("marshaling package.json: %w", err)
	}
	if err := os.WriteFile(filepath.Join(dir, "package.json"), data, 0o644); err != nil {
		return fmt.Errorf("writing package.json: %w", err)
	}

	print(fmt.Sprintf("wrote %s", dir))
	return nil
}

func buildVSCodeTheme(t *Theme, rules []Rule) VSCodeTheme {
	vt := VSCodeTheme{
		Schema:      "vscode://schemas/color-theme",
		Name:        t.Name,
		Type:        themeType(t),
		Colors:      map[string]string{},
		TokenColors: []TokenColor{},
	}

	vt.Colors["editor.background"] = ResolveColor(t, t.Settings.Background)
	vt.Colors["editor.foreground"] = ResolveColor(t, t.Settings.Foreground)

	if t.Settings.Caret != "" {
		vt.Colors["editorCursor.foreground"] = ResolveColor(t, t.Settings.Caret)
	}
	if t.Settings.Invisibles != "" {
		vt.Colors["editorWhitespace.foreground"] = ResolveColor(t, t.Settings.Invisibles)
	}
	if t.Settings.LineHighlight != "" {
		vt.Colors["editor.lineHighlightBackground"] = ResolveColor(t, t.Settings.LineHighlight)
	}
	if t.Settings.Selection != "" {
		vt.Colors["editor.selectionBackground"] = ResolveColor(t, t.Settings.Selection)
	}

	if t.Settings.Comment != "" {
		vt.TokenColors = append(vt.TokenColors, TokenColor{
			Name:     "Comment",
			Scope:    "comment",
			Settings: TokenSettings{Foreground: ResolveColor(t, t.Settings.Comment)},
		})
	}

	for _, r := range rules {
		tc := TokenColor{
			Name:     r.Name,
			Settings: TokenSettings{Foreground: ResolveColor(t, r.Color)},
		}
		if r.Scope != "" {
			tc.Scope = r.Scope
		} else if len(r.Scopes) > 0 {
			tc.Scope = r.Scopes
		}

		var styles []string
		if r.Bold {
			styles = append(styles, "bold")
		}
		if r.Italic {
			styles = append(styles, "italic")
		}
		if r.Underline {
			styles = append(styles, "underline")
		}
		if len(styles) > 0 {
			tc.Settings.FontStyle = strings.Join(styles, " ")
		}

		vt.TokenColors = append(vt.TokenColors, tc)
	}

	return vt
}

func themeType(t *Theme) string {
	base := t.BaseColor
	if base == "" {
		base = t.Style
	}
	if strings.EqualFold(base, "light") {
		return "light"
	}
	return "dark"
}

func uiThemeFor(t *Theme) string {
	if themeType(t) == "light" {
		return "vs"
	}
	return "vs-dark"
}

func buildManifest(b *Bundle, contributions []ThemeContribution) ExtensionManifest {
	name := slug(b.Settings.Name)
	if name == "" {
		name = slug(filepath.Base(strings.TrimRight(b.Path, "/\\")))
	}

	m := ExtensionManifest{
		Name:        name,
		DisplayName: b.Project.Description,
		Description: b.Project.Description,
		Version:     b.Project.Version,
		Publisher:   b.Settings.Publisher,
		Engines:     map[string]string{"vscode": "^1.60.0"},
		Categories:  []string{"Themes"},
		Contributes: Contributes{Themes: contributions},
	}
	if m.DisplayName == "" {
		m.DisplayName = name
	}
	if b.Settings.Repository != "" {
		m.Repository = &RepositoryRef{Type: "git", URL: b.Settings.Repository}
	}
	return m
}

func slug(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	var b strings.Builder
	for _, c := range s {
		if (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') {
			b.WriteRune(c)
		} else if b.Len() > 0 && !strings.HasSuffix(b.String(), "-") {
			b.WriteRune('-')
		}
	}
	return strings.TrimSuffix(b.String(), "-")
}

// Same slugification as the original TypeScript (lowercase, spaces removed).
func fileNameForTheme(name string) string {
	return strings.ToLower(strings.ReplaceAll(name, " ", ""))
}

// Matches the original build location: a `builds/` folder next to the
// `.themex` folder (not inside it).
func buildsDirectoryPath(themexDir string) string {
	cleaned := strings.TrimRight(themexDir, "/\\")
	return filepath.Join(filepath.Dir(cleaned), "builds")
}
