package main

import (
	"fmt"
	"strings"
)

type yamlToken struct {
	indent int
	text   string
}

func YAMLUnmarshal(data []byte) (interface{}, error) {
	text := strings.ReplaceAll(string(data), "\r\n", "\n")
	tokens := yamlTokenize(text)
	i := 0
	v, err := yamlParseBlock(tokens, &i)
	if err != nil {
		return nil, err
	}
	return v, nil
}

func yamlTokenize(s string) []yamlToken {
	var out []yamlToken
	for _, line := range strings.Split(s, "\n") {
		line = strings.TrimRight(line, " \t\r")
		if line == "" || strings.HasPrefix(strings.TrimSpace(line), "#") {
			continue
		}
		line = yamlStripComment(line)
		line = strings.TrimRight(line, " \t")
		if strings.TrimSpace(line) == "" {
			continue
		}
		indent := 0
		for indent < len(line) && line[indent] == ' ' {
			indent++
		}
		out = append(out, yamlToken{indent, line[indent:]})
	}
	return out
}

func yamlStripComment(s string) string {
	inS, inD := false, false
	for i := 0; i < len(s); i++ {
		switch s[i] {
		case '\'':
			if !inD {
				inS = !inS
			}
		case '"':
			if !inS {
				inD = !inD
			}
		case '#':
			if !inS && !inD && (i == 0 || s[i-1] == ' ' || s[i-1] == '\t') {
				return s[:i]
			}
		}
	}
	return s
}

func yamlParseBlock(tokens []yamlToken, i *int) (interface{}, error) {
	if *i >= len(tokens) {
		return nil, nil
	}
	base := tokens[*i].indent
	if yamlIsListItem(tokens[*i].text) {
		return yamlParseList(tokens, i, base)
	}
	return yamlParseMap(tokens, i, base)
}

func yamlIsListItem(s string) bool {
	return s == "-" || strings.HasPrefix(s, "- ")
}

func yamlParseList(tokens []yamlToken, i *int, indent int) ([]interface{}, error) {
	var out []interface{}
	for *i < len(tokens) {
		t := tokens[*i]
		if t.indent < indent {
			break
		}
		if t.indent > indent {
			return nil, fmt.Errorf("yaml: unexpected indent at token %d", *i)
		}
		if !yamlIsListItem(t.text) {
			break
		}

		var content string
		var contentCol int
		if t.text == "-" {
			contentCol = indent + 1
		} else {
			ci := 1
			for ci < len(t.text) && t.text[ci] == ' ' {
				ci++
			}
			content = t.text[ci:]
			contentCol = indent + ci
		}

		*i++

		switch {
		case content == "":
			v, err := yamlParseBlock(tokens, i)
			if err != nil {
				return nil, err
			}
			out = append(out, v)
		case yamlFindColon(content) >= 0:
			sub := []yamlToken{{contentCol, content}}
			for *i < len(tokens) && tokens[*i].indent > indent {
				sub = append(sub, tokens[*i])
				*i++
			}
			j := 0
			v, err := yamlParseMap(sub, &j, contentCol)
			if err != nil {
				return nil, err
			}
			out = append(out, v)
		default:
			out = append(out, yamlParseScalar(content))
		}
	}
	return out, nil
}

func yamlParseMap(tokens []yamlToken, i *int, indent int) (map[string]interface{}, error) {
	out := map[string]interface{}{}
	for *i < len(tokens) {
		t := tokens[*i]
		if t.indent < indent {
			break
		}
		if t.indent > indent {
			return nil, fmt.Errorf("yaml: unexpected indent at token %d", *i)
		}
		if yamlIsListItem(t.text) {
			break
		}
		ci := yamlFindColon(t.text)
		if ci < 0 {
			return nil, fmt.Errorf("yaml: expected ':' at token %d: %q", *i, t.text)
		}
		key := yamlUnquote(strings.TrimSpace(t.text[:ci]))
		value := strings.TrimSpace(t.text[ci+1:])
		*i++
		if value == "" {
			v, err := yamlParseBlock(tokens, i)
			if err != nil {
				return nil, err
			}
			out[key] = v
		} else {
			out[key] = yamlParseScalar(value)
		}
	}
	return out, nil
}

func yamlFindColon(s string) int {
	inS, inD := false, false
	for i := 0; i < len(s); i++ {
		switch s[i] {
		case '\'':
			if !inD {
				inS = !inS
			}
		case '"':
			if !inS {
				inD = !inD
			}
		case ':':
			if !inS && !inD && (i+1 >= len(s) || s[i+1] == ' ' || s[i+1] == '\t') {
				return i
			}
		}
	}
	return -1
}

func yamlParseScalar(s string) interface{} {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	if len(s) >= 2 && ((s[0] == '"' && s[len(s)-1] == '"') || (s[0] == '\'' && s[len(s)-1] == '\'')) {
		return yamlUnquote(s)
	}
	switch strings.ToLower(s) {
	case "true", "yes", "on":
		return true
	case "false", "no", "off":
		return false
	case "null", "~":
		return nil
	}
	return s
}

func yamlUnquote(s string) string {
	if len(s) >= 2 && s[0] == '"' && s[len(s)-1] == '"' {
		inner := s[1 : len(s)-1]
		inner = strings.ReplaceAll(inner, `\"`, `"`)
		inner = strings.ReplaceAll(inner, `\\`, `\`)
		inner = strings.ReplaceAll(inner, `\n`, "\n")
		inner = strings.ReplaceAll(inner, `\t`, "\t")
		return inner
	}
	if len(s) >= 2 && s[0] == '\'' && s[len(s)-1] == '\'' {
		return strings.ReplaceAll(s[1:len(s)-1], "''", "'")
	}
	return s
}
