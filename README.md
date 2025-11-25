# Zuglang MCP Router

A proof-of-concept MCP server that implements a dynamic tool discovery pattern.

## Features
- **Dynamic Tool Discovery**: Exposes `get_zuglang_tools` to reveal hidden tools
- **Zuglang Calculator**: Math operations on Zuglang numbers (A=0, B=1...J=9)
- **Zuglang Translator**: Text ⇄ Zuglang with `{}` wrapped numbers
- **Number Converters**: Decimal ⇄ Zuglang conversion

## Quick Start

### Local Development
```bash
npm install
node server.js
```

Server runs on `http://localhost:3000`
SSE endpoint: `http://localhost:3000/sse`

### Testing
```bash
node test_client.js
```

## Deployment
See [deployment guide](deployment_guide.md) for free hosting options (Render, Azure App Service).

## Usage with ChatGPT Desktop
1. Deploy to a public URL (e.g., Render)
2. In ChatGPT Desktop settings, add MCP server with your SSE endpoint URL
3. Ask ChatGPT to discover tools: "Call get_zuglang_tools"
4. ChatGPT will learn about and can use the hidden tools

## Tools Exposed
- `get_zuglang_tools` - Discovery tool (visible)
- `zuglang_calculator` - Math operations (hidden)
- `zuglang_translator` - Text to Zuglang (hidden)
- `translate_from_zuglang` - Zuglang to Text (hidden)
- `decimal_to_zuglang` - Number converter (hidden)
- `zuglang_to_decimal` - Number converter (hidden)
