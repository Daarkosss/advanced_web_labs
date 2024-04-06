<template>
  <v-container class="small-container">
    <v-row>
      <v-col cols="12">
        <h1>Znajomi</h1>
        <person-form @add:person="addPerson" />
        <persons-table :personsSource="persons" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PersonForm from '../components/PersonForm.vue';
import PersonsTable from '../components/PersonsTable.vue';

export default {
  components: {
    PersonsTable,
    PersonForm,
  },
  data() {
    return {
      persons: [
      ],
    };
  },
  methods: {
    addPerson(person) {
      this.persons = [...this.persons, person];
    },
    async getPersons() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        this.persons = data;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.getPersons();
  },
};
</script>

<style scoped>
.small-container {
  max-width: 680px;
}
</style>
