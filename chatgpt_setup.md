# Configuring Your MCP Server with ChatGPT Desktop

OpenAI ChatGPT Desktop now supports MCP (Model Context Protocol)!

## Configuration Steps

### 1. Locate the ChatGPT Desktop MCP Configuration File

**Windows:**
```
%APPDATA%\OpenAI\ChatGPT\config.json
```
or
```
C:\Users\<YourUsername>\AppData\Roaming\OpenAI\ChatGPT\config.json
```

**Mac:**
```
~/Library/Application Support/OpenAI/ChatGPT/config.json
```

### 2. Edit the Configuration

Add your MCP server to the configuration file:

```json
{
  "mcpServers": {
    "zuglang-router": {
      "url": "https://breathless-amicably-florida.ngrok-free.dev/sse"
    }
  }
}
```

If the file doesn't exist, create it with this content.

### 3. Restart ChatGPT Desktop

Close and reopen the ChatGPT Desktop app for changes to take effect.

### 4. Test with ChatGPT

Try these prompts:
- "What tools do you have access to?"
- "Call get_zuglang_tools to discover available tools"
- "Calculate BA + BA using the zuglang calculator"
- "Translate 'Hello World 123' to Zuglang"

## Troubleshooting

- **Server must be running**: Keep both `node server.js` and `ngrok http 3000` running
- **Check logs**: Look at your server terminal for incoming requests
- **Verify URL**: Make sure the ngrok URL matches what's in config.json
- **Free tier**: ngrok URLs change on restart - update config.json if needed

## Alternative: SSE Transport Configuration

Some implementations may require:
```json
{
  "mcpServers": {
    "zuglang-router": {
      "transport": "sse",
      "endpoint": "https://breathless-amicably-florida.ngrok-free.dev/sse"
    }
  }
}
```

Try both formats if one doesn't work.
