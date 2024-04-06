<template>
  <v-data-table
    :headers="headers"
    :items="authors"
    :items-per-page="itemsPerPage"
    :server-items-length="totalAuthors"
    :loading="loading"
    @update:page="fetchAuthors"
    @update:items-per-page="fetchAuthors"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  name: "AuthorsTable",
  props: {
    itemsPerPage: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      loading: false,
      authors: [],
      totalAuthors: 0,
      headers: [
        { text: 'Imię', value: 'firstName' },
        { text: 'Nazwisko', value: 'lastName' },
        { text: 'Kraj', value: 'country' },
        { text: 'Data urodzenia', value: 'birthDate' },
      ],
    };
  },
  methods: {
    async fetchAuthors(page = 1, itemsPerPage = this.itemsPerPage) {
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:8080/api/v1/authors?page=${page - 1}&size=${itemsPerPage}`);
        if (response.ok) {
          const data = await response.json();
          this.authors = data.content;
          this.totalAuthors = data.totalElements;
        } else {
          // Obsłuż błąd odpowiedzi
        }
      } catch (error) {
        console.error(error);
        // Obsłuż błąd sieci
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchAuthors();
  },
};
</script>
