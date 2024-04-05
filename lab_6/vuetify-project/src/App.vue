<template>
  <v-app>
    <v-main>
      <v-container class="small-container">
        <v-row>
          <v-col cols="12">
            <h1>Znajomi</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <person-form @add:person="addPerson" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <persons-table :personsSource="persons" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import PersonForm from './components/PersonForm.vue';
import PersonsTable from './components/PersonsTable.vue';

export default {
  name: 'App',
  components: {
    PersonsTable,
    PersonForm,
  },
  data() {
    return {
      persons: [
        {
          id: 1,
          name: 'Adam Słodowy',
          email: 'adam.slodowy@zrobtosam.pl',
          phone: '+48 787 774 664',
        },
        {
          id: 2,
          name: 'Michał Studencki',
          email: 'ms@student.pwr.edu.pl',
          phone: '+48 600 565 454',
        },
        {
          id: 3,
          name: 'Kamila Napokaz',
          email: 'kami2003@h2.pl',
          phone: '+48 609 554 987',
        },
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

/* Możesz dostosować style Vuetify używając klas Vuetify lub dodając własne style */
</style>
