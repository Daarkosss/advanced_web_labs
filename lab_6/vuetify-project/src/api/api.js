const BASE_PATH = 'http://localhost:8080/api/v1';

class API {

    async fetch(method, path, body, headers = {}) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${BASE_PATH}${path}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errorMessage || 'Wrong server response!');
        } else {
            return data;
        }
    }

    async getBooks() {
        const response = await this.fetch(
            'GET',
            '/books'
        );
        return response;
    }

    async getBookById(id) {
        const response = await this.fetch(
            'GET',
            `/book/${id}`
        );
        return response;
    }
      
    async updateBook(id, bookData) {
        const response = await this.fetch(
            'PUT',
            `/book/${id}`,
            bookData
        );
        return response;
    }

    async deleteBook(id) {
        const response = await this.fetch(
            'DELETE',
            `/book/${id}`
        );
        return response;
    }

    async createBook(bookData) {
        const response = await this.fetch(
            'POST',
            '/book/create',
            bookData
        );
        return response;
    }

    async getAuthors(page, itemsPerPage, sortKey, order) {
        const response = await this.fetch(
            'GET',
            `/authors?page=${page}&size=${itemsPerPage}&sort=${sortKey},${order}`
        );
        return response;
    }

    async getAllAuthors() {
        const response = await this.fetch(
            'GET',
            `/authors`
        );
        return response;
    }

    async getAuthorById(id) {
        const response = await this.fetch(
            'GET',
            `/author/${id}`
        );
        return response;
    }

    async updateAuthor(id, authorData) {
        const response = await this.fetch(
            'PUT',
            `/author/${id}`,
            authorData
        );
        return response;
    }

    async deleteAuthor(id) {
        const response = await this.fetch(
            'DELETE',
            `/author/${id}`
        );
        return response;
    }

    async createAuthor(authorData) {
        const response = await this.fetch(
            'POST',
            '/author/create',
            authorData
        );
        return response;
    }
}

export const api = new API();
