import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');

function todoById(parent, args, context, info) {     
  return todosList.find(t => t.id == args.id); 
}  

function userById(parent, args, context, info) {     
  return usersList.find(u => u.id == args.id); 
}

async function getRestUsersList() {     
  try {         
    const users = await axios.get("https://jsonplaceholder.typicode.com/users")         
    console.log(users);         
    return users.data.map(({ id, name, email, username }) => ({           
      id: id,           
      name: name,           
      email: email,          
      login: username,         
    }))       
  } catch (error) {         
    throw error 
  }
}

async function getRestTodosList() {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}


const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        users: async () => await getRestUsersList(),         
        todos: async () => await getRestTodosList(),       
        todo: async (parent, { id }) => {
          const todos = await getRestTodosList();
          return todos.find(todo => todo.id === Number(id));
        },
        user: async (parent, { id }) => {
          const users = await getRestUsersList();
          return users.find(user => user.id === Number(id));
        },
      },
      User: {         
        todos: async (parent) => {
          const todos = await getRestTodosList();
          return todos.filter(todo => todo.userId === parent.id);
        }      
      },
      ToDoItem: {         
        user: async (parent) => {
          const users = await getRestUsersList();
          return users.find(user => user.id === parent.userId);
        }     
      },
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})