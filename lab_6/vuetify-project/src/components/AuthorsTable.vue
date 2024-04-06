<template>
  <v-data-table
    :headers="headers"
    :items="authors"
    :items-per-page="itemsPerPage"
    :server-items-length="totalAuthors"
    :loading="loading"
    @update:page="handlePageUpdate"
    @update:items-per-page="handleItemsPerPageUpdate"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  name: "AuthorsTable",
  props: {
    authors: Array,
    totalAuthors: Number,
    itemsPerPage: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Imię', value: 'firstName' },
        { text: 'Nazwisko', value: 'lastName' },
        { text: 'Kraj', value: 'country' },
        { text: 'Data urodzenia', value: 'birthDate' },
      ],
      currentPage: 1,
    };
  },
  methods: {
    handlePageUpdate(newPage) {
      this.currentPage = newPage;
      this.$emit('update-pagination', newPage, this.itemsPerPage);
    },
    handleItemsPerPageUpdate(newItemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.$emit('update-pagination', this.currentPage, newItemsPerPage);
    },
  },
};
</script>
