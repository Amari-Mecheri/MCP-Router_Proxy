
const express = require("express");
const cors = require("cors");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ErrorCode,
    McpError,
} = require("@modelcontextprotocol/sdk/types.js");
const { calculate, translate, translateFromZuglang, decimalToZuglang, zuglangToDecimal } = require("./zuglang.js");

const app = express();
app.use(cors());

const server = new Server(
    {
        name: "zuglang-router",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tool Definitions
const GET_ZUGLANG_TOOLS_TOOL = {
    name: "get_zuglang_tools",
    description: "Returns the signature of other MCP server tools",
    inputSchema: {
        type: "object",
        properties: {},
    },
};

const ZUGLANG_CALCULATOR_TOOL = {
    name: "zuglang_calculator",
    description: "Calculates the result of an operation on two Zuglang numbers",
    inputSchema: {
        type: "object",
        properties: {
            a: { type: "string", description: "First Zuglang number (A-J)" },
            b: { type: "string", description: "Second Zuglang number (A-J)" },
            operator: { type: "string", description: "Operator (+, -, *, /)" },
        },
        required: ["a", "b", "operator"],
    },
};

const ZUGLANG_TRANSLATOR_TOOL = {
    name: "zuglang_translator",
    description: "Translates text to Zuglang (numbers wrapped in {})",
    inputSchema: {
        type: "object",
        properties: {
            text: { type: "string", description: "Text to translate" },
        },
        required: ["text"],
    },
};

const TRANSLATE_FROM_ZUGLANG_TOOL = {
    name: "translate_from_zuglang",
    description: "Translates Zuglang text back to normal text",
    inputSchema: {
        type: "object",
        properties: {
            text: { type: "string", description: "Zuglang text to translate" },
        },
        required: ["text"],
    },
};

const DECIMAL_TO_ZUGLANG_TOOL = {
    name: "decimal_to_zuglang",
    description: "Converts a decimal number to Zuglang",
    inputSchema: {
        type: "object",
        properties: {
            decimal: { type: "string", description: "Decimal number" },
        },
        required: ["decimal"],
    },
};

const ZUGLANG_TO_DECIMAL_TOOL = {
    name: "zuglang_to_decimal",
    description: "Converts a Zuglang number to decimal",
    inputSchema: {
        type: "object",
        properties: {
            zuglang: { type: "string", description: "Zuglang number" },
        },
        required: ["zuglang"],
    },
};

// Handler for ListTools - Only expose the discovery tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [GET_ZUGLANG_TOOLS_TOOL],
    };
});

// Handler for CallTool - Handle all tools including hidden ones
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "get_zuglang_tools") {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify([
                        ZUGLANG_CALCULATOR_TOOL,
                        ZUGLANG_TRANSLATOR_TOOL,
                        TRANSLATE_FROM_ZUGLANG_TOOL,
                        DECIMAL_TO_ZUGLANG_TOOL,
                        ZUGLANG_TO_DECIMAL_TOOL
                    ], null, 2),
                },
            ],
        };
    }

    if (name === "zuglang_calculator") {
        try {
            const { a, b, operator } = args;
            if (!a || !b || !operator) throw new Error("Missing arguments");
            const result = calculate(a, b, operator);
            return { content: [{ type: "text", text: result }] };
        } catch (error) {
            throw new McpError(ErrorCode.InvalidParams, error.message);
        }
    }

    if (name === "zuglang_translator") {
        try {
            const { text } = args;
            if (!text) throw new Error("Missing argument text");
            const result = translate(text);
            return { content: [{ type: "text", text: result }] };
        } catch (error) {
            throw new McpError(ErrorCode.InvalidParams, error.message);
        }
    }

    if (name === "translate_from_zuglang") {
        try {
            const { text } = args;
            if (!text) throw new Error("Missing argument text");
            const result = translateFromZuglang(text);
            return { content: [{ type: "text", text: String(result) }] };
        } catch (error) {
            throw new McpError(ErrorCode.InvalidParams, error.message);
        }
    }

    if (name === "decimal_to_zuglang") {
        try {
            const { decimal } = args;
            if (decimal === undefined) throw new Error("Missing argument decimal");
            const result = decimalToZuglang(decimal);
            return { content: [{ type: "text", text: result }] };
        } catch (error) {
            throw new McpError(ErrorCode.InvalidParams, error.message);
        }
    }

    if (name === "zuglang_to_decimal") {
        try {
            const { zuglang } = args;
            if (!zuglang) throw new Error("Missing argument zuglang");
            const result = zuglangToDecimal(zuglang);
            return { content: [{ type: "text", text: String(result) }] };
        } catch (error) {
            throw new McpError(ErrorCode.InvalidParams, error.message);
        }
    }

    throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
});

// SSE Transport Setup
let transport;

app.get("/sse", async (req, res) => {
    console.log("New SSE connection");
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(404).send("Session not found");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});
