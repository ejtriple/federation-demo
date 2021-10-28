const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`

  extend type Query {
    orders: [Order]
  }

  type Order @key(fields: "id") {
    id: ID!
    orderDate: String
    recipient: User
    product: Product
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    numberOfOrders: Int
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
  }
`;

const resolvers = {
  Query: {
    orders() {
      return orders;
    }
  },
  Order: {
    recipient(order) {
      return { __typename: "User", id: order.customerID };
    }
  },
  User: {
    orders(user) {
      return orders.filter(order => order.customerID === user.id);
    },
    numberOfOrders(user) {
      return orders.filter(order => order.customerID === user.id).length;
    }
  },
  Product: {
    orders(product) {
      return orders.filter(order => order.product.upc === product.upc);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const usernames = [
  { id: "1", username: "@etriplett" },
  { id: "2", username: "@lharris" }
];
const orders = [
  {
    id: "1",
    customerID: "1",
    product: { upc: "1" },
    orderDate: "01/01/2021"
  },
  {
    id: "2",
    customerID: "1",
    product: { upc: "2" },
    orderDate: "01/02/2021"
  },
  {
    id: "3",
    customerID: "2",
    product: { upc: "3" },
    orderDate: "01/03/2021"
  },
  {
    id: "4",
    customerID: "2",
    product: { upc: "1" },
    orderDate: "01/04/2021"
  }
];
