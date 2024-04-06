<template>
  <v-card>
    <v-card-title>
      Wyszukaj autora
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="searchAuthorById">
        <v-text-field v-model="searchId" label="ID autora"></v-text-field>
        <v-btn color="primary" type="submit">Szukaj</v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-alert v-if="author" type="info">
        Znaleziono autora: {{ author.firstName }} {{ author.lastName }}
      </v-alert>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      searchId: '',
      author: null,
    };
  },
  methods: {
    async searchAuthorById() {
      if (!this.searchId) return;
      try {
        const response = await fetch(`http://localhost:8080/api/v1/author/${this.searchId}`);
        if (response.ok) {
          this.author = await response.json();
        } else {
          this.author = null;
          // Obsłuż brak autora / błąd
        }
      } catch (error) {
        console.error(error);
        // Obsłuż błąd sieci
      }
    },
  },
};
</script>
