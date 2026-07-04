# docs/opportunity-briefs/approvals/

**Joe-only directory. Claude must never create, modify, or delete files here. See HR-65.**

Files in this directory record Joe's explicit approval of an opportunity brief. The blog-draft-guard hook checks for the presence of `[slug].approved` before allowing any blog draft to be created or edited. If this file is absent, the hook denies the write — regardless of what the Status field in the brief says.

## How Joe approves a brief

1. Review the completed brief at `docs/opportunity-briefs/[slug]-brief.md`
2. Create a file named `[slug].approved` in this directory
3. The file content can be anything — the filename and location are what the hook checks

Example:
```
docs/opportunity-briefs/approvals/portuguese-wine.approved
```

## Why this is separate from the Status field

Claude fills out the brief content, including the Status field. Approval confirmation by Claude in the Status field cannot be distinguished from Joe's actual approval. This directory solves that by separating the approval record into a file that Claude is explicitly prohibited from writing.
