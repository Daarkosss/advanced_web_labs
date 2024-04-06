<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-text-field v-model="author.firstName" label="Imię" @input="clearStatus"></v-text-field>
    <v-text-field v-model="author.lastName" label="Nazwisko" @input="clearStatus"></v-text-field>
    <v-text-field v-model="author.country" label="Kraj" @input="clearStatus"></v-text-field>
    <v-text-field v-model="author.birthDate" label="Data urodzenia" @input="clearStatus"></v-text-field>

    <v-btn color="primary" type="submit">Dodaj autora</v-btn>

    <v-alert v-if="error && submitting" type="error" dismissible>
      Proszę wypełnić wszystkie pola formularza
    </v-alert>
    <v-alert v-else-if="success" type="success" dismissible>
      Autor został pomyślnie dodany
    </v-alert>
    <v-alert v-else type="info">
      Wypełnij formularz, aby dodać nowego autora
    </v-alert>
  </v-form>
</template>

<script>
export default {
  name: "AuthorForm",
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      author: {
        firstName: "",
        lastName: "",
        country: "",
        birthDate: "",
      },
    };
  },
  computed: {
    invalidFirstName() {
      return this.author.firstName === "";
    },
    invalidLastName() {
      return this.author.lastName === "";
    },
    invalidCountry() {
      return this.author.country === "";
    },
    invalidBirthDate() {
      return this.author.birthDate === "";
    },
  },
  methods: {
    async handleSubmit() {
      this.clearStatus();
      this.submitting = true;
      if (this.invalidFirstName || this.invalidLastName || this.invalidCountry || this.invalidBirthDate) {
        this.error = true;
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/v1/author/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.author),
        });
        if (response.ok) {
          this.success = true;
          this.$emit('author-added', await response.json());
        } else {
          this.error = true;
        }
      } catch (error) {
        console.error(error);
        this.error = true;
      } finally {
        this.submitting = false;
      }
    },
    clearStatus() {
      this.error = false;
      this.success = false;
    },
    resetForm() {
      this.author = { firstName: "", lastName: "", country: "", birthDate: "" };
    },
  },
};
</script>
