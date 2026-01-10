# Spurtalk - Ralph Project

## Quick Start

1. **Create your PRD:**
   ```bash
   cp prd.json.example prd.json
   # Edit prd.json with your feature details
   ```

2. **Run Ralph:**
   ```bash
   ./ralph.sh
   ```

3. **Done!** Ralph will:
   - Read your PRD
   - Use Claude/ckat via amp wrapper
   - Execute stories autonomously
   - Track progress in progress.txt
   - Commit to git

## What's Included

- **ralph.sh** - The orchestrator loop
- **amp** - Your custom wrapper (skills + code indexing)
- **prompt.md** - Instructions for each iteration
- **.ckat/** - Claude configuration
- **skills/** - PRD generation capabilities
- **prd.json.example** - Template for stories

## Project Structure

```
spurtalk/
├── ralph.sh          - Main loop
├── amp              - Claude wrapper (custom)
├── prompt.md        - Agent instructions
├── prd.json         - Your stories (create this)
├── prd.json.example - Template
├── progress.txt     - Created by Ralph
├── .ckat/           - Claude config
├── skills/          - PRD skills
├── .gitignore       - Ignores runtime files
└── README.md        - This file
```

## Configuration

### amp wrapper
- Loads PRD skills
- Creates code index in `/tmp/ralph_code_index_spurtalk.txt`
- Calls ckat/claude with full knowledge
- 5-minute index cache

### .ckat configuration
- Uses kwaipilot/kat-coder-pro:free via OpenRouter
- All tools enabled
- Autonomous mode (no questions)

## Documentation

For more info, see:
- `.ckat/instructions.md` - Autonomy rules
- `skills/` - PRD skill files
- Original docs: `/Users/morsy/dev/ralph/.context/`

## Notes

- **git**: Initialize with `git init` before running
- **context**: Code index cached in /tmp for performance
- **iteration**: Each story gets fresh Claude context

