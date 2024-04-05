<template>
  <div id="person-form">
    <form @submit.prevent="handleSubmit">
      <label>Imię i nazwisko</label>
      <input
        v-model="person.name"
        type="text"
        :class="{ 'has-error': submitting && invalidName }"
        @keypress="clearStatus"
        @focus="clearStatus"
      />
      <label>Email</label>
      <input
        v-model="person.email"
        type="text"
        :class="{ 'has-error': submitting && invalidEmail }"
        @keypress="clearStatus"
        @focus="clearStatus"
      />
      <label>Telefon</label>
      <input
        v-model="person.phone"
        type="text"
        :class="{ 'has-error': submitting && invalidPhone }"
        @keypress="clearStatus"
        @focus="clearStatus"
      />
      <button>Dodaj kontakt</button>
      <p v-if="error && submitting" class="error-message">
        Proszę wypełnić wskazane pola formularza
      </p>
      <p v-else-if="success" class="success-message">Dane poprawnie zapisano</p>
      <p v-else ><br></p>
    </form>
  </div>
</template>

<script>
export default {
  name: "person-form",
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
  methods: {
    handleSubmit() {
      this.clearStatus();
      this.submitting = true;
      //check form fields
      if (this.invalidName || this.invalidEmail || this.invalidPhone) {
        this.error = true;
        return;
      }
      this.$emit("add:person", this.person);
      //clear form fields
      this.person = {
        name: "",
        email: "",
        phone: "",
      };
      this.error = false;
      this.success = true;
      this.submitting = false;
    },
    clearStatus() {
      this.success = false;
      this.error = false;
    },
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
};
</script>

<style scoped>
form {
  margin-bottom: 2rem;
}
[class*="-message"] {
  font-weight: 500;
}
.error-message {
  color: #d33c40;
}
.success-message {
  color: #32a95d;
}
</style>
