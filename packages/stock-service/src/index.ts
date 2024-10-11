import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled"
import { startStandaloneServer } from "@apollo/server/standalone"
import { buildSubgraphSchema } from "@apollo/subgraph"
import { gql } from "graphql-tag"
import { Stock } from "./types/stock"
import { MaterialReference } from "./types/materialReference"

const typeDefs = gql`
  extend type Material @key(fields: "id") {
    id: ID! @external
    stocks: Stock!
  }

  type Stock {
    amount: Int!
  }

  type Query {
    stocks: [Stock!]!
  }
`

const stocks: Stock[] = [
  { id: "1", zoneId: "1", materialId: "1", amount: 100 },
  { id: "2", zoneId: "1", materialId: "2", amount: 50 },
  { id: "3", zoneId: "2", materialId: "2", amount: 80 },
  { id: "4", zoneId: "2", materialId: "3", amount: 120 },
]

const resolvers = {
  Material: {
    stocks: (material: MaterialReference) => {
      return stocks.find((stock) => stock.materialId === material.id)
    },
  },
  Query: {
    stocks: () => stocks,
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  plugins: [ApolloServerPluginInlineTraceDisabled()],
})

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4003 },
  })

  console.log(`🚀  Stock service ready at ${url}`)
}

startServer()
