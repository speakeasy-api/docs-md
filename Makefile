install:
	npm install

type-check: type-check-packages type-check-examples

type-check-packages:
	npm run type-check --workspace packages

type-check-examples:
	npm run type-check --workspace examples

lint: lint-packages lint-examples

lint-packages:
	npm run lint --workspace packages

lint-examples:
	npm run lint --workspace examples

format: format-packages format-examples

format-packages:
	npm run format --workspace packages

format-examples:
	npm run format --workspace examples

check-formatting: check-formatting-packages check-formatting-examples

check-formatting-packages:
	npm run check-formatting --workspace packages

check-formatting-examples:
	npm run check-formatting --workspace examples

build: build-packages build-examples

build-packages:
	npm run build --workspace packages/shared
	npm run build --workspace packages/web-components
	npm run build --workspace packages/react
	npm run build --workspace packages/compiler

build-examples:
	npm run build --workspace examples

clean: clean-packages clean-examples

clean-packages:
	npm run clean --workspace packages

clean-examples:
	npm run clean --workspace examples

test-e2e:
	npm run test --workspace tests/e2e

build-api-docs:
	npm run build-api-docs --workspace examples -- --clean

verify-api-docs: build-api-docs
	@if ! (git diff --exit-code --quiet examples/ && git diff --cached --exit-code --quiet examples/); then \
		git status examples/; \
		git diff examples/; \
		echo "Example build out of date. Please run make build-api-docs and commit the results"; \
		exit 1; \
	fi

verify-package-versions:
	@set -e; trap 'exit 130' INT TERM; exec node --experimental-strip-types scripts/versionCheck.mts

publish:
	@set -e; trap 'exit 130' INT TERM; exec node --experimental-strip-types scripts/publish.mts

sync-public:
	@set -e; trap 'exit 130' INT TERM; exec node --experimental-strip-types scripts/remoteSync.mts
