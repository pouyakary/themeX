package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

const (
	colorRed     = "\033[31m"
	colorGreen   = "\033[32m"
	colorCyan    = "\033[36m"
	colorMagenta = "\033[35m"
	colorReset   = "\033[0m"
)

func main() {
	args := os.Args[1:]

	switch len(args) {
	case 0:
		cwd, _ := os.Getwd()
		if strings.HasSuffix(strings.ToLower(cwd), ".themex") {
			os.Exit(build(cwd))
		}
		showHelp()
	case 1:
		if strings.EqualFold(args[0], "test") {
			os.Exit(runTest())
		}
		if strings.HasSuffix(strings.ToLower(args[0]), ".themex") {
			os.Exit(build(args[0]))
		}
		showHelp()
	default:
		showHelp()
	}
}

func build(dir string) int {
	printTitle()

	bundle, err := LoadBundle(dir)
	if err != nil {
		report(fmt.Sprintf("loading failed: %v", err))
		return 1
	}

	if err := Check(bundle); err != nil {
		report(fmt.Sprintf("validation failed: %v", err))
		return 1
	}

	if err := GenerateVSCode(bundle); err != nil {
		report(fmt.Sprintf("build failed: %v", err))
		return 1
	}
	return 0
}

func runTest() int {
	cwd, _ := os.Getwd()
	bundleDir := findBundleIn(cwd)
	if bundleDir == "" {
		report("no themeX files found.")
		return 1
	}

	bundle, err := LoadBundle(bundleDir)
	if err != nil {
		report(fmt.Sprintf("loading failed: %v", err))
		return 1
	}

	if err := Check(bundle); err != nil {
		report(fmt.Sprintf("test: failed - %v", err))
		return 1
	}

	print("test: passed.")
	return 0
}

func findBundleIn(dir string) string {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return ""
	}
	for _, e := range entries {
		if e.IsDir() && strings.HasSuffix(strings.ToLower(e.Name()), ".themex") {
			return filepath.Join(dir, e.Name())
		}
	}
	return ""
}

func report(msg string) {
	fmt.Printf(" %s✕%s %s\n\n", colorRed, colorReset, msg)
}

func print(msg string) {
	fmt.Printf(" %s✓%s %s\n\n", colorGreen, colorReset, msg)
}

func printTitle() {
	w := termWidth()
	line := strings.Repeat("─", w)
	fmt.Println(colorCyan + line + colorReset)

	text := " themeX "
	pad := (w - len(text)) / 2
	if pad < 0 {
		pad = 0
	}
	dots := strings.Repeat("•", pad)
	fmt.Printf("%s%s%s%s themeX %s%s%s\n",
		colorMagenta, dots, colorReset, colorReset, colorReset, dots, colorReset)

	fmt.Println(colorCyan + line + colorReset)
	fmt.Println()
}

func termWidth() int {
	if w := os.Getenv("COLUMNS"); w != "" {
		if n, err := strconv.Atoi(w); err == nil && n > 0 {
			return n
		}
	}
	return 80
}

func showHelp() {
	fmt.Println(`
  ┌─── themeX ─────────────────────────────────────────────┐
  │                                                        │
  │  themeX provides a simple universal definition for     │
  │  IDE/editor color schemes. To use it please read the   │
  │  documentation from:                                   │
  │  https://github.com/karyfoundation/themeX/wiki         │
  │                                                        │
  └────────────────────────────────────────────────────────┘`)
}
