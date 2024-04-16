import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf8');

const mockUsersList = [     
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
  {
    "id": 2,
    "name": "Ervin Howell",
    "username": "Antonette",
    "email": "Shanna@melissa.tv",
    "address": {
      "street": "Victor Plains",
      "suite": "Suite 879",
      "city": "Wisokyburgh",
      "zipcode": "90566-7771",
      "geo": {
        "lat": "-43.9509",
        "lng": "-34.4618"
      }
    },
    "phone": "010-692-6593 x09125",
    "website": "anastasia.net",
    "company": {
      "name": "Deckow-Crist",
      "catchPhrase": "Proactive didactic contingency",
      "bs": "synergize scalable supply-chains"
    }
  },
  {
    "id": 3,
    "name": "Clementine Bauch",
    "username": "Samantha",
    "email": "Nathan@yesenia.net",
    "address": {
      "street": "Douglas Extension",
      "suite": "Suite 847",
      "city": "McKenziehaven",
      "zipcode": "59590-4157",
      "geo": {
        "lat": "-68.6102",
        "lng": "-47.0653"
      }
    },
    "phone": "1-463-123-4447",
    "website": "ramiro.info",
    "company": {
      "name": "Romaguera-Jacobson",
      "catchPhrase": "Face to face bifurcated interface",
      "bs": "e-enable strategic applications"
    }
  },
  {
    "id": 4,
    "name": "Patricia Lebsack",
    "username": "Karianne",
    "email": "Julianne.OConner@kory.org",
    "address": {
      "street": "Hoeger Mall",
      "suite": "Apt. 692",
      "city": "South Elvis",
      "zipcode": "53919-4257",
      "geo": {
        "lat": "29.4572",
        "lng": "-164.2990"
      }
    },
    "phone": "493-170-9623 x156",
    "website": "kale.biz",
    "company": {
      "name": "Robel-Corkery",
      "catchPhrase": "Multi-tiered zero tolerance productivity",
      "bs": "transition cutting-edge web services"
    }
  },
];  

const mockTodosList = [     
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
  {
    "userId": 2,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  },
  {
    "userId": 4,
    "id": 4,
    "title": "et porro tempora",
    "completed": true
  },
  {
    "userId": 4,
    "id": 5,
    "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
    "completed": true
  },
  {
    "userId": 4,
    "id": 6,
    "title": "qui ullam ratione quibusdam voluptatem quia omnis",
    "completed": false
  },
];

function todoById(parent, args, context, info) {     
  return mockTodosList.find(t => t.id == args.id); 
}  


const API_URL = 'http://localhost:8080/api/v1/'

async function getFromAPI(endpoint) {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
}

async function postToAPI(endpoint, data) {
  const response = await axios.post(`${API_URL}${endpoint}`, data);
  return response.data;
}

async function putToAPI(endpoint, data) {
  console.log(`${API_URL}${endpoint}`)
  const response = await axios.put(`${API_URL}${endpoint}`, data);
  return response.data;
}

async function deleteFromAPI(endpoint) {
  const response = await axios.delete(`${API_URL}${endpoint}`);
  return response.data;
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


async function getRestUsersList() {     
  try {         
    const users = await axios.get("https://jsonplaceholder.typicode.com/users")         
    console.log(users);         
    return users.data
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