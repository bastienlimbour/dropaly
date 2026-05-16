# Issue Tracker: Local Markdown

The default issue tracker for this repo is Local Markdown. Use markdown files under `.initiatives/` for all issue tracker operations.

Read `docs/agents/local-artifacts.md` for shared initiative naming, path, and local markdown file conventions.

## Conventions

- Create, read, or update an issue: use the relevant markdown file in `.initiatives/<initiative>/`.
- Comment on an issue: append comments and conversation history to the bottom of the file under a `---` separator and a `## Comments` heading.
- Apply a label to an issue: record labels as a `Labels:` line near the top of the issue file.
- Remove a label from an issue: remove the label from the `Labels:` line.
- Close an issue: add or update a `Status: closed` line near the top of the issue file.

## Spec And Task Issues

- Spec issue: `.initiatives/<initiative>/spec.md`
- Task issues: `.initiatives/<initiative>/tasks/*.md`

Spec issues are PRD-like parent issues. Task issues are implementable vertical slices from the spec.

## Parent And Child Issues

Use an explicit link in the child issue body near the top of the file:

```markdown
# <title>

Status: open
Labels: [label1, label2]
Parent issue: [.initiatives/<initiative>/spec.md](.initiatives/<initiative>/spec.md)

<body>

---

## Comments

<comments>
```

## Security And Privacy

NEVER include secrets, tokens, credentials, raw personal data, sensitive customer data, or confidential material in local issue files.
