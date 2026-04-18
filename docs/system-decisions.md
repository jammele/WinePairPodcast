# System Decisions Guidance

When multiple technical options are possible, prefer:
- Python over heavier stacks
- SQLite over more complex databases
- Markdown files over proprietary formats
- simple CLI scripts before building a UI
- local file access before cloud integration
- understandable solutions over clever ones

## What Claude should decide on its own

Claude should take ownership of:
- schema details
- file naming conventions
- indexing strategy
- chunking strategy
- logging approach
- versioning approach
- how to make the system maintainable for a non-engineer

Explain decisions briefly in plain English.
