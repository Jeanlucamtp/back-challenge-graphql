const { ApolloServer, gql } = require('apollo-server');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Abre a conexão com o banco de dados
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
  }

  type Project {
    id: Int
    name: String
    email: String
    price: Float
    user: User
  }

  type Query {
    projects: [Project]
    users: [User]
  }

  input ItemInput {
    id: Int
    name: String
    email: String
  }

  input ItemInputProject {
    id: Int
    name: String
    email: String
    price: Float
    user: ItemInput
  }

  type Mutation {
    saveUser(item: ItemInput): User
    saveProject(item: ItemInputProject): Project
  }
`;

const resolvers = {
  Query: {
    async projects() {
      try {
        const projects = await new Promise((resolve, reject) => {
          db.all("SELECT projects.*, users.name AS user_name, users.email AS user_email FROM projects LEFT JOIN users ON projects.user_id = users.id", (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });    
        return projects.map(project => ({
          ...project,
          email: project.email,
          user: { 
            id: project.user_id, 
            name: project.user_name, 
            email: project.user_email  
          },
        }));
        
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        throw error;
      }
    },
    async users() {
      try {
        const users = await new Promise((resolve, reject) => {
          db.all("SELECT * FROM users", (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
        return users;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      }
    }
  },
  Mutation: {
    saveUser: (_, { item }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (name, email) VALUES (?, ?)', [item.name, item.email], function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, name: item.name, email: item.email });
        });
      });
    },
    saveProject: (_, { item }) => {
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO projects (name, email, price, user_id) VALUES (?, ?, ?, ?)', [item.name, item.email, item.price, item.user.id], function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, name: item.name, email: item.email, price: item.price, user: item.user });
        });
      });
    }
    
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Servidor online ${url}`);
});
