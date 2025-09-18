import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { 
    StdioServerTransport 
} from '@modelcontextprotocol/sdk/server/stdio.js'
import { 
    CallToolRequestSchema, ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  {
    name: 'favorite-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "get_matches",
      description: "Returns the matches for a given weekday",
      inputSchema: {
        type: "object",
        properties: {
          weekday: {
            type: 'string',
            description: 'the weekday to check the matches for',
          }
        },
        required: ["weekday"]
      }
    }, 
    {
        name: "get_betting_odds",
        description: "Returns the odds for a given bet",
        inputSchema: {
          type: "object",
          properties: {
            team: {
              type: 'string',
              description: 'the team to check the bet odds for',
            }
          },
          required: ["team"]
        }
      }
    ],
  }
})

server.setRequestHandler(CallToolRequestSchema, async request => {
  if (request.params.name === "get_matches") {
    const { weekday } = request.params.arguments
    // get ...
    return {
      content: [{
        type: 'text',
        text: `On ${weekday}, there is Real Madrid vs Barcelona at 9pm.`,
      }],
    }
  }
  if (request.params.name === "get_betting_odds") {
    const { team } = request.params.arguments
    return {
      content: [{
        type: 'text',
        text: `${team}, has a 1.2 betting offer.`,
      }],
    }
  }
  throw new McpError(ErrorCode.ToolNotFound, "Tool not found")
})




async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(error => {
  console.error('Server error:', error)
  process.exit(1)
})
