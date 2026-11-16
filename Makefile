BINARY   := themex
DIST     := dist
SRC      := ./src

PREFIX   ?= /usr/local
BINDIR   ?= $(PREFIX)/bin

GO       ?= go
LDFLAGS  := -s -w

.PHONY: all build install uninstall clean test fmt vet run help

all: build

## Build the binary into dist/
build:
	@mkdir -p $(DIST)
	$(GO) build -trimpath -ldflags="$(LDFLAGS)" -o $(DIST)/$(BINARY) $(SRC)
	@echo "built $(DIST)/$(BINARY)"

## Install the binary system-wide into /usr/local/bin
## (needs sudo: `sudo make install`)
install: build
	install -d $(BINDIR)
	install -m 0755 $(DIST)/$(BINARY) $(BINDIR)/$(BINARY)
	@echo "installed $(BINDIR)/$(BINARY)"

## Remove the installed binary
uninstall:
	rm -f $(BINDIR)/$(BINARY)

## Run unit tests
test:
	$(GO) test ./...

## Run go vet
vet:
	$(GO) vet $(SRC)

## Format all sources
fmt:
	gofmt -w $(SRC)

## Build and run with the given args, e.g. `make run ARGS="test"`
run: build
	$(DIST)/$(BINARY) $(ARGS)

## Remove build artifacts
clean:
	rm -rf $(DIST)

help:
	@echo "Targets: build install uninstall test vet fmt run clean"
	@echo "  PREFIX=$(PREFIX)  (override: make install PREFIX=\$$HOME/.local)"