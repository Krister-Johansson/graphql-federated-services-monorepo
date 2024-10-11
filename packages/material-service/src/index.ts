import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled"
import { startStandaloneServer } from "@apollo/server/standalone"
import { buildSubgraphSchema } from "@apollo/subgraph"
import { gql } from "graphql-tag"
import { MaterialReference } from "./types/materialReference"
import { Material } from "./types/material"

const typeDefs = gql`
  type Material @key(fields: "id") {
    id: ID!
    name: String!
  }

  type Query {
    materials: [Material!]!
  }
`

const materials: Material[] = [
  { id: "1", name: "Sand" },
  { id: "2", name: "Gravel" },
  { id: "3", name: "Cement" },
]

const resolvers = {
  Query: {
    materials: () => materials,
  },
  Material: {
    __resolveReference: (material: MaterialReference) => {
      return materials.find((m) => m.id === material.id)
    },
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  plugins: [ApolloServerPluginInlineTraceDisabled()],
})

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
  })

  console.log(`🚀  Material service ready at ${url}`)
}

startServer()
