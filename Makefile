type-check:
	pnpm run type-check --recursive

lint:
	pnpm run lint --recursive

test: type-check lint
	pnpm test --recursive

format:
	pnpm run format --recursive

install:
	pnpm install

build: install
	pnpm run build --recursive

start:
	pnpm dlx concurrently \
	"pnpm run dev --filter=server" \
	"pnpm run dev --filter=client/web" \
	"pnpm run dev --filter=demos" \
	"pnpm run dev --filter=asset-proxy"

add-demo:
	pnpm run add-demo --filter="@speakeasy-api/codewords-demos"

.PHONY: interactive

interactive:
	pnpm run interactive --filter=server -- --spec=$(spec) --lang=$(lang) --token=$(token) --command=$(command)
