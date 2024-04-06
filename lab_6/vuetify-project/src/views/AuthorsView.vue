<template>
  <v-container class="small-container">
    <v-row>
      <v-col cols="12">
        <h1>Autorzy</h1>
        <author-form @author-added="fetchAuthors(currentPage, itemsPerPage)" />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <author-search @search-completed="handleSearchCompleted" />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <!-- Teraz przekazujemy currentPage i itemsPerPage do AuthorsTable oraz obsługujemy zdarzenie update-pagination -->
        <authors-table :authors="authors" :total-authors="totalAuthors" :items-per-page="itemsPerPage" @update-pagination="updatePagination" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthorForm from '../components/AuthorForm.vue';
import AuthorSearch from '../components/AuthorSearch.vue';
import AuthorsTable from '../components/AuthorsTable.vue';

export default {
  components: {
    AuthorForm,
    AuthorSearch,
    AuthorsTable,
  },
  data() {
    return {
      authors: [],
      totalAuthors: 0,
      currentPage: 1,
      itemsPerPage: 5, // Możesz ustawić domyślną ilość elementów na stronie
    };
  },
  methods: {
    async fetchAuthors(page = this.currentPage, itemsPerPage = this.itemsPerPage) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/authors?page=${page - 1}&size=${itemsPerPage}`);
        if (response.ok) {
          const data = await response.json();
          this.authors = data.content;
          this.totalAuthors = data.totalElements;
        } else {
          console.error('Problem fetching authors');
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleSearchCompleted(author) {
      this.authors = [author];
    },
    updatePagination(page, itemsPerPage) {
      this.currentPage = page;
      this.itemsPerPage = itemsPerPage;
      this.fetchAuthors(page, itemsPerPage);
    },
  },
  mounted() {
    this.fetchAuthors(); // Pobiera autorów przy inicjalizacji widoku z domyślnymi parametrami paginacji
  },
};
</script>

<style scoped>
.small-container {
  max-width: 680px;
}
</style>
