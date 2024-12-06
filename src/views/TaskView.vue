<template>
  <v-app id="inspire">
    <v-app-bar app hide-on-scroll prominent>
      <v-toolbar-title class="siteTitle">ChronoFade</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="n in 24" :key="n" cols="12">
            <router-link :to="{ path: '/taskDetail', query: { task_id: n } }">
              <v-card height="200"></v-card>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  //
};
</script>

<style>
.siteTitle {
  font-family: "Caveat", cursive;
  font-weight: 500;
  font-style: normal;
  font-size: 80px !important;
  width: 100%;
}
</style>
