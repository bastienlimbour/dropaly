# Local Artifacts

## Initiatives

An initiative is a folder under `.initiatives/` directory that contains local artifacts for a specific initiative, such as an MVP, feature, redesign, or investigation.

Rules:

- One directory per initiative: `.initiatives/<initiative>/`
- Use a three-digit incremental ID and a short kebab-case slug, such as `.initiatives/001-mvp/` or `.initiatives/002-dark-mode/`.

## Artifacts

Local artifacts are stored in markdown files under `.initiatives/`.

Rules:

- Use kebab-case slugs for artifact names.
- Use the name and path provided by the user.
- If no name or path is provided, propose a relevant name and path based on the context.
- Artifacts are always associated with an initiative.

Examples:

- `.initiatives/<initiative>/brainstorming.md`
- `.initiatives/<initiative>/product-brief.md`
- `.initiatives/<initiative>/validation.md`
- `.initiatives/<initiative>/spec.md`
- `.initiatives/<initiative>/tasks/*.md`
- `.initiatives/<initiative>/research/*.md`

## Creating An Initiative

- Scan existing initiative folders under `.initiatives/` before proposing the next ID. Avoid reusing deleted or archived IDs when that history is visible.
- Propose the next initiative ID and slug, explain what will be created, and ask for confirmation before creating the folder.

## Creating Local Artifacts

- Ask for confirmation before creating or substantially updating structured artifacts.
- For substantial artifacts, draft in conversation first, wait for validation, then write.
- For minor extractive notes, confirm the path before writing.

## Security And Privacy

NEVER include secrets, tokens, credentials, raw personal data, sensitive customer data, or confidential material in local artifacts.
