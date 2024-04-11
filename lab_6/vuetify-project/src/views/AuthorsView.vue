<template>
  <v-data-table-server
    :headers="headers"
    :items="authors"
    :loading="loading"
    @update:options="loadItems"
    :items-per-page="pageSize"
    :items-length="totalAuthors"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Authors CRUD</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Add new autor
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
                      label="First name"
                      :error-messages="firstNameError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Last name"
                      :error-messages="lastNameError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.country"
                      label="Country"
                      :error-messages="countryError"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.birthDate"
                      label="Birth date"
                      type="date"
                      :error-messages="birthDateError"
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
        <v-dialog v-model="dialogDelete" max-width="520px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this author?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >Confirm</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template #item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table-server>
</template>

<script>
import { api } from "../api/api.js";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    currentOptions: {},
    firstNameError: "",
    lastNameError: "",
    countryError: "",
    birthDateError: "",
    headers: [
      { title: "ID", key: "id" },
      { title: "First name", key: "firstName" },
      { title: "Last name", key: "lastName" },
      { title: "Country", key: "country" },
      { title: "Birth date", key: "birthDate" },
      {
        title: "Edit or delete",
        value: "actions",
        sortable: false,
        align: "center",
      },
    ],
    authors: [],
    totalAuthors: 0,
    loading: false,
    page: 0,
    pageSize: 10,
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
      birthDate: "2024-04-06",
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
        const response = await api.getAuthors(this.page, this.pageSize, "", "");
        this.totalAuthors = response.totalElements;
        this.authors = response.content;

        console.log("Authors fetched", this.totalAuthors);
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

    async deleteItemConfirm() {
      try {
        await api.deleteAuthor(this.editedItem.id);
        console.log("Author deleted", this.editedItem);
      } catch (error) {
        console.error("Error deleting author", error);
        return;
      } finally {
        this.closeDelete();
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

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      const { id, ...authorWithoutId } = this.editedItem;
      this.firstNameError = this.editedItem.firstName
        ? ""
        : "First name is required";
      this.lastNameError = this.editedItem.lastName
        ? ""
        : "Last name is required";
      this.countryError = this.editedItem.country ? "" : "Country is required";
      this.birthDateError = this.editedItem.birthDate
        ? ""
        : "Date is required";
      if (
        !this.editedItem.firstName ||
        !this.editedItem.lastName ||
        !this.editedItem.birthDate ||
        !this.editedItem.country
      ) {
        return; // zakończ metodę, jeśli walidacja nie przeszła
      }

      if (this.editedIndex > -1) {
        console.log("Author edited", this.editedItem);
        await api.updateAuthor(id, authorWithoutId);
      } else {
        console.log("New author added", authorWithoutId);
        await api.createAuthor(authorWithoutId);
      }

      this.close();
      this.loadItems(this.currentOptions);
    },

    async loadItems({ page, itemsPerPage, sortBy }) {
      this.currentOptions = { page, itemsPerPage, sortBy };

      const sortKey = sortBy.length > 0 ? sortBy[0].key : "";
      const sortOrder = sortBy.length > 0 ? sortBy[0].order : "";
      console.log("Loading items", page, itemsPerPage, sortKey, sortOrder);

      this.loading = true;
      try {
        const response = await api.getAuthors(
          page - 1,
          itemsPerPage,
          sortKey,
          sortOrder
        );
        this.authors = response.content;
        this.totalAuthors = response.totalElements;
        console.log("Authors fetched", this.totalAuthors);
      } catch (error) {
        console.error("Error fetching authors:", error);
        this.authors = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
