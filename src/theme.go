package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Rule struct {
	Name      string
	Scope     string
	Scopes    []string
	Color     string
	Bold      bool
	Italic    bool
	Underline bool
}

type ThemeSettings struct {
	Background    string
	Foreground    string
	Caret         string
	Invisibles    string
	LineHighlight string
	Selection     string
	Comment       string
}

type Theme struct {
	Name      string
	Style     string
	UUID      string
	BaseTheme string
	BaseColor string
	Colors    map[string]string
	Settings  ThemeSettings
}

type Project struct {
	Version        string
	Author         string
	Description    string
	ColorSpaceName string
	Themes         []Theme
	Rules          []Rule
}

type ProjectSettings struct {
	Name       string
	Publisher  string
	Repository string
}

type Bundle struct {
	Project  Project
	Settings ProjectSettings
	Path     string
}

func LoadBundle(dir string) (*Bundle, error) {
	themeData, err := os.ReadFile(filepath.Join(dir, "theme.yml"))
	if err != nil {
		return nil, fmt.Errorf("reading theme.yml: %w", err)
	}

	raw, err := YAMLUnmarshal(themeData)
	if err != nil {
		return nil, fmt.Errorf("parsing theme.yml: %w", err)
	}
	themeMap, ok := raw.(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("theme.yml must be a mapping")
	}

	bundle := &Bundle{
		Project: parseProject(themeMap),
		Path:    dir,
	}

	if settingsData, err := os.ReadFile(filepath.Join(dir, "project.yml")); err == nil {
		if sraw, err := YAMLUnmarshal(settingsData); err == nil {
			if sm, ok := sraw.(map[string]interface{}); ok {
				bundle.Settings = ProjectSettings{
					Name:       getString(sm, "name"),
					Publisher:  getString(sm, "publisher"),
					Repository: getString(sm, "repository"),
				}
			}
		}
	}

	return bundle, nil
}

func parseProject(m map[string]interface{}) Project {
	p := Project{
		Version:        getString(m, "version"),
		Author:         getString(m, "author"),
		Description:    getString(m, "description"),
		ColorSpaceName: getString(m, "colorSpaceName"),
	}
	if themes, ok := m["themes"].([]interface{}); ok {
		for _, t := range themes {
			if tm, ok := t.(map[string]interface{}); ok {
				p.Themes = append(p.Themes, parseTheme(tm))
			}
		}
	}
	if rules, ok := m["rules"].([]interface{}); ok {
		for _, r := range rules {
			if rm, ok := r.(map[string]interface{}); ok {
				p.Rules = append(p.Rules, parseRule(rm))
			}
		}
	}
	return p
}

func parseTheme(m map[string]interface{}) Theme {
	t := Theme{
		Name:      getString(m, "name"),
		Style:     getString(m, "style"),
		UUID:      getString(m, "uuid"),
		BaseTheme: getString(m, "baseTheme"),
		BaseColor: getString(m, "baseColor"),
		Colors:    map[string]string{},
	}
	if c, ok := m["colors"].(map[string]interface{}); ok {
		for k, v := range c {
			t.Colors[k] = fmt.Sprintf("%v", v)
		}
	}
	if s, ok := m["settings"].(map[string]interface{}); ok {
		t.Settings = ThemeSettings{
			Background:    getString(s, "background"),
			Foreground:    getString(s, "foreground"),
			Caret:         getString(s, "caret"),
			Invisibles:    getString(s, "invisibles"),
			LineHighlight: getString(s, "lineHighlight"),
			Selection:     getString(s, "selection"),
			Comment:       getString(s, "comment"),
		}
	}
	return t
}

func parseRule(m map[string]interface{}) Rule {
	r := Rule{
		Name:      getString(m, "name"),
		Scope:     getString(m, "scope"),
		Color:     getString(m, "color"),
		Bold:      getBool(m, "bold"),
		Italic:    getBool(m, "italic"),
		Underline: getBool(m, "underline"),
	}
	if scopes, ok := m["scopes"].([]interface{}); ok {
		for _, s := range scopes {
			r.Scopes = append(r.Scopes, fmt.Sprintf("%v", s))
		}
	}
	return r
}

func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key]; ok && v != nil {
		return fmt.Sprintf("%v", v)
	}
	return ""
}

func getBool(m map[string]interface{}, key string) bool {
	v, ok := m[key]
	if !ok {
		return false
	}
	switch val := v.(type) {
	case bool:
		return val
	case string:
		return strings.EqualFold(val, "true") || strings.EqualFold(val, "yes")
	}
	return false
}

func Check(b *Bundle) error {
	if b.Project.Version == "" {
		return fmt.Errorf("missing 'version'")
	}
	if b.Project.Author == "" {
		return fmt.Errorf("missing 'author'")
	}
	if b.Project.Description == "" {
		return fmt.Errorf("missing 'description'")
	}
	if len(b.Project.Themes) == 0 {
		return fmt.Errorf("no 'themes' defined")
	}
	for i, t := range b.Project.Themes {
		if t.Name == "" {
			return fmt.Errorf("theme %d: missing 'name'", i)
		}
		if t.Settings.Background == "" {
			return fmt.Errorf("theme %q: missing 'settings.background'", t.Name)
		}
		if t.Settings.Foreground == "" {
			return fmt.Errorf("theme %q: missing 'settings.foreground'", t.Name)
		}
	}
	for i, r := range b.Project.Rules {
		if r.Name == "" {
			return fmt.Errorf("rule %d: missing 'name'", i)
		}
		if r.Scope == "" && len(r.Scopes) == 0 {
			return fmt.Errorf("rule %q: missing 'scope' or 'scopes'", r.Name)
		}
		if r.Color == "" {
			return fmt.Errorf("rule %q: missing 'color'", r.Name)
		}
	}
	return nil
}
