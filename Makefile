define MAKE_EXAMPLE_TARGET
$1-example-$2:
	npm run $1 --workspace $2
endef

EXAMPLE_WORKSPACES_LIST = examples/docusaurus examples/custom examples/nextra
EXAMPLES_WORKSPACES = $(addprefix --workspace ,$(EXAMPLE_WORKSPACES_LIST))
EXAMPLE_SCRIPTS = build lint format type-check check-formatting clean build-api-docs


$(foreach script,$(EXAMPLE_SCRIPTS), \
  $(foreach ws,$(EXAMPLE_WORKSPACES_LIST), \
    $(eval $(call MAKE_EXAMPLE_TARGET,$(script),$(ws)))))

install:
	npm install

type-check: type-check-packages type-check-examples

type-check-packages:
	npm run type-check --workspace packages

type-check-examples: $(addprefix type-check-example-,$(EXAMPLE_WORKSPACES_LIST))

lint: lint-packages lint-examples

lint-packages:
	npm run lint --workspace packages

lint-examples: $(addprefix lint-example-,$(EXAMPLE_WORKSPACES_LIST))

format: format-packages format-examples

format-packages:
	npm run format --workspace packages

format-examples: $(addprefix format-example-,$(EXAMPLE_WORKSPACES_LIST))

check-formatting: check-formatting-packages check-formatting-examples

check-formatting-packages:
	npm run check-formatting --workspace packages

check-formatting-examples: $(addprefix check-formatting-example-,$(EXAMPLE_WORKSPACES_LIST))

build: build-packages build-examples

build-package-shared:
	npm run build --workspace packages/shared

build-package-react:
	npm run build --workspace packages/react

build-package-compiler:
	npm run build --workspace packages/compiler

build-packages: build-package-shared build-package-react build-package-compiler

build-examples: $(addprefix build-example-,$(EXAMPLE_WORKSPACES_LIST))

clean: clean-packages clean-examples

clean-packages:
	npm run clean --workspace packages

clean-examples: $(addprefix clean-example-,$(EXAMPLE_WORKSPACES_LIST))

build-api-docs: $(addprefix build-api-docs-example-,$(EXAMPLE_WORKSPACES_LIST))

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

publish-skip-examples:
	@set -e; trap 'exit 130' INT TERM; exec node --experimental-strip-types scripts/publish.mts -- --skip-example-builds

sync-public:
	@set -e; trap 'exit 130' INT TERM; exec node --experimental-strip-types scripts/remoteSync.mts
