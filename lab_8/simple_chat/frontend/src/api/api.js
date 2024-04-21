
export const API_BASE_URL = "http://localhost:8080";
export const SOCKET_BASE_URL = "http://localhost:8085";


class API {
  constructor() {
    this.socketManager = null;
  }

  async fetch(method, path, body, headers = {}) {
    const options = {
      method: method,
      headers: {
          'Content-Type': 'application/json',
          ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }

  async getRoomMessages(room) {
    const response = await this.fetch(
      'GET', 
      `/message/${room}`, 
    );
    console.log(response);
    return response;
  }
        
}

export const api = new API();
