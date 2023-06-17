// import user model
const { User } = require('../models');
// import sign token function from auth
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
            // Add logic to create a user
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body
        login: async (parent, { email, password }) => {
            // Add logic to login a user
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, { authors, description, title, image, link }, { user }) => {
            // Add logic to save a book to a user's savedBooks
        },
        // remove a book from `savedBooks`
        removeBook: async (parent, { bookId }, { user }) => {
            // Add logic to remove a book from a user's savedBooks
        }
    }
},

};

module.exports = resolvers;
