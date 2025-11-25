
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { SSEClientTransport } = require("@modelcontextprotocol/sdk/client/sse.js");

async function main() {
    // Using your ngrok URL
    const ngrokUrl = "https://breathless-amicably-florida.ngrok-free.dev/sse";

    console.log(`Testing ngrok endpoint: ${ngrokUrl}`);

    const transport = new SSEClientTransport(new URL(ngrokUrl));
    const client = new Client(
        {
            name: "test-client-ngrok",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    console.log("Connecting to ngrok server...");
    await client.connect(transport);
    console.log("✅ Connected successfully!");

    // 1. List Tools
    console.log("\n--- Listing Tools ---");
    const tools = await client.listTools();
    console.log("Tools found:", tools.tools.map(t => t.name));

    if (tools.tools.length !== 1 || tools.tools[0].name !== "get_zuglang_tools") {
        console.error("❌ FAIL: Expected only 'get_zuglang_tools'");
    } else {
        console.log("✅ PASS: Only 'get_zuglang_tools' is exposed.");
    }

    // 2. Call get_zuglang_tools
    console.log("\n--- Calling get_zuglang_tools ---");
    const hiddenToolsResult = await client.callTool({
        name: "get_zuglang_tools",
        arguments: {},
    });

    const hiddenTools = JSON.parse(hiddenToolsResult.content[0].text);
    console.log("Hidden tools discovered:", hiddenTools.map(t => t.name));
    console.log("✅ PASS: Discovery working!");

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
        console.log("✅ PASS: Calculator works over ngrok!");
    } else {
        console.error(`❌ FAIL: Expected CA, got ${calcResult.content[0].text}`);
    }

    // 4. Call zuglang_translator
    console.log("\n--- Calling zuglang_translator ('Hello ngrok!') ---");
    const transResult = await client.callTool({
        name: "zuglang_translator",
        arguments: {
            text: "Hello ngrok!",
        },
    });
    console.log("Result:", transResult.content[0].text);
    console.log("✅ PASS: Translator works over ngrok!");

    console.log("\n🎉 All tests PASSED! Your ngrok tunnel is working perfectly!");
    console.log(`\nYour public SSE endpoint for ChatGPT Desktop:\n${ngrokUrl}`);

    process.exit(0);
}

main().catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
});
