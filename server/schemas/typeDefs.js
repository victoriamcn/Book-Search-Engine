const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    # an array of the Book type
    savedBooks: [Book]
}
type Book {
    #Not the _id, but the book's id value 
    #returned from Google's Book API.
    bookId: String!
    #An array of strings, as there may be more than one author.
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

input InputNewBook {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
}

type Auth {
    token: ID!
    # References the User type.
    user: User
}
type Query {
   # user(id: ID!): User
   me: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth #User
    login(email: String!, password: String!): Auth #User

    #saveBook(bookId: String, authors: [String], description: String!, title: String!, image: String, link: String): User
    saveBook(InputNewBook: InputNewBook!): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;
