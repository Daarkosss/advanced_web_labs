import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');

const usersList = [     
  { id: 1, name: "Jan Konieczny", email: "jan.konieczny@wonet.pl", login: "jkonieczny" },
  { id: 2, name: "Anna Wesołowska", email: "anna.w@sad.gov.pl", login: "anna.wesolowska" },     
  { id: 3, name: "Piotr Waleczny", email: "piotr.waleczny@gp.pl", login: "p.waleczny" } 
];  

const todosList = [     
  { id: 1, title: "Naprawić samochód", completed: false, user_id: 3 },     
  { id: 2, title: "Posprzątać garaż",  completed: true,  user_id: 3 },     
  { id: 3, title: "Napisać e-mail",    completed: false, user_id: 3 },     
  { id: 4, title: "Odebrać buty",      completed: false, user_id: 2 },     
  { id: 5, title: "Wysłać paczkę",     completed: true,  user_id: 2 },     
  { id: 6, title: "Zamówic kuriera",   completed: false, user_id: 3 }, 
];

function todoById(parent, args, context, info) {     
  return todosList.find(t => t.id == args.id); 
}  

async function getFromAPI(endpoint) {
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
}

async function postToAPI(endpoint, data) {
  const response = await axios.post(`http://localhost:8080/api/v1/${endpoint}`, data);
  return response.data;
}

async function putToAPI(endpoint, data) {
  console.log(`http://localhost:8080/api/v1/${endpoint}`)
  const response = await axios.put(`http://localhost:8080/api/v1/${endpoint}`, data);
  return response.data;
}

async function deleteFromAPI(endpoint) {
  const response = await axios.delete(`http://localhost:8080/api/v1/${endpoint}`);
  return response.data;
}

function userById(parent, args, context, info) {     
  return usersList.find(u => u.id == args.id); 
}

function createUser(parent, args, context, info) {
  const { name, email, login } = args;
  const lastId = usersList.reduce((max, user) => user.id > max ? user.id : max, 0); // znajdź najwyższe id
  const newUser = {
    id: lastId + 1,  // przypisz nowe id większe o 1 od najwyższego
    name,
    email,
    login
  };
  usersList.push(newUser);
  return newUser;
}


function updateUser(parent, args, context, info) {
  const { id, name, email, login } = args;
  const user = usersList.find(u => u.id == id);
  if (!user) return null;
  user.name = name !== undefined ? name : user.name;
  user.email = email !== undefined ? email : user.email;
  user.login = login !== undefined ? login : user.login;
  return user;
}


function deleteUser(parent, args, context, info) {
  const { id } = args;
  const index = usersList.findIndex(u => u.id == id);
  if (index === -1) return null;
  const [deletedUser] = usersList.splice(index, 1);
  return deletedUser;
}


function createToDo(parent, args, context, info) {
  const { title, completed, user_id } = args;
  const lastId = todosList.reduce((max, todo) => todo.id > max ? todo.id : max, 0); // znajdź najwyższe id
  const newToDo = {
    id: lastId + 1,  // przypisz nowe id większe o 1 od najwyższego
    title,
    completed,
    user_id
  };
  todosList.push(newToDo);
  return newToDo;
}



function updateToDo(parent, args, context, info) {
  const { id, title, completed } = args;
  const todo = todosList.find(t => t.id == id);
  if (!todo) return null;
  todo.title = title !== undefined ? title : todo.title;
  todo.completed = completed !== undefined ? completed : todo.completed;
  return todo;
}


function deleteToDo(parent, args, context, info) {
  const { id } = args;
  const index = todosList.findIndex(t => t.id == id);
  if (index === -1) return null;
  const [deletedToDo] = todosList.splice(index, 1);
  return deletedToDo;
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


const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        users: async () => usersList,//getRestUsersList(),         
        todos: () => todosList,       
        todo: (parent, args, context, info) => todoById(parent, args, context, info),
        user: (parent, args, context, info) => userById(parent, args, context, info),
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
        createUser: (parent, args, context, info) => createUser(parent, args, context, info),
        updateUser: (parent, args, context, info) => updateUser(parent, args, context, info),
        deleteUser: (parent, args, context, info) => deleteUser(parent, args, context, info),
        createToDo: (parent, args, context, info) => createToDo(parent, args, context, info),
        updateToDo: (parent, args, context, info) => updateToDo(parent, args, context, info),
        deleteToDo: (parent, args, context, info) => deleteToDo(parent, args, context, info),
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
      User: {         
        todos: (parent, args, context, info) => {             
          return todosList.filter(t => t.user_id == parent.id);         
        }      
      },
      ToDoItem: {         
        user: (parent, args, context, info) => {             
          return usersList.find(u => u.id == parent.user_id);         
        }     
      }, 
    }
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})