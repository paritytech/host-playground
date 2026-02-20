# Product SDK Test App

A test application for the Polkadot Product SDK (`@novasamatech/product-sdk`). Designed to run exclusively within the Host webview environment to validate functionality across `product-sdk`, Host, and the Polkadot App.

## How to Open

### Web Host

Open the app directly

https://triangle-web-host.teleport.parity.io/?url=test-product-sdk33.dot

### Desktop Host

1. Download the Polkadot Browser from https://polkadotbrowser.novasama-technologies.workers.dev/
2. Install and launch the application
3. In the search bar, type `test-product-sdk33.dot`

## Development

```bash
yarn install --immutable
yarn dev
```

## Deployment

The app is deployed automatically via GitHub Actions on push to `main`.
