<template>
  <v-app>
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-signup-sitetitle">ChronoFade</v-card-title>
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください</v-card-subtitle>
        <v-btn text to="signup" color="light-blue">新規登録はこちら</v-btn>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
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
            <span v-else>LOGIN</span>
          </v-btn>

          <v-btn @click="clear" class="login-clear">CLEAR</v-btn>
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

      <div v-if="loading" class="loading-overlay"></div>
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
    loading: false,
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
      this.loading = true;

      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          const user = result.user;
          // console.log("success");
          // console.log("user", user);

          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const userData = doc.data();

                const auth = {
                  displayName: userData.username || user.displayName,
                  email: userData.email || user.email,
                  password: this.password,
                  uid: userData.uid || user.uid,
                  photoURL: userData.photoURL,
                };
                sessionStorage.setItem("user", JSON.stringify(auth));

                this.$router.push("task");
              } else {
                this.errorMessage = "ユーザー情報が見つかりませんでした。";
              }
            });
        })
        .catch((error) => {
          console.log("fail", error);
          this.errorMessage = "ログインに失敗しました。";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clear() {
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  z-index: 9999;
  pointer-events: all;
}

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
  /* width: 900px !important; */
  max-width: 900px !important;
  width: 100%;
}

.login-form {
  margin: 100px auto;
  padding: 30px;
  max-width: 500px;
}
@media screen and (max-width: 600px) {
  .login-box {
    padding: 20px;
  }

  .login-form {
    margin: 50px auto;
    padding: 20px;
    max-width: 90%;
  }
}

.login-title {
  display: inline-block;
}

.login-btn {
  width: 85px !important;
  margin-right: 20px;
}

.login-clear {
  width: 85px !important;
}

.success-message {
  margin-top: 20px;
}
</style>
