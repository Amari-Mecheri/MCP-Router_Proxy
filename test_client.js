
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { SSEClientTransport } = require("@modelcontextprotocol/sdk/client/sse.js");

async function main() {
    const transport = new SSEClientTransport(new URL("http://localhost:3000/sse"));
    const client = new Client(
        {
            name: "test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    console.log("Connecting to server...");
    await client.connect(transport);
    console.log("Connected!");

    // 1. List Tools
    console.log("\n--- Listing Tools ---");
    const tools = await client.listTools();
    console.log("Tools found:", tools.tools.map(t => t.name));

    if (tools.tools.length !== 1 || tools.tools[0].name !== "get_zuglang_tools") {
        console.error("FAIL: Expected only 'get_zuglang_tools'");
    } else {
        console.log("PASS: Only 'get_zuglang_tools' is exposed.");
    }

    // 2. Call get_zuglang_tools
    console.log("\n--- Calling get_zuglang_tools ---");
    const hiddenToolsResult = await client.callTool({
        name: "get_zuglang_tools",
        arguments: {},
    });

    const hiddenTools = JSON.parse(hiddenToolsResult.content[0].text);
    console.log("Hidden tools signatures:", hiddenTools.map(t => t.name));

    if (hiddenTools.length === 5) {
        console.log("PASS: 5 hidden tools returned.");
    } else {
        console.error(`FAIL: Expected 5 hidden tools, got ${hiddenTools.length}`);
    }

    // 3. Call zuglang_calculator
    console.log("\n--- Calling zuglang_calculator (BA + BA) ---");
    const calcResult = await client.callTool({
        name: "zuglang_calculator",
        arguments: {
            a: "BA",
            b: "BA",
            operator: "+",
        },
    });
    console.log("Result:", calcResult.content[0].text);
    if (calcResult.content[0].text === "CA") {
        console.log("PASS: Calculator result is correct.");
    } else {
        console.error(`FAIL: Expected CA, got ${calcResult.content[0].text}`);
    }

    // 4. Call zuglang_translator
    console.log("\n--- Calling zuglang_translator ('Hello 123') ---");
    // H->I, e->f, l->m, l->m, o->p. "Ifmmp"
    // 123 -> {BCD}
    const transResult = await client.callTool({
        name: "zuglang_translator",
        arguments: {
            text: "Hello 123",
        },
    });
    console.log("Result:", transResult.content[0].text);
    if (transResult.content[0].text === "Ifmmp {BCD}") {
        console.log("PASS: Translator result is correct.");
    } else {
        console.error(`FAIL: Expected 'Ifmmp {BCD}', got '${transResult.content[0].text}'`);
    }

    // 5. Call translate_from_zuglang
    console.log("\n--- Calling translate_from_zuglang ('Ifmmp {BCD}') ---");
    const revTransResult = await client.callTool({
        name: "translate_from_zuglang",
        arguments: {
            text: "Ifmmp {BCD}",
        },
    });
    console.log("Result:", revTransResult.content[0].text);
    if (revTransResult.content[0].text === "Hello 123") {
        console.log("PASS: Reverse translator result is correct.");
    } else {
        console.error(`FAIL: Expected 'Hello 123', got '${revTransResult.content[0].text}'`);
    }

    // 6. Call decimal_to_zuglang
    console.log("\n--- Calling decimal_to_zuglang (123) ---");
    const d2zResult = await client.callTool({
        name: "decimal_to_zuglang",
        arguments: {
            decimal: "123",
        },
    });
    console.log("Result:", d2zResult.content[0].text);
    if (d2zResult.content[0].text === "BCD") {
        console.log("PASS: Decimal to Zuglang is correct.");
    } else {
        console.error(`FAIL: Expected 'BCD', got '${d2zResult.content[0].text}'`);
    }

    // 7. Call zuglang_to_decimal
    console.log("\n--- Calling zuglang_to_decimal (BCD) ---");
    const z2dResult = await client.callTool({
        name: "zuglang_to_decimal",
        arguments: {
            zuglang: "BCD",
        },
    });
    console.log("Result:", z2dResult.content[0].text);
    if (z2dResult.content[0].text === "123") {
        console.log("PASS: Zuglang to Decimal is correct.");
    } else {
        console.error(`FAIL: Expected '123', got '${z2dResult.content[0].text}'`);
    }

    process.exit(0);
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
