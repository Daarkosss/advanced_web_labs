<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="person.name"
      label="Imię i nazwisko"
      @input="clearStatus"
    ></v-text-field>

    <v-text-field
      v-model="person.email"
      label="Email"
      @input="clearStatus"
    ></v-text-field>

    <v-text-field
      v-model="person.phone"
      label="Telefon"
      @input="clearStatus"
    ></v-text-field>

    <v-btn color="primary" type="submit">Dodaj kontakt</v-btn>

    <v-alert v-if="error && submitting" type="error" dismissible>
      Proszę wypełnić wskazane pola formularza
    </v-alert>
    <v-alert v-else-if="success" type="success" dismissible>
      Dane poprawnie zapisano
    </v-alert>
    <v-alert v-else type="info">
      Wypełnij formularz, aby dodać nowy kontakt
    </v-alert>
  </v-form>
</template>

<script>
export default {
  name: "PersonForm",
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      person: {
        name: "",
        email: "",
        phone: "",
      },
    };
  },
  computed: {
    invalidName() {
      return this.person.name === "";
    },
    invalidEmail() {
      return this.person.email === "";
    },
    invalidPhone() {
      return this.person.phone === "";
    },
  },
  methods: {
    handleSubmit() {
      this.clearStatus();
      this.submitting = true;
      if (this.invalidName || this.invalidEmail || this.invalidPhone) {
        this.error = true;
        return;
      }
      this.$emit("add:person", this.person);
      this.resetForm();
    },
    clearStatus() {
      this.success = false;
      this.error = false;
    },
    resetForm() {
      this.person = { name: "", email: "", phone: "" };
      this.error = false;
      this.success = true;
      this.submitting = false;
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
.v-alert {
  margin-top: 10px;
}
</style>