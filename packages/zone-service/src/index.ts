import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled"
import { startStandaloneServer } from "@apollo/server/standalone"
import { buildSubgraphSchema } from "@apollo/subgraph"
import { gql } from "graphql-tag"
import { Zone } from "./types/zone"

const typeDefs = gql`
  extend type Material @key(fields: "id") {
    id: ID! @external
  }

  type Zone @key(fields: "id") {
    id: ID!
    name: String!
    materials: [Material!]!
  }

  type Query {
    zones: [Zone!]!
  }
`

const zones: Zone[] = [
  { id: "1", name: "Zone A", materialIds: ["1", "2"] },
  { id: "2", name: "Zone B", materialIds: ["2", "3"] },
]

const resolvers = {
  Zone: {
    materials: (zone: Zone) => {
      return zone.materialIds.map((materialId: string) => ({
        __typename: "Material",
        id: materialId,
      }))
    },
  },
  Query: {
    zones: () => zones,
  },
}

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  plugins: [ApolloServerPluginInlineTraceDisabled()],
})

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 },
  })

  console.log(`🚀  Zone service ready at ${url}`)
}

startServer()
