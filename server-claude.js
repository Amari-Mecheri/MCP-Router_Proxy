const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ErrorCode,
    McpError,
} = require("@modelcontextprotocol/sdk/types.js");
const { calculate, translate, translateFromZuglang, decimalToZuglang, zuglangToDecimal } = require("./zuglang.js");

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

// Tool Definitions (for discovery only)
const GET_ZUGLANG_TOOLS_TOOL = {
    name: "get_zuglang_tools",
    description: "Lists available Zuglang tools.",
    inputSchema: {
        type: "object",
        properties: {},
    },
};

const EXECUTE_TOOL = {
    name: "execute_tool",
    description: "Executes a Zuglang tool by name. Use this to call tools discovered via get_zuglang_tools.",
    inputSchema: {
        type: "object",
        properties: {
            tool_name: { type: "string", description: "Name of the tool to execute" },
            tool_arguments: { type: "object", description: "Arguments for the tool" },
        },
        required: ["tool_name", "tool_arguments"],
    },
};

const ZUGLANG_CALCULATOR_TOOL = {
    name: "zuglang_calculator",
    description: "Calculates the result of an operation on two Zuglang numbers",
    inputSchema: {
        type: "object",
        properties: {
            a: { type: "string", description: "First Zuglang number" },
            b: { type: "string", description: "Second Zuglang number" },
            operator: { type: "string", description: "Operator (+, -, *, /)" },
        },
        required: ["a", "b", "operator"],
    },
};

const ZUGLANG_TRANSLATOR_TOOL = {
    name: "zuglang_translator",
    description: "Translates text to Zuglang",
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
    description: "Translates from Zuglang text",
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

// Handler for ListTools - Expose discovery and execute tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [GET_ZUGLANG_TOOLS_TOOL, EXECUTE_TOOL],
    };
});

// Handler for CallTool
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

    if (name === "execute_tool") {
        const { tool_name, tool_arguments } = args;

        if (!tool_name) {
            throw new McpError(ErrorCode.InvalidParams, "Missing tool_name");
        }

        // Route to the appropriate tool
        if (tool_name === "zuglang_calculator") {
            const { a, b, operator } = tool_arguments;
            if (!a || !b || !operator) throw new Error("Missing arguments for calculator");
            const result = calculate(a, b, operator);
            return { content: [{ type: "text", text: result }] };
        }

        if (tool_name === "zuglang_translator") {
            const { text } = tool_arguments;
            if (!text) throw new Error("Missing text argument");
            const result = translate(text);
            return { content: [{ type: "text", text: result }] };
        }

        if (tool_name === "translate_from_zuglang") {
            const { text } = tool_arguments;
            if (!text) throw new Error("Missing text argument");
            const result = translateFromZuglang(text);
            return { content: [{ type: "text", text: String(result) }] };
        }

        if (tool_name === "decimal_to_zuglang") {
            const { decimal } = tool_arguments;
            if (decimal === undefined) throw new Error("Missing decimal argument");
            const result = decimalToZuglang(decimal);
            return { content: [{ type: "text", text: result }] };
        }

        if (tool_name === "zuglang_to_decimal") {
            const { zuglang } = tool_arguments;
            if (!zuglang) throw new Error("Missing zuglang argument");
            const result = zuglangToDecimal(zuglang);
            return { content: [{ type: "text", text: String(result) }] };
        }

        throw new McpError(ErrorCode.InvalidParams, `Unknown tool: ${tool_name}`);
    }

    throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
});

// Start the server with stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Zuglang MCP Router running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
