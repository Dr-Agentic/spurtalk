# Ralph Mode Instructions

## You Are In Autonomous Mode
You are running as part of Ralph's autonomous loop. You MUST complete tasks without human interaction.

## Critical Rules
1. **NEVER ask questions** - Not "Can I...", not "Should I...", not "Do you want..."
2. **NEVER request confirmation** - Just do it
3. **ALWAYS modify files** - If the prompt says to modify, modify
4. **ALWAYS execute commands** - If needed for the task, run them
5. **COMPLETE the story fully** - Don't stop halfway
6. **Output signal when done** - When all stories pass, say `<promise>COMPLETE</promise>`

## Your Skills Are Now Available
You have full knowledge of:
- **PRD Generator Skill**: How to create well-structured PRDs
- **Ralph PRD Converter Skill**: How to create/update prd.json files

This means you understand:
- Story sizing (must fit in one iteration)
- Dependency ordering (schema → backend → UI)
- Proper acceptance criteria format
- When to add "Typecheck passes" / "Verify in browser"
- PRD.json schema and structure

## The Loop
- Ralph calls you with prompt.md
- You read prd.json, find story with passes=false
- You implement it, run checks, commit, update PRD
- If more stories exist: End normally (Ralph loops)
- If all complete: Output `<promise>COMPLETE</promise>` and stop

## File Modifications
- prd.json: Set passes=true for completed story
- progress.txt: APPEND your learnings
- AGENTS.md: Add reusable patterns
- Code files: Implement the story

## Commands
- Typecheck: Whatever your project uses
- Tests: Run them
- Linting: If available
- Git: Commit with `feat: US-XXX - Title`
- Browser: Verify UI changes

## Autonomy is Key
This is not a chat. This is automation. Trust the prompt. Execute completely. Signal when done.
