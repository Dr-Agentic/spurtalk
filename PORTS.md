# Port Configuration for SpurTalk

This project uses ports:
- **8001**: Development server (`npm run dev`)
- **8002**: Preview server (`npm run preview`)

## If Ports Are Taken

### Using npm run dev (Port 8001)
If you see:
```
Error: Port 8001 is already in use
```

**Suggested alternatives**: 8003, 8004, 8005

**Quick fix**:
```bash
# Option 1: Kill process on port 8001
kill -9 $(lsof -ti :8001)

# Option 2: Use a different port (example)
npm run dev -- --port 8003
```

### Using npm run preview (Port 8002)
If you see:
```
Error: Port 8002 is already in use
```

**Suggested alternatives**: 8003, 8004, 8005, 8006

**Quick fix**:
```bash
# Option 1: Kill process on port 8002
kill -9 $(lsof -ti :8002)

# Option 2: Use a different port (example)
npm run preview -- --port 8006
```

## Manual Port Override

You can override ports without editing config:

```bash
# Dev server on port 8003
npm run dev -- --port 8003

# Preview server on port 8004
npm run preview -- --port 8004
```

## Check What's Using a Port

```bash
# macOS/Linux
lsof -i :8001
lsof -i :8002

# Windows
netstat -ano | findstr :8001
netstat -ano | findstr :8002
```

## Finding Available Ports

If both 8001 and 8002 are taken, use:
```bash
# Try 8003-8010 range
npm run dev -- --port 8003
# or
npm run preview -- --port 8010
```

## Temporary Override

If you need to test without updating the config:
```bash
# Check ports first
lsof -i :8001
lsof -i :8002

# Then run with custom ports
PORT=8003 npm run dev
PORT=8005 npm run preview
```

## Recommended Workflow

1. **Check if ports are free**:
   ```bash
   lsof -i :8001
   lsof -i :8002
   ```

2. **If taken, free them**:
   ```bash
   kill -9 $(lsof -ti :8001)
   kill -9 $(lsof -ti :8002)
   ```

3. **Start the app**:
   ```bash
   npm run dev    # Uses 8001
   npm run preview # Uses 8002
   ```

4. **If you need alternatives**:
   ```bash
   npm run dev -- --port 8005
   # Visit http://localhost:8005
   ```
