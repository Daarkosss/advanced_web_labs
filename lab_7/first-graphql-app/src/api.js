
import axios from "axios";

const API_URL = 'http://localhost:8080/api/v1/'

export async function getFromAPI(endpoint) {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function postToAPI(endpoint, data) {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
  }
}

export async function putToAPI(endpoint, data) {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

export async function deleteFromAPI(endpoint) {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`);
    return response.data
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

export async function getRestUsersList() {     
    try {         
      const users = await axios.get("https://jsonplaceholder.typicode.com/users")         
      console.log(users);         
      return users.data
    } catch (error) {         
      throw error 
    }
  }
  
export async function getRestTodosList() {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}
  