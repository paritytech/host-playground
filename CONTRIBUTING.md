# Contributing to Host Playground

### How to Document

Good documentation starts with a single, clear sentence. Everything else comes after a newline.

#### Principles

1. **Lead with one sentence.** The first line of any doc comment should explain _what_ the thing does, not _how_. Additional context goes after a blank line.
2. **Don't restate the code.** If the function signature already tells the story, don't repeat it in prose. Document _why_, not _what_.
3. **Use examples.** A short usage example is worth more than a paragraph of explanation.
4. **Link to related items.** Help readers navigate. Reference related functions, types, or modules directly rather than describing them.
5. **Think about context.** If you're explaining too many foreign concepts to document one function, the API design may need work.
6. **No code section separators.** Don't use `// -----------` or similar decorative dividers to split sections within a file. Let the code structure speak for itself.
7. **No em-dashes, semicolons, prose-conjunction `+`, or Unicode arrows (`→`, `←`, `↔`).** Rewrite the sentence. Two short sentences read better than one long one with a dash, and arrows belong in diagrams (where `->` is fine if it's a real arrow, not a stand-in for "becomes" or "then").

   Bad: `Run the test → log the result → render the card.`
   Good: `Run the test. Log the result. The card renders.`
8. **No possessive apostrophes.** Drop the `'s`.

   Bad: `Releases the signer's lock so it can submit again.`
   Good: `Releases the signer lock so it can submit again.`
9. **Minimize parenthetical asides.** A parenthetical usually means the sentence is carrying a detail it should either state plainly or drop. Fold it into the prose, or cut it.

   Bad: `Tests live in the tests array (test id to definition).`
   Good: `Tests live in the tests array, which maps a test id to its definition.`
10. **Prefer full words to abbreviations.** In prose and in the names you reference. Established acronyms like `cid`, `evm`, and `sdk` are fine.

   Bad: `const res = runTest(def)`
   Good: `const result = runTest(definition)`
11. **Don't write "on-chain".** Either omit it or say "network". The reader knows the data comes from the chain from context.

   Bad: `Discovered on-chain by enumerating storage.`
   Good: `Discovered by enumerating storage.` or `Read from the network by enumerating storage.`
12. **Don't name the variable in its own doc.** The declaration already shows the name. Describe what the value holds, not what it is called.

   Bad: `` /** `contextAlias` (the derived alias) from the precompile. */ `` above `contextAlias: string | null`
   Good: `/** Derived per-context pseudonym from the precompile. */` above `contextAlias: string | null`

#### TypeScript

```ts
/** Run a single host-API test and return its pass/fail result. */
export async function runTest(test: TestDefinition): Promise<TestResult> {
```

- Start with a single-sentence JSDoc comment.
- Add parameter/return descriptions only when the types aren't self-explanatory.
- For modules, put a block comment at the top of the file explaining the purpose and key design decisions.

### TLDR

1. Start with a single, clear sentence. Follow up after a newline if needed.
2. Don't repeat what the code already says.
3. Use examples and links generously.
4. If documenting something requires explaining too many unrelated concepts, reconsider the API design.
5. Rewrite around em-dashes, semicolons, prose `+`, and Unicode arrows. Short sentences are better.
6. No possessive apostrophes. "the test result", not "the test's result".
7. Minimize parenthetical asides. Fold the detail into the sentence or drop it.
8. Prefer the full word to a truncated one. "definition", not "def".
9. Don't write "on-chain". Omit it or say "network".
10. Don't repeat the variable name in its own doc. Describe what it holds.

## E2E Test Conventions

### Given/When/Then markers MUST be bare

In Playwright test files, the `// Given`, `// When`, `// Then` markers are
section headers — nothing else. **No descriptive text after them. Ever.**

```ts
// ❌ WRONG — never do this
// Given — seed the cache with stale data
// When — user clicks the tab
// Then — sync runs and updates the entry

// ✅ CORRECT
// Given
// When
// Then
```

This applies to test code AND to test snippets in chat / PR descriptions /
review comments. If you're tempted to explain what's happening in that block,
the explanation belongs in the test name or as a separate comment line — not
inline with the marker.
