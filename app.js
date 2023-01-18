import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import { books, categories, authors } from './schema.js';

const app = express();
app.use(cors());

app.use(express.json());

export { app, typeDefs, resolvers };
