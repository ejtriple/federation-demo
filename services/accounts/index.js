const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const typeDefs = gql`
  scalar Date

  enum Status {
    active
    invited
  }

  extend type Query {
    me: User,
    users: [User]
    user(id: ID): User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
    brands: String
    role: String
    dtCreated: Date
    dtConfirmed: Date
    dtDeleted: Date
    status: Status
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
    users() {
      return users;
    },
    user: (obj, { id }, context, info) => {
      console.log("REG");
      return users.find((user) => user.id === id)
    },
  },
  User: {
    __resolveReference(object) {
      console.log("HERE", object);
      return users.find(user => user.id === object.id);
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date type',
    parseValue(value) {
      // return value
      return new Date(value)
    },
    serialize(value) {
      const createDate =  new Date(value)
      return createDate.getTime()
      // return new Date(value)
      // return value
    },
    parseLiteral(ast) {
      console.log(ast)
      if (ast.kind === Kind.INT) {
        return new Date(ast.value)
      }
      return null
    },
  }),
};

const server = new ApolloServer({
  debug: true,
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Elliot Triplett",
    dtCreated: "1989-06-03",
    username: "elliot.triplett@cart.com",
    brands: "2",
    role: "admin",
    status: "active"
  },
  {
    id: "2",
    name: "Lee Harris",
    dtCreated: "1912-01-01",
    username: "lee.harris@cart.com",
    brands: "1",
    role: "user",
    status: "invited"
  },
  {
    id: "3",
    name: "Chris Casey",
    dtCreated: "1971-01-01",
    username: "chris.casey@cart.com",
    brands: "1",
    role: "user",
    status: "active"
  }
];
