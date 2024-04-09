<template>
  <v-data-table-server
    :headers="headers"
    :items="borrows"
    :loading="loading"
    @update:options="loadItems"
    :items-length="totalBorrows"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Borrows CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Dodaj nowe wypożyczenie
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" v-if="editedIndex === -1">
                    <v-select
                        v-model="editedItem.bookId"
                        :items="availableBooks"
                        item-value="bookId"
                        :item-title="bookId"
                        label="Book title"
                        :error-messages="bookError"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field 
                      v-model="editedItem.returnDate"
                      label="Data zwrócenia"
                      type="date"
                      :error-messages="returnDateError">
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
              >Czy na pewno chcesz usunąć to wypożyczenie?</v-card-title
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
      {{ item.book.author.firstName }} {{ item.book.author.lastName }}
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
      bookError: '',
      returnDateError: '',
      headers: [
        { title: 'ID', key: 'id', value: 'id' },
        { title: 'Title', key: 'book.title', value: 'book.title' },
        { title: 'Author', value: 'author' },
        { title: 'Borrow Date', key: 'borrowDate', value: 'borrowDate' },
        { title: 'Return Date', key: 'returnDate', value: 'returnDate' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      borrows: [],
      loading: false,
      totalBorrows: 0, 
      editedIndex: -1,
      editedItem: {
        id: '',
        bookId: null,
        returnDate: '',
      },
      defaultItem: {
        id: '',
        returnDate: '',
      },
      availableBooks: [],
    }),
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Dodawanie nowego wypożyczenia' : 'Edytowanie wypożyczenia';
      },
    },
  
    methods: {
      initialize() {
        this.fetchAvailableBooks();
      },

      async fetchAvailableBooks() {
        this.loading = true;
        try {
          const response = await api.getAvailableBooksForBorrow(0, 1000, "", "");
          this.availableBooks = response.content;
          this.totalavailableBooks = response.totalElements;
        } catch (error) {
          console.error('Error fetching availableBooks:', error);
          this.availableBooks = [];
        } finally {
          this.loading = false;
        }
      },
  
      editItem(item) {
        this.editedIndex = this.borrows.indexOf(item);
        this.editedItem = {
          id: item.id,
          bookId: item.book.id,
          returnDate: item.returnDate,
        };
        console.log(this.editedItem);
        this.dialog = true;
      },
  
      deleteItem(item) {
        this.editedIndex = this.borrows.indexOf(item);
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
          await api.deleteBorrow(this.editedItem.id);
          console.log('deleted');
        } catch (error) {
          console.error('Error deleting borrow:', error);
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
        const borrow = this.borrows.find(borrow => borrow.id === this.editedItem.id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const returnDate = new Date(this.editedItem.returnDate);
        returnDate.setHours(0, 0, 0, 0);

        console.log('start');
        if (this.editedIndex === -1) {
          this.bookError = this.editedItem.bookId ? "" : "Książka jest wymagana";
          
          this.returnDateError = this.editedItem.returnDate
            ? ""
            : "Data zwrócenia książki jest wymagana";
          this.returnDateError = returnDate < today
            ? "Data zwrócenia książki nie moze być z przeszłosci" 
            : this.returnDateError;
          console.log(this.returnDateError);
        } else {
          this.returnDateError = this.editedItem.returnDate
            ? ""
            : "Data zwrócenia książki jest wymagana";
          if (this.editedItem.returnDate <= borrow.returnDate) {
            this.returnDateError = "Data zwrócenia książki musi być pożniejsza niż aktualna data zwrócenia";
          }
          this.returnDateError = returnDate < today
            ? "Data zwrócenia książki nie moze byc z przeszłości" 
            : this.returnDateError;
        }
        console.log(this.bookError, this.returnDateError);
        if (this.bookError || this.returnDateError) {
          return;
        }

        let borrowPayload = null;
        if(this.editedIndex === -1) {
          borrowPayload = {
            bookId: this.editedItem.bookId,
            returnDate: this.editedItem.returnDate
          }
        } else {
          borrowPayload = {
            newReturnDate: this.editedItem.returnDate
          }
        }
  
        this.loading = true;
        try {
          if (this.editedIndex > -1) {
            await api.updateBorrow(this.editedItem.id, borrowPayload);
          } else {
            await api.createBorrow(borrowPayload);
          }
        } catch (error) {
          console.error('Error saving book:', error);
        } finally {
          this.loading = false;
          this.close();
          this.loadItems(this.currentOptions);
          this.fetchAvailableBooks();
        }
      },
  
      async loadItems({ page, itemsPerPage, sortBy }) {
        this.currentOptions = { page, itemsPerPage, sortBy };

        const sortKey = sortBy.length > 0 ? sortBy[0].key : "";
        const sortOrder = sortBy.length > 0 ? sortBy[0].order : "";
        console.log("Loading items", page, itemsPerPage, sortKey, sortOrder);
  
        this.loading = true;
        try {
          const response = await api.getBorrows(
            page - 1,
            itemsPerPage,
            sortKey,
            sortOrder
          );
          console.log(response);
          this.borrows = response.content;
          this.totalBorrows = response.totalElements;
          console.log("Total borrows", this.totalBorrows);
        } catch (error) {
          console.error("Error fetching borrows:", error);
          this.borrows = [];
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
  