import { createServer } from 'http';
import path from 'path';

import express from 'express';
import { DocumentNode } from 'graphql';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadTypedefs } from '@graphql-tools/load';
import { mergeTypeDefs } from '@graphql-tools/merge';

import { resolvers } from './resolvers';
import { json } from 'body-parser';

export const startServer = async () => {

  const typeDefsSources = await loadTypedefs(path.join(__dirname, '/schemas/**/*.gql'), {
    loaders: [new GraphQLFileLoader()],
  });
  const documentNodes: Array<DocumentNode | undefined> = typeDefsSources.map(
    (source) => source.document,
  );

  const typeDefs = mergeTypeDefs(documentNodes as Array<DocumentNode>);

  const app = express();

  const httpServer = createServer(app);

  const schema = buildSubgraphSchema([
    {
      typeDefs,
      resolvers,
    },
  ]);

  // @ts-ignore
  const server = new ApolloServer({
    apollo: {
      key: process.env.APOLLO_KEY,
      graphRef: process.env.APOLLO_GRAPH_REF,
    },
    typeDefs,
    resolvers,
    introspection: true,
    stopOnTerminationSignals: false,
    csrfPrevention: false,
    schema,
  });

  app.get('/health', (req, res) => {
    res.json({ success: true });
  });

  await server.start();

  app.use(
    '/graphql',
    json(),
    expressMiddleware(server),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4002 }, resolve),
  );

  console.log(
    `🚀 - Module two ready at port http://localhost:4002/graphql`,
  );
}

startServer();
