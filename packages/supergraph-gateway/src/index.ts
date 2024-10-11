import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "material", url: "http://localhost:4001" },
      { name: "zone", url: "http://localhost:4002" },
      { name: "stock", url: "http://localhost:4003" },
    ],
  }),
})

const server = new ApolloServer({
  gateway,
})

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })

  console.log(`🚀  Supergraph gateway ready at ${url}`)
}

startServer()
