import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import Book from "./models/book.js";

const MONGODB = "mongodb+srv://hntdienit:hntdienit@cluster0.dykcay5.mongodb.net/?retryWrites=true&w=majority";

const typeDefs = `#graphql
    type Book{
        _id: String
        author: String
        title: String
        year: Int
    }

    input BookInput {
        author: String
        title: String
        year: Int
    }

    type Query {
        getBook(ID: ID!): Book!
        getBooks(limit: Int): [Book]
    }

    type Mutation {
        createBook(bookInput: BookInput): String!
        updateBook(ID: ID!, bookInput: BookInput): String!
        deleteBook(ID: ID!): String!
    }
`;

const resolvers = {
  Query: {
    async getBook(_: any, agrs: any) {
      return await Book.findById(agrs.ID);
    },
    async getBooks(_: any, agrs: any) {
      return await Book.find().limit(agrs.limit);
    },
  },

  Mutation: {
    async createBook(_: any, agrs: any) {
      const { author, title, year } = agrs.bookInput;
      const res = await new Book({ author, title, year }).save();

      return res._id;
    },

    async updateBook(_: any, agrs: any) {
      const { ID } = agrs;
      const { author, title, year } = agrs.bookInput;

      await Book.updateOne({ _id: ID }, { $set: { author, title, year } });

      return ID;
    },

    async deleteBook(_: any, agrs: any) {
      const { ID } = agrs;

      await Book.deleteOne({ _id: ID });
      return ID;
    },
  },
};

await connect(MONGODB);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server is ready at ${url}`);
