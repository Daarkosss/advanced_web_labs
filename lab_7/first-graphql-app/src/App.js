import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mockTodosList, mockUsersList } from './mockData.js';
import { postToAPI, getFromAPI, deleteFromAPI, putToAPI, getRestTodosList, getRestUsersList } from './api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');


function todoById(parent, args, context, info) {     
  return mockTodosList.find(t => t.id == args.id); 
}  


function userById(parent, args, context, info) {     
  return mockUsersList.find(u => u.id == args.id); 
}

function createUser(parent, args, context, info) {
  const { name, email, login } = args;
  const lastId = mockUsersList.reduce((max, user) => user.id > max ? user.id : max, 0); // znajdź najwyższe id
  const newUser = {
    id: lastId + 1,  // przypisz nowe id większe o 1 od najwyższego
    name,
    email,
    login
  };
  mockUsersList.push(newUser);
  return newUser;
}


function updateUser(parent, args, context, info) {
  const { id, name, email, login } = args;
  const user = mockUsersList.find(u => u.id == id);
  if (!user) return null;
  user.name = name !== undefined ? name : user.name;
  user.email = email !== undefined ? email : user.email;
  user.login = login !== undefined ? login : user.login;
  return user;
}


function deleteUser(parent, args, context, info) {
  const { id } = args;
  const index = mockUsersList.findIndex(u => u.id == id);
  if (index === -1) return null;
  const [deletedUser] = mockUsersList.splice(index, 1);
  return deletedUser;
}


function createToDo(parent, args, context, info) {
  const { title, completed, userId} = args;
  const lastId = mockTodosList.reduce((max, todo) => todo.id > max ? todo.id : max, 0); // znajdź najwyższe id
  const newToDo = {
    id: lastId + 1,  // przypisz nowe id większe o 1 od najwyższego
    title,
    completed,
    userId
  };
  mockTodosList.push(newToDo);
  return newToDo;
}


function updateToDo(parent, args, context, info) {
  const { id, title, completed } = args;
  const todo = mockTodosList.find(t => t.id == id);
  if (!todo) return null;
  todo.title = title !== undefined ? title : todo.title;
  todo.completed = completed !== undefined ? completed : todo.completed;
  return todo;
}


function deleteToDo(parent, args, context, info) {
  const { id } = args;
  const index = mockTodosList.findIndex(t => t.id == id);
  if (index === -1) return null;
  const [deletedToDo] = mockTodosList.splice(index, 1);
  return deletedToDo;
}

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        mockUsers: async () => mockUsersList,
        mockTodos: () => mockTodosList,
        mockTodo: (parent, args, context, info) => todoById(parent, args, context, info),
        mockUser: (parent, args, context, info) => userById(parent, args, context, info),

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

        book: (_, { id }) => getFromAPI(`book/${id}`),
        books: async (_, { page, size, sort }) => {
          const response = await getFromAPI(`books?page=${page}&size=${size}&sort=${sort}`);
          return response.content;
        },

        author: (_, { id }) => getFromAPI(`author/${id}`),
        authors: async (_, { page, size, sort }) => {
          const response = await getFromAPI(`authors?page=${page}&size=${size}&sort=${sort}`);
          return response.content;
        },

        borrow: (_, { id }) => getFromAPI(`borrow/${id}`),
        borrows: async (_, { page, size, sort }) => {
          const response = await getFromAPI(`borrows?page=${page}&size=${size}&sort=${sort}`);
          return response.content;
        },
      },
      Mutation: {
        mockCreateUser: (parent, args, context, info) => createUser(parent, args, context, info),
        mockUpdateUser: (parent, args, context, info) => updateUser(parent, args, context, info),
        mockDeleteUser: (parent, args, context, info) => deleteUser(parent, args, context, info),
        mockCreateToDo: (parent, args, context, info) => createToDo(parent, args, context, info),
        mockUpdateToDo: (parent, args, context, info) => updateToDo(parent, args, context, info),
        mockDeleteToDo: (parent, args, context, info) => deleteToDo(parent, args, context, info),

        createBook: async (_, { title, authorId, pages, releaseDate }) => {
          return postToAPI('book/create', { title, authorId, pages, releaseDate });
        },
        updateBook: async (_, { id, title, authorId, pages, releaseDate }) => {
          if (!id) throw new Error("No ID provided for the book to update.");
          return putToAPI(`book/${id}`, { title, authorId, pages, releaseDate });
        },
        deleteBook: async (_, { id }) => {
          return deleteFromAPI(`book/${id}`);
        },

        createAuthor: (_, { firstName, lastName, country, birthDate }) => {
          return postToAPI('author/create', { firstName, lastName, country, birthDate });
        },
        updateAuthor: (_, { id, firstName, lastName, country, birthDate }) => {
          return putToAPI(`author/${id}`, { firstName, lastName, country, birthDate });
        },
        deleteAuthor: (_, { id }) => {
          return deleteFromAPI(`author/${id}`);
        },
      },

      MockUser: {
        todos: (parent, args, context, info) => {             
          return mockTodosList.filter(t => t.userId == parent.id);         
        }  
      },
      MockToDoItem: {
        user: (parent, args, context, info) => {             
          return mockUsersList.find(u => u.id == parent.userId);         
        }  
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