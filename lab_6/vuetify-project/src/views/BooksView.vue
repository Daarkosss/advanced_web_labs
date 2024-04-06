<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="books"
      :loading="loading"
      :total-items="totalBooks"
      :options.sync="options"
      @update:options="fetchBooks"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Books CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template #activator="{ on }">
              <v-btn color="primary" dark v-on="on">New Book</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.title" label="Book title"></v-text-field>
                    </v-col>
                      <v-col cols="12">
                        <v-select
                            v-model="editedItem.authorId"
                            :items="authors"
                            item-value="id"
                            :item-title="getAuthorFullName"
                            label="Author"
                        ></v-select>
                      </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.pages" label="Pages" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.releaseDate" label="Release Date" type="date"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.author="{ item }">
        {{ item.author.firstName }} {{ item.author.lastName }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { api } from '@/api/api' // Zaktualizuj ścieżkę do pliku API

export default {
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Title', value: 'title' },
        { text: 'Author', value: 'author' },
        { text: 'Pages', value: 'pages' },
        { text: 'Release Date', value: 'releaseDate' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      books: [],
      loading: false,
      totalBooks: 0,
      options: {},
      editedIndex: -1,
      editedItem: {
        id: '',
        title: '',
        authorId: null, // This will store the selected author's ID
        pages: '',
        releaseDate: '',
      },
      defaultItem: {
        id: '',
        title: '',
        authorFirstName: '',
        authorLastName: '',
        pages: '',
        releaseDate: '',
      },
      authors: [],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Book' : 'Edit Book';
    },
  },
  methods: {
    getAuthorFullName(author) {
      return `${author.firstName} ${author.lastName}`;
    },
    async fetchBooks() {
      this.loading = true;
      try {
        const response = await api.getBooks(); // Załóżmy, że ta metoda jest zaimplementowana w api.js
        this.books = response.content;
        this.totalBooks = response.totalElements;
      } catch (error) {
        console.error('Error fetching books:', error);
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
    editItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedItem = {
        id: item.id,
        title: item.title,
        authorId: item.author.id,
        pages: item.pages,
        releaseDate: item.releaseDate,
      };
      console.log(this.editedItem);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        await api.deleteBook(this.editedItem.id); // Załóżmy, że ta metoda jest zaimplementowana w api.js
        this.books.splice(this.editedIndex, 1);
      } catch (error) {
        console.error('Error deleting book:', error);
      } finally {
        this.loading = false;
        this.dialogDelete = false;
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      const bookPayload = {
        title: this.editedItem.title,
        authorId: this.editedItem.authorId,
        pages: parseInt(this.editedItem.pages),
        releaseDate: this.editedItem.releaseDate,
      };
      console.log(this.editedItem);
      console.log(bookPayload);

      this.loading = true;
      try {
        let savedBook;
        if (this.editedIndex > -1) {
          // Update the book
          savedBook = await api.updateBook(this.editedItem.id, bookPayload);
          Object.assign(this.books[this.editedIndex], savedBook);
        } else {
          // Create a new book
          savedBook = await api.createBook(bookPayload);
          this.books.push(savedBook);
        }
      } catch (error) {
        console.error('Error saving book:', error);
      } finally {
        this.loading = false;
        this.close();
      }
    },

    async fetchAuthors() {
      try {
        const response = await api.getAuthors(); // Replace with actual API call
        this.authors = response.content; // Assume the response is an array of authors
        console.log(this.authors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    },
  },

  created() {
    this.fetchBooks();
    this.fetchAuthors();
  },
};
</script>

<style scoped>
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
</style>
