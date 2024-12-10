<template>
  <v-app id="inspire">
    <v-app-bar app hide-on-scroll prominent>
      <v-toolbar-title class="siteTitle">ChronoFade</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="n in 24" :key="n" cols="4">
            <router-link :to="{ path: '/taskDetail', query: { task_id: n } }">
              <v-card height="200" class="pa-4 card-container">
                <v-card-title class="task-title"> タスクタイトル </v-card-title>
                <v-card-subtitle class="task-deadline">
                  期限: 2024/12/24
                </v-card-subtitle>
              </v-card>
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

/* タスクタイトル */
.task-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 24px;
  padding-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 最大3行まで表示 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* タスク期限 */
.task-deadline {
  color: grey;
  font-size: 18px;
  position: absolute;
  bottom: 8px;
  right: 16px;
}

/* カードコンテナ */
.card-container {
  position: relative;
  overflow: hidden;
}

/* 下線を消去 */
.v-application a {
  text-decoration: none !important;
}
.v-card-subtitle {
  text-decoration: none !important;
}
</style>
