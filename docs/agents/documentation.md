# Documentation

How workflow skills should consume this repo's documentation when exploring the codebase or working on a task.

## Before Exploring Or Working On A Task

- If domain language matters for the task at hand, read `CONTEXT.md` at the repo root.
- If ADRs in `docs/decisions/` at the repo root or in any `**/docs/decisions/` directory touch the area you are about to work on, read them.

If any of these files do not exist, proceed silently. Do not flag their absence.

## Domain Context

`CONTEXT.md` is a glossary for canonical domain language only: approved terms, terms to avoid, domain relationships, examples, and resolved ambiguities.

When your output names a domain concept, such as an issue title, generated code, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`. Do not drift to synonyms or terms the glossary explicitly avoids.

If the concept you need is not in the glossary yet, either reconsider whether you are inventing language the project does not use or flag the gap to the user.

## Context Map

This repo currently uses a single-context convention: one `CONTEXT.md` at the repo root.

Only introduce `CONTEXT-MAP.md` if the repo explicitly moves to multiple domains, bounded contexts, or sub-projects with distinct domain language. `CONTEXT-MAP.md` is a routing document that points to the relevant `CONTEXT.md`; it is not an architecture map.

## Decisions (ADRs)

Use `docs/decisions/` for durable architecture decisions that are hard to reverse, surprising without context, or involve a real tradeoff between options.

If your output or a proposed change contradicts an existing ADR, flag the conflict explicitly to the user instead of silently overriding the decision.

## File Structure

Single domain context:

```text
/
|-- CONTEXT.md
|-- docs/decisions/
|   |-- 0001-decision-short-slug.md
|   `-- 0002-decision-short-slug.md
`-- src/
```

Future multi-domain context with `CONTEXT-MAP.md` at the repo root:

```text
/
|-- CONTEXT-MAP.md
|-- docs/decisions/             # system-wide decisions
`-- src/
    |-- billing/
    |   |-- CONTEXT.md
    |   `-- docs/decisions/     # context-specific decisions
    `-- customers/
        |-- CONTEXT.md
        `-- docs/decisions/
```

## Security And Privacy

NEVER include secrets, tokens, credentials, raw personal data, sensitive customer data, or confidential material in project documentation.
