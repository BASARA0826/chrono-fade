<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-signup-sitetitle">ChronoFade</v-card-title>
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
        <v-btn text to="signup" color="light-blue">新規登録はこちら</v-btn>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            required
          ></v-text-field>

          <v-btn
            color="success"
            class="login-btn"
            @click="submit"
            :disabled="isValid"
            >LOGIN</v-btn
          >

          <v-btn>CLEAR</v-btn>
          <v-alert
            dense
            text
            type="success"
            class="success-message"
            v-if="message"
          >
            {{ message }}
          </v-alert>

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
    </div>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+\..+/.test(v) || "不正なメールアドレスです",
    ],
    password: "",
    message: "",
    errorMessage: "",
  }),
  mounted() {
    if (localStorage.message) {
      this.message = localStorage.message;
      localStorage.message = "";
    }
  },
  computed: {
    isValid() {
      return !this.valid;
    },
  },
  methods: {
    submit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          console.log("success");
          console.log("user", result.user);
          this.$router.push("task");
        })
        .catch((error) => {
          console.log("fail", error);
          this.errorMessage = "ログインに失敗しました。";
        });
    },
  },
};
</script>

<style>
.login-signup-sitetitle {
  display: inline-block;
  font-family: "Caveat", cursive;
  font-weight: 500;
  font-style: normal;
  font-size: 60px !important;
  width: 100%;
  text-align: center;
}

.login-box {
  margin: 0 auto;
  padding: 30px;
  width: 50%;
}

.login-form {
  margin: 150px;
  padding: 30px;
}

.login-title {
  display: inline-block;
}

.login-btn {
  margin-right: 20px;
}

.success-message {
  margin-top: 20px;
}
</style>
