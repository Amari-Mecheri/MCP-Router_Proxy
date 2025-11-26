🚀 POC: Dynamic Tool Discovery avec Model Context Protocol (MCP)

Je viens de terminer un proof-of-concept passionnant qui explore une nouvelle approche pour l'intégration d'outils dans les LLMs via le protocole MCP d'Anthropic.

🎯 Le Défi
Comment permettre à un LLM de découvrir et utiliser des outils de manière dynamique, sans les exposer tous dès le départ? Un peu comme un routeur intelligente qui révèle ses capacités à la demande.

💡 La Solution
J'ai développé un "MCP Router" avec un pattern de découverte en deux temps:

1️⃣ Exposition minimale: Seuls 2 outils visibles
   • get_zuglang_tools - Pour découvrir les capacités
   • execute_tool - Pour exécuter les outils découverts

2️⃣ Découverte dynamique: L'IA appelle get_zuglang_tools et reçoit la liste complète des outils disponibles (calculateur, traducteur, convertisseurs...)

3️⃣ Exécution proxy: L'IA utilise execute_tool comme proxy pour exécuter les outils découverts

✨ Résultat
Claude Desktop intègre parfaitement le système. Quand je demande "Calculate BA + BA in Zuglang", Claude:
• Découvre automatiquement les outils disponibles
• Route la requête vers le bon outil
• Retourne le résultat (CA)

Le tout sans intervention manuelle!

🔧 Stack Technique
• Node.js + MCP SDK (@modelcontextprotocol/sdk)
• Transport: stdio (Claude Desktop) + HTTP/SSE (pour tests)
• Pattern: Router avec proxy d'exécution

🌟 Applications Possibles
• Agrégation de multiples serveurs MCP
• Outils contextuels (affichés selon le domaine de la conversation)
• Architecture microservices pour les capacités IA

Le code est sur GitHub si ça vous intéresse!

#AI #MCP #LLM #Innovation #POC #ClaudeAI #Anthropic #ArtificialIntelligence #DeveloperTools

---

Qu'en pensez-vous? Avez-vous exploré le protocole MCP? 💭
