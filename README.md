# Host Playground

An interactive playground for testing `@novasamatech/product-sdk`. Designed to run exclusively within the Host webview environment to validate functionality across `product-sdk`, Host, and the Polkadot App.

## How to Open

### Web Host

Open the app directly

https://host-playground.dot.li

### Desktop Host

1. Download the Polkadot Browser from https://polkadotbrowser.novasama-technologies.workers.dev/
2. Install and launch the application
3. In the search bar, type `host-playground.dot`

## Development

```bash
yarn install --immutable
yarn dev
```

The target network is baked at build/dev time via
`NEXT_PUBLIC_NETWORK_GENESIS_HASH`.

## Deployment

The app is deployed automatically via GitHub Actions on push to `main`.
