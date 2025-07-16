type-check:
	npm run type-check --workspaces

lint:
	npm run lint --workspaces

test: type-check lint
	npm test --workspaces

format:
	npm run format --workspaces

install:
	npm install
	npm install --workspaces

build: install
	npm run build --workspaces

start:
	npx concurrently \
	"npm run dev --workspace=server" \
	"npm run dev --workspace=client/web" \
	"npm run dev --workspace=demos" \
	"npm run dev --workspace=asset-proxy"

add-demo:
	npm run add-demo --workspace="@speakeasy-api/codewords-demos"

.PHONY: interactive

interactive:
	npm run interactive --workspace=server -- --spec=$(spec) --lang=$(lang) --token=$(token) --command=$(command)
