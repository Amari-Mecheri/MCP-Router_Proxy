# ngrok Setup Guide

## Installing ngrok

### Option 1: Using Chocolatey (Recommended for Windows)
```powershell
choco install ngrok
```

### Option 2: Manual Download
1. Go to https://ngrok.com/download
2. Download the Windows version
3. Extract `ngrok.exe` to a folder in your PATH (or the project directory)

### Option 3: Using winget
```powershell
winget install ngrok
```

## Setting up ngrok

1. **Sign up** (free): https://dashboard.ngrok.com/signup
2. **Get your authtoken**: https://dashboard.ngrok.com/get-started/your-authtoken
3. **Authenticate**:
   ```powershell
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

## Running ngrok for your MCP Server

Since your server is running on port 3000:

```powershell
ngrok http 3000
```

This will output something like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Your public SSE endpoint will be:
```
https://abc123.ngrok-free.app/sse
```

## Using with ChatGPT Desktop

1. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app/sse`)
2. In ChatGPT Desktop settings, add your MCP server with this URL
3. Start chatting!

## Tips
- Keep the ngrok terminal window open while testing
- The free tier URL changes each time you restart ngrok
- For a persistent URL, consider ngrok paid tier or deploy to Render
