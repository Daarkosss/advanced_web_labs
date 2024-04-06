<template>
  <v-data-table
    :headers="headers"
    :items="authors"
    :items-per-page-options="[3, 5, 20, 50, -1]"
    :items-per-page="3"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Autorzy CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Nowy autor
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
                      v-model="editedItem.firstName"
                      label="Imie"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Nazwisko"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.country"
                      label="Kraj"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.birthDate"
                      label="Data urodzenia"
                      type="date"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close"
                >Cancel</v-btn
              >
              <v-btn color="blue-darken-1" variant="text" @click="save"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Czy na pewno chcesz usunąć tego autora?</v-card-title
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
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { api } from "../api/api.js";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: "Imie", key: "firstName", align: "center" },
      { title: "Nazwisko", key: "lastName", align: "center" },
      { title: "Kraj", key: "country", align: "center" },
      { title: "Data urodzenia", key: "birthDate", align: "center" },
      {
        title: "Edytuj lub usuń",
        value: "actions",
        sortable: false,
        align: "center",
      },
    ],
    authors: [],
    totalAuthors: 0,
    editedIndex: -1,
    editedItem: {
      id: "",
      firstName: "",
      lastName: "",
      country: "",
      birthDate: "",
    },
    defaultItem: {
      id: "",
      firstName: "",
      lastName: "",
      country: "",
      birthDate: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      try {
        const response = await api.getAuthors();
        this.authors = response.content;
        this.totalAuthors = response.totalElements;
      } catch (error) {
        console.error("Error fetching authors:", error);
        this.authors = [];
      } finally {
        this.loading = false;
      }
    },

    editItem(item) {
      this.editedIndex = this.authors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.authors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.authors.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      const { id, ...authorWithoutId } = this.editedItem;

      if (this.editedIndex > -1) {
        Object.assign(this.authors[this.editedIndex], this.editedItem);
        console.log("Author edited", this.editedItem);
        await api.updateAuthor(id, authorWithoutId);
      } else {
        this.authors.push(this.editedItem);
        console.log("New author added", authorWithoutId);
        await api.createAuthor(authorWithoutId);
      }

      this.close();
    },
  },
};
</script>
