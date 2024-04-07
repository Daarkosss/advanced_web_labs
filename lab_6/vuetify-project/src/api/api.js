import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();
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

        if (response.ok) {
            if (data.message) {
                $toast.success(data.message);
            }
            return data;
        } else {
            $toast.warning(data.errorMessage);
        }
    }

    async getBooks(page, itemsPerPage, sortKey, order) {
        const response = await this.fetch(
            'GET',
            `/books?page=${page}&size=${itemsPerPage}&sort=${sortKey},${order}`
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

    async getBorrows(page, itemsPerPage, sortKey, order) {
        const response = await this.fetch(
            'GET',
            `/borrows?page=${page}&size=${itemsPerPage}&sort=${sortKey},${order}`
        );
        return response;
    }

    async getBorrowById(id) {
        const response = await this.fetch(
            'GET',
            `/borrow/${id}`
        );
        return response;
    }

    async createBorrow(borrowData) {
        const response = await this.fetch(
            'POST',
            '/borrow/borrow-book',
            borrowData
        );
        return response;
    }

    async updateBorrow(id, borrowData) {
        const response = await this.fetch(
            'PATCH',
            `/borrow/${id}`,
            borrowData
        );
        return response;
    }

    async deleteBorrow(id) {
        const response = await this.fetch(
            'DELETE',
            `/borrow/${id}`
        );
        return response;
    }

    async getAvailableBooksForBorrow(page, itemsPerPage, sortKey, order) {
        const response = await this.fetch(
            'GET',
            `/borrow/search?page=${page}&size=${itemsPerPage}&sort=${sortKey},${order}`
        );
        return response;
    }
}

export const api = new API();
