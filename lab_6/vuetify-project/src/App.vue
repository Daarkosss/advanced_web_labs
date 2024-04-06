<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Moja aplikacja</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/persons">Znajomi</v-btn>
      <v-btn text to="/authors">Autorzy</v-btn>
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
  max-width: 680px;
}
</style>
