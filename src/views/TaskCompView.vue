<template>
  <v-app id="inspire">
    <Sidebar />
    <v-app-bar app hide-on-scroll prominent>
      <v-toolbar-title class="siteTitle">ChronoFade</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container>
        <BarGraph />

        <v-row>
          <v-col v-for="(data, index) in tasks" :key="index" cols="4">
            <router-link
              :to="{ path: '/taskDetail', query: { task_id: data.task_id } }"
            >
              <v-card height="200" class="pa-4 card-container">
                <v-card-title class="task-view-title">
                  {{ data.title }}
                </v-card-title>
                <v-card-subtitle class="task-view-deadline">
                  {{ data.selectDate }} {{ data.selectTime }}
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
import Sidebar from "@/components/layouts/Sidebar.vue";
import BarGraph from "@/components/layouts/BarGraph.vue";
import firebase from "@/firebase/firebase";

export default {
  components: {
    Sidebar,
    BarGraph,
  },
  async created() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const uid = user.uid;

    if (!uid) {
      console.error("uid is not found");
      return;
    }

    const taskRef = firebase
      .firestore()
      .collection("task")
      .where("uid", "==", uid)
      .orderBy("selectDate", "asc")
      .orderBy("selectTime", "asc");
    const snapshot = await taskRef.get();

    snapshot.forEach((doc) => {
      console.log(doc.data());
      this.tasks.push(doc.data());
    });
  },
  data: () => ({
    // task_id, title, content, selectDate, selectTime, uidの6項目
    tasks: [],
  }),
};
</script>
