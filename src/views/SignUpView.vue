<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-signup-sitetitle">ChronoFade</v-card-title>
        <v-card-title class="login-title">SignUp</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
        <v-btn text to="/" color="light-blue">ログインはこちら</v-btn>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="UserName"
            required
            @keyup.enter="submit"
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            @keyup.enter="submit"
          ></v-text-field>

          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            required
            @keyup.enter="submit"
          ></v-text-field>

          <v-btn
            color="success"
            class="login-btn"
            @click="submit"
            :disabled="isValid"
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="white"
              size="24"
              class="login-progress"
            ></v-progress-circular>
            <span v-else>SIGN UP</span>
          </v-btn>

          <v-btn @click="clear" class="login-clear">CLEAR</v-btn>
          <v-alert
            dense
            outlined
            type="error"
            class="error-message"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card>

      <div v-if="loading" class="loading-overlay"></div>
    </div>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "ユーザー名を入力してください",
      (v) => (v && v.length <= 10) || "10文字以下に設定してください",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+\..+/.test(v) || "不正なメールアドレスです",
    ],
    password: "",
    errorMessage: "",
    loading: false,
  }),
  computed: {
    isValid() {
      return !this.valid;
    },
  },
  methods: {
    submit() {
      this.loading = true;

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(async (result) => {
          // console.log("success", result);
          await result.user.updateProfile({ displayName: this.name });
          // console.log("updateProfile", result.user);

          if (result.user) {
            const uid = result.user.uid;
            const userInitialData = {
              uid: uid,
              username: this.name,
              email: this.email,
              featureEnabled: true,
            };

            firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .set(userInitialData);
          }

          localStorage.message = "ユーザーの新規登録に成功しました。";
          this.$router.push("/");
        })
        .catch((error) => {
          console.log("error", error);
          this.errorMessage = "ユーザーの新規登録に失敗しました。";
        })
        .finally(() => {
          this.loading = false;
        });
    },

    clear() {
      this.name = "";
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style>
.error-message {
  margin-top: 20px;
}
</style>
