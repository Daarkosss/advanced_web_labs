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
        { text: 'Imię', key: 'firstName' },
        { text: 'Nazwisko', key: 'lastName' },
        { text: 'Kraj', key: 'country' },
        { text: 'Data urodzenia', key: 'birthDate' },
      ],
      currentPage: 1,
    };
  },
  methods: {
    handlePageUpdate(newPage) {
      this.$emit('update-pagination', newPage, this.itemsPerPage);
    },
    handleItemsPerPageUpdate(newItemsPerPage) {
      this.$emit('update-items-per-page', newItemsPerPage);
    },
  },
};
</script>
