const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    // queries fetch specific data from the server, rather than everything
    Query: {
        // get a single user by either their id or their username
        user: async (parent, { userId, username }) => {
            const params = userId ? { _id: userId } : { username };
            return User.findOne({ params })
        }
    },
    // mutations modify the data on the server:
    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, { username, email, password }) => {
            // logic to create a user
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body
        login: async (parent, { email, password }) => {
            // Add logic to login a user
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No profile with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
            // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } }, },
                    { new: true, runValidators: true }
                );
            }
            // If user attempts to execute this mutation and isn't logged in, throw an error
            throw new AuthenticationError('You need to be logged in!');
        },
        // remove a book from `savedBooks`
        removeBook: async (parent, { bookId }, context) => {
            // Add logic to remove a book from a user's savedBooks
            if (context.user) {
                return User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $pull: { savedBooks: {bookId} } },
                  { new: true }
                );
              }
              throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;
