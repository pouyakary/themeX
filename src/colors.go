package main

import "strings"

func ResolveColor(t *Theme, color string) string {
	color = strings.TrimSpace(color)
	if color == "" {
		return fallbackColor(t)
	}
	if isHexColor(color) {
		if strings.HasPrefix(color, "#") {
			return strings.ToUpper(color)
		}
		return "#" + strings.ToUpper(color)
	}
	if strings.HasPrefix(color, ".") {
		if v, ok := t.Colors[color[1:]]; ok {
			v = strings.TrimSpace(v)
			if isHexColor(v) {
				if strings.HasPrefix(v, "#") {
					return strings.ToUpper(v)
				}
				return "#" + strings.ToUpper(v)
			}
		}
	}
	return fallbackColor(t)
}

func isHexColor(s string) bool {
	s = strings.TrimPrefix(s, "#")
	if len(s) != 6 && len(s) != 8 {
		return false
	}
	for _, c := range s {
		if !((c >= '0' && c <= '9') || (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f')) {
			return false
		}
	}
	return true
}

func fallbackColor(t *Theme) string {
	base := t.BaseColor
	if base == "" {
		base = t.Style
	}
	if strings.EqualFold(base, "dark") {
		return "#FFFFFF"
	}
	return "#000000"
}
