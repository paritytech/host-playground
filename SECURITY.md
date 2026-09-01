# Security policy

## Security status

This repository contains Host Playground: reference and proof-of-concept code that exercises the
host API surface `@parity/product-sdk` exposes, together with a small demonstration contract under
[evm/](evm/). It is intended for reference and experimentation, not as a production-ready artefact.

Unless a specific release states otherwise, this repository has **not** received a full security
audit. Use in production or production-like deployments should only follow an independent security
review of the relevant code, configuration, generated output, and deployment environment.

Even where no Parity-operated production deployment exists today, this code may be used by third
parties on live networks, or reused in future production contexts once published.

The instances at `host-playground.paseo.li` and `host-playground.testnet.li` are run by Parity for
its own testing. They carry no availability commitment and are not a service. Anyone depending on
this application should deploy their own copy, as [README.md](README.md) describes.

## Automated scanning

Dependency alerts come from Dependabot, and Socket reviews dependency changes on every pull request.
Neither is a substitute for review. A tool reporting a finding is not in itself grounds for a
vulnerability report. If you believe a specific finding has genuine, demonstrable impact, raise it
through the disclosure process below with the evidence required under "What to report".

The Solidity sources under [evm/src/](evm/src/) are not covered by static analysis in this
repository. Treat them as demonstration code for the contract-write cards, not as reviewed
contracts.

## Supported versions

Security fixes are provided only for versions, packages, or branches actively maintained by Parity.
Experimental, archived, deprecated, or explicitly-unsupported packages, examples, or branches may
not be triaged unless the issue affects maintained packages, Parity-operated infrastructure, user
funds, private keys, signing flows, or transaction integrity.

## Bug bounty scope

This repository is **not** in scope for the Parity paid bug bounty programme unless explicitly listed
in the official bounty scope at the time of submission. Reports may still be reviewed through
responsible disclosure, but bounty eligibility applies only where the affected asset or vulnerability
class is explicitly in scope.

## What to report

Report an issue only if it demonstrates realistic impact against one or more of:

- Parity-operated production infrastructure or deployed services
- maintained packages downstream users are expected to consume
- user funds or assets
- private keys, seed phrases, signer flows, or key-management boundaries
- transaction construction, integrity, or signing intent
- remote code execution or credential compromise in a realistic deployment

## Out of scope, unless shown to cause realistic high-impact harm

Local-development-only issues. Demo, example, and testnet-only issues. Missing security headers on
non-production demos. Missing rate limiting in local examples. Dependency reports without a working
exploit path, or that do not affect shipped code. Hypothetical attack paths. "This code is
unaudited". Documented known limitations. Unsafe use contrary to documented warnings. Issues
requiring access to internal Parity systems not in scope.

## Reporting a qualifying issue

Do **not** open a public issue for a qualifying vulnerability. Email **security@parity.io** with:

- the affected repository, package, commit, branch, or release
- clear reproduction steps and realistic impact
- whether it affects production infrastructure, maintained packages, user funds, keys, signing, or
  only local, demo, or testnet usage
- any proof of concept, logs, or generated code involved
- assumptions required for exploitation

For the Parity disclosure process and Bug Bounty programme, see https://parity.io/bug-bounty.

## Researcher expectations

Do not access, modify, or delete data that is not yours. Do not disrupt services. Do not extract
keys or secrets beyond what is needed to demonstrate impact safely. Do not test against production
systems not in scope. No social engineering or physical attacks. Do not disclose publicly until
Parity has had a reasonable opportunity to remediate.

## Safe-use guidance

Before any production or production-like deployment, review at minimum: how keys, seeds, and signers
are generated, stored, and destroyed. Whether signing prompts display transaction intent before
approval. Whether transactions are built against the intended chain, account, and network. Whether
the network table in [apps/app/lib/types.ts](apps/app/lib/types.ts) still points at the testnets you
expect. Whether the deploy account named by `PRIVATE_KEY` holds only what a deploy costs. Whether
any cloud or statement-store data is public, private, or encrypted. Whether dependencies are pinned
and reviewed. Whether deployment configuration, logging, and telemetry suit the intended
environment.
