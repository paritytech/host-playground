# Third-party notices

Host Playground is licensed under Apache-2.0. See [LICENSE](LICENSE).

It depends on around 590 packages, almost all under permissive terms. This file
records the ones whose licences carry conditions worth naming. Regenerate the
full inventory with:

```bash
yarn install --immutable
npx license-checker-rseidelsohn --csv
```

Run that against a clean `node_modules`. A stale tree reports packages that no
longer appear in `yarn.lock`, which makes the licence picture look worse than it
is.

## Licence inventory

| Licence                                                          | Packages |
| ---------------------------------------------------------------- | -------- |
| MIT                                                              | 484      |
| Apache-2.0                                                       | 48       |
| ISC                                                              | 20       |
| BSD-2-Clause                                                     | 9        |
| Apache-2.0 OR MIT                                                | 8        |
| MPL-2.0                                                          | 6        |
| GPL-3.0-or-later WITH Classpath-exception-2.0                    | 3        |
| BSD-3-Clause                                                     | 3        |
| CC0-1.0                                                          | 2        |
| MIT OR CC0-1.0                                                   | 2        |
| LGPL-3.0-or-later                                                | 1        |
| 0BSD, BlueOak-1.0.0, CC-BY-3.0, CC-BY-4.0, Python-2.0, Unlicense | 1 each   |

## Copyleft dependencies

### GPL-3.0-or-later WITH Classpath-exception-2.0

- `smoldot` 3.1.0 and 3.2.0, https://github.com/paritytech/smoldot
- `@parity/bulletin-sdk` 0.3.0, https://github.com/paritytech/polkadot-bulletin-chain

The Classpath exception permits linking without extending the GPL to the
combined work, so these are compatible with an Apache-2.0 outbound licence.

### MPL-2.0

- `lightningcss` and `lightningcss-darwin-arm64`, https://github.com/parcel-bundler/lightningcss
- `axe-core`, https://github.com/dequelabs/axe-core
- `@ethereumjs/rlp`, https://github.com/ethereumjs/ethereumjs-monorepo

MPL-2.0 is file-level copyleft. None of these files are modified here, so the
obligation is to retain the notices. Source for each is available at the URL
above.

### LGPL-3.0-or-later

- `@img/sharp-libvips-*`, https://github.com/lovell/sharp-libvips

A prebuilt native library that `sharp` loads for the Next.js image pipeline. It
runs at build time and is not redistributed in the static export under
`apps/app/out`.

## Notes on two inventory entries

`@polkadot-api/descriptors` reports as `UNKNOWN`. It is generated into
`.papi/descriptors` by `polkadot-api` codegen from this repository, so it is not
third-party code.

`host-playground` itself reports as `UNLICENSED` because `license-checker` labels
every package marked `private` that way. The `license` field in
[package.json](package.json) is `Apache-2.0`.
