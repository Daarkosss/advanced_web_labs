<template>
  <v-data-table
    :headers="headers"
    :items="personsSource"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-truncate" style="max-width: 200px;">{{ item.name }}</td>
        <td class="text-truncate" style="max-width: 200px;">{{ item.email }}</td>
        <td class="text-truncate" style="max-width: 200px;">{{ item.phone }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "PersonsTable",
  props: {
    personsSource: Array,
  },
  data() {
    return {
      headers: [
        { text: 'Imię i nazwisko', value: 'name', sortable: false, align: 'start' },
        { text: 'Email', value: 'email', sortable: false, align: 'start' },
        { text: 'Telefon', value: 'phone', sortable: false, align: 'start' },
      ],
    };
  },
};
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
