<template>
  <v-data-table-server
    :headers="headers"
    :items="books"
    :loading="loading"
    @update:options="loadItems"
    :items-length="totalBooks"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Books CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Dodaj nową książkę
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field 
                      v-model="editedItem.title"
                      label="Book title"
                      :error-messages="titleError">
                    </v-text-field>
                  </v-col>
                    <v-col cols="12">
                      <v-select
                          v-model="editedItem.authorId"
                          :items="authors"
                          item-value="id"
                          :item-title="getAuthorFullName"
                          label="Author"
                          :error-messages="authorError"
                      ></v-select>
                    </v-col>
                  <v-col cols="12">
                    <v-text-field 
                      v-model="editedItem.pages"
                      label="Pages" 
                      type="number"
                      :error-messages="pagesError">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.releaseDate"
                      label="Release Date"
                      type="date"
                      :error-messages="releaseDateError">
                    </v-text-field>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Czy na pewno chcesz usunąć tę książkę?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Anuluj</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >Potwierdź</v-btn
              >
              <v-spacer></v-spacer>
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
  </v-data-table-server>
</template>

<script>
import { api } from '../api/api'

// Compare lastName at first, then firstName
function compareAuthors(a, b) {
  if (a.lastName < b.lastName) return -1;
  if (a.lastName > b.lastName) return 1;
  if (a.firstName < b.firstName) return -1;
  if (a.firstName > b.firstName) return 1;
  return 0;
}

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    currentOptions: {},
    titleError: "",
    authorError: "",
    pagesError: "",
    releaseDateError: "",
    headers: [
      { title: 'ID', key: 'id', value: 'id' },
      { title: 'Title', key: 'title', value: 'title' },
      { title: 'Author', key: 'author', value: 'author', sort: (a, b) => compareAuthors(a, b) },
      { title: 'Pages', key: 'pages', value: 'pages' },
      { title: 'Release Date', key: 'releaseDate', value: 'releaseDate' },
      { title: 'Actions', value: 'actions', sortable: false },
    ],
    books: [],
    loading: false,
    totalBooks: 0, 
    editedIndex: -1,
    editedItem: {
      id: '',
      title: '',
      authorId: null,
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
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Dodawanie nowej książki' : 'Edytowanie książki';
    },
  },

  methods: {
    initialize() {
      this.fetchAuthors();
    },

    getAuthorFullName(author) {
      return `${author.firstName} ${author.lastName}`;
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
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.books.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async deleteItemConfirm() {
      this.loading = true;
      try {
        await api.deleteBook(this.editedItem.id);
      } catch (error) {
        console.error('Error deleting book:', error);
      } finally {
        this.loading = false;
        this.dialogDelete = false;
        this.loadItems(this.currentOptions);
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
      this.titleError = this.editedItem.title
        ? ""
        : "Tytuł jest wymagany";

      this.authorError = this.editedItem.authorId
        ? ""
        : "Autor jest wymagany";

      this.pagesError = this.editedItem.pages
        ? ""
        : "Liczba stron jest wymagana";
      if (this.editedItem.pages <= 0) 
        this.pagesError = "Liczba stron musi być większa od 0";

      this.releaseDateError = this.editedItem.releaseDate
        ? ""
        : "Data jest wymagana";

      if (
        !this.editedItem.title ||
        !this.editedItem.authorId ||
        !this.editedItem.pages || this.editedItem.pages <= 0 ||
        !this.editedItem.releaseDate
      ) {
        return;
      }
    
      const bookPayload = {
        title: this.editedItem.title,
        authorId: this.editedItem.authorId,
        pages: parseInt(this.editedItem.pages),
        releaseDate: this.editedItem.releaseDate,
      };

      this.loading = true;
      try {
        if (this.editedIndex > -1) {
          await api.updateBook(this.editedItem.id, bookPayload);
        } else {
          await api.createBook(bookPayload);
        }
      } catch (error) {
        console.error('Error saving book:', error);
      } finally {
        this.loading = false;
        this.close();
        this.loadItems(this.currentOptions);
      }
    },

    async fetchAuthors() {
      try {
        const response = await api.getAuthors(0, 10000, "", "");
        this.authors = response.content;
        console.log(this.authors);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    },

    async loadItems({ page, itemsPerPage, sortBy }) {
      this.currentOptions = { page, itemsPerPage, sortBy };

      const sortKey = sortBy.length > 0 ? sortBy[0].key : "";
      const sortOrder = sortBy.length > 0 ? sortBy[0].order : "";
      console.log("Loading items", page, itemsPerPage, sortKey, sortOrder);

      this.loading = true;
      try {
        const response = await api.getBooks(
          page - 1,
          itemsPerPage,
          sortKey,
          sortOrder
        );
        this.books = response.content;
        this.totalBooks = response.totalElements;
        console.log("Total books", this.totalBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    this.initialize();
  },
};
</script>
