

install:
	npm install

type-check: type-check-packages type-check-examples

type-check-packages:
	npm run type-check --workspaces --workspace="packages/*"

type-check-examples:
	npm run type-check --workspaces --workspace="examples/*"

lint: lint-packages lint-examples

lint-packages:
	npm run lint --workspaces --workspace="packages/*"

lint-examples:
	npm run lint --workspaces --workspace="examples/*"

format: format-packages format-examples

format-packages:
	npm run format --workspaces --workspace="packages/*"

format-examples:
	npm run format --workspaces --workspace="examples/*"

build: build-packages build-examples

build-packages: install
	npm run build --workspaces --workspace="packages/*"

build-examples: install
	npm run build --workspaces --workspace="examples/*"

build-api-docs:
	npm run build-api-docs --workspaces -- --clean

verify-api-docs: build-api-docs
	@if ! (git diff --exit-code --quiet examples/ && git diff --cached --exit-code --quiet examples/); then \
		git status examples/; \
		echo "Example build out of date. Please run make build-api-docs and commit the results"; \
		exit 1; \
	fi
