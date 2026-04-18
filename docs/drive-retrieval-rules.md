# Drive Retrieval Rules

## Goal

Reduce repeated document uploads by finding likely relevant files automatically.

## Retrieval order

When a file is needed, use this order:
1. local archive copy if already ingested
2. synced Google Drive file on disk
3. known local working folders
4. optional direct Drive integration later
5. ask the user only if the file cannot be found reasonably

## Search behavior

Claude should proactively search for:
- research docs
- winery PDFs
- transcript drafts
- show notes drafts
- sponsor files
- guest pitches
- prior episode materials

## Ranking when multiple matches exist

Rank by:
1. expected folder relevance
2. most recent modification date
3. strongest filename match
4. prior episode association if tracked

## Provenance

Record where files came from when practical:
- source path
- source folder
- original filename
- modified date
- ingest path
