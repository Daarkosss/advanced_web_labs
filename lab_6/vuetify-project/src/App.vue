<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Books App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/authors">Authors</v-btn>
      <v-btn text to="/books">Books</v-btn>
      <v-btn text to="/borrows">Borrows</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="small-container">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
.small-container {
  max-width: 100%;
}
</style>
