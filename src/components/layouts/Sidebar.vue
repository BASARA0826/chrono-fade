<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-sheet color="grey lighten-4" class="pa-4">
      <v-avatar size="80">
        <v-icon size="80" v-if="!photoUrl"> mdi-account-circle </v-icon>
        <img :src="photoUrl" v-if="photoUrl" />
      </v-avatar>

      <div class="username">{{ auth && auth.displayName }}</div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="[icon, text, to] in links" :key="icon" :to="to" link>
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="sidebar-title">{{
            text
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-icon>
          <v-icon> mdi-logout </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="sidebar-title"
            >ログアウト</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  mounted() {
    this.updateAuth();
    window.addEventListener("storage", this.updateAuth);
  },
  beforeDestroy() {
    window.removeEventListener("storage", this.updateAuth);
  },
  data: () => ({
    drawer: null,
    links: [
      ["mdi-home", "タスク一覧", "/task"],
      ["mdi-list-box-outline", "完了タスク一覧", "/taskComp"],
      ["mdi-pencil-outline", "タスク作成", "/create"],
      ["mdi-account-edit-outline", "アカウント設定", "/config"],
    ],
    auth: null,
    photoUrl: "",
  }),
  methods: {
    updateAuth() {
      this.auth = JSON.parse(sessionStorage.getItem("user"));
      this.photoUrl = this.auth.photoURL;
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.message = "ログアウトしました。";
          this.$router.push("/");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    color: #2c3e50;
  }
}

.grey.darken-1 {
  background-color: #757575 !important;
  border-color: #757575 !important;
}

.pa-4 {
  padding: 16px !important;
}

.username {
  padding-top: 10px;
}

.sidebar-title {
  font-weight: bold;
  font-size: 15px;
}
</style>
