EXAMPLES_WORKSPACES = --workspace examples/docusaurus --workspace examples/custom --workspace examples/nextra

install:
	npm install

type-check: type-check-packages type-check-examples

type-check-packages:
	npm run type-check --workspace packages

type-check-examples:
	npm run type-check $(EXAMPLES_WORKSPACES)

lint: lint-packages lint-examples

lint-packages:
	npm run lint --workspace packages

lint-examples:
	npm run lint $(EXAMPLES_WORKSPACES)

format: format-packages format-examples

format-packages:
	npm run format --workspace packages

format-examples:
	npm run format $(EXAMPLES_WORKSPACES)

check-formatting: check-formatting-packages check-formatting-examples

check-formatting-packages:
	npm run check-formatting --workspace packages

check-formatting-examples:
	npm run check-formatting $(EXAMPLES_WORKSPACES)

build: build-packages build-examples

build-packages:
	npm run build --workspace packages/react
	npm run build --workspace packages/compiler

build-examples:
	npm run build $(EXAMPLES_WORKSPACES)

clean: clean-packages clean-examples

clean-packages:
	npm run clean --workspace packages

clean-examples:
	npm run clean $(EXAMPLES_WORKSPACES)

build-api-docs:
	npm run build-api-docs $(EXAMPLES_WORKSPACES) -- --clean

verify-api-docs: build-api-docs
	@if ! (git diff --exit-code --quiet examples/ && git diff --cached --exit-code --quiet examples/); then \
		git status examples/; \
		echo "Example build out of date. Please run make build-api-docs and commit the results"; \
		exit 1; \
	fi

publish:
	@set -e; trap 'exit 130' INT TERM; exec node --experimental-strip-types scripts/publish.mts
