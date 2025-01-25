<template>
  <v-app id="config-view">
    <v-app-bar app color="primary" dark>
      <!-- 戻るボタン -->
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>アカウント設定</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="pa-4" outlined>
          <!-- アカウント画像の変更 -->
          <v-card-title>アカウント画像</v-card-title>
          <v-card-text class="text-center">
            <v-avatar size="256">
              <v-icon size="256"> mdi-account-circle </v-icon>
            </v-avatar>
          </v-card-text>
          <v-card-actions class="justify-center mb-4">
            <v-btn color="primary" @click="changeAccountImage">
              画像を変更
            </v-btn>
          </v-card-actions>

          <!-- ユーザー名の編集 -->
          <v-divider></v-divider>
          <v-card-title>ユーザー名</v-card-title>
          <v-card-text>
            <v-text-field
              label="ユーザー名"
              v-model="username"
              :rules="nameRules"
              outlined
            ></v-text-field>
          </v-card-text>

          <!-- Emailの編集 -->
          <v-divider></v-divider>
          <v-card-title>E-mail</v-card-title>
          <v-card-text>
            <v-text-field
              label="E-mail"
              v-model="email"
              :rules="emailRules"
              outlined
            ></v-text-field>
          </v-card-text>

          <!-- パスワードの編集 -->
          <v-divider></v-divider>
          <v-card-title>パスワード</v-card-title>
          <v-card-text>
            <v-text-field
              label="現在のパスワード"
              v-model="nowPassword"
              outlined
              :type="showPasswordNow ? 'text' : 'password'"
              :append-icon="showPasswordNow ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordNow"
            ></v-text-field>
            <v-text-field
              label="新しいパスワード"
              v-model="password"
              type="password"
              outlined
            ></v-text-field>
            <v-text-field
              label="新しいパスワード（確認用）"
              v-model="confirmPassword"
              outlined
              :type="showPasswordNew ? 'text' : 'password'"
              :append-icon="showPasswordNew ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordNew"
            ></v-text-field>
          </v-card-text>

          <!-- スライドボタン -->
          <v-divider></v-divider>
          <v-card-title>「記録」のキオク</v-card-title>
          <v-card-text class="switch-container">
            <v-switch v-model="featureEnabled" inset></v-switch>
            <v-card-text>
              完了したタスクを完了時点の状態で表示します。無効にするとタスク作成時の内容を表示します
            </v-card-text>
          </v-card-text>

          <!-- ボタン -->
          <v-divider></v-divider>
          <v-card-actions class="align-center">
            <v-btn
              color="success"
              type="submit"
              :disabled="isValid"
              @click="saveChanges"
              >変更保存</v-btn
            >
            <v-btn color="error" :disabled="inValid" @click="discardChanges"
              >変更破棄</v-btn
            >
            <transition name="fade">
              <v-alert
                dense
                text
                type="success"
                class="ml-4 success-message config-alert"
                v-if="message"
              >
                {{ message }}
              </v-alert>

              <v-alert
                dense
                outlined
                type="error"
                class="ml-4 error-message config-alert"
                v-if="errorMessage"
              >
                {{ errorMessage }}
              </v-alert>
            </transition>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from "@/firebase/firebase";

export default {
  created() {
    const uid = firebase.auth().currentUser.uid;

    // Firestoreからユーザーデータを取得
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          this.username = userData.username;
          this.email = userData.email;
          this.featureEnabled = userData.featureEnabled;

          this.initialUsername = userData.username;
          this.initialEmail = userData.email;
          this.initialFeatureEnabled = userData.featureEnabled;
        } else {
          console.log("ユーザーデータが見つかりません");
        }
      })
      .catch((error) => {
        console.error("ユーザーデータの取得に失敗", error);
      });
  },
  data: () => ({
    username: "",
    email: "",
    nowPassword: "",
    password: "",
    confirmPassword: "",
    showPasswordNow: false,
    showPasswordNew: false,
    featureEnabled: true,
    initialUsername: "",
    initialEmail: "",
    initialFeatureEnabled: true,
    nameRules: [
      (v) => !!v || "ユーザー名を入力してください",
      (v) => (v && v.length <= 10) || "10文字以下に設定してください",
    ],
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+\..+/.test(v) || "不正なメールアドレスです",
    ],
    message: "",
    errorMessage: "",
  }),
  computed: {
    isValid() {
      const isNameValid = this.nameRules.every(
        (rule) => rule(this.username) === true
      );
      const isEmailValid = this.emailRules.every(
        (rule) => rule(this.email) === true
      );
      return !isNameValid || !isEmailValid;
    },
    inValid() {
      if (
        this.username !== this.initialUsername ||
        this.email !== this.initialEmail ||
        this.nowPassword !== "" ||
        this.password !== "" ||
        this.confirmPassword !== "" ||
        this.featureEnabled !== this.initialFeatureEnabled
      ) {
        return false;
      }
      return true;
    },
  },
  methods: {
    togglePasswordNow() {
      this.showPasswordNow = !this.showPasswordNow;
    },
    togglePasswordNew() {
      this.showPasswordNew = !this.showPasswordNew;
    },
    changeAccountImage() {
      alert("アカウント画像を変更します！");
    },
    async saveChanges() {
      const user = firebase.auth().currentUser;
      const uid = user.uid;
      const auth = JSON.parse(sessionStorage.getItem("user"));

      if (this.password) {
        if (this.password !== this.confirmPassword) {
          this.errorMessage =
            "新しいパスワードと確認用パスワードが一致しません";
          this.discardChanges();
          this.clearMessage();
          return;
        }
        if (this.nowPassword !== auth.password) {
          this.errorMessage = "現在のパスワードが違います";
          this.discardChanges();
          this.clearMessage();
          return;
        }
      }

      try {
        // Firebase Authenticationのユーザーデータを更新
        if (user.email !== this.email) {
          await user.updateEmail(this.email);
        }
        if (this.password) {
          await user.updatePassword(this.password);
        }

        // Firestoreのユーザーデータを更新
        await firebase.firestore().collection("users").doc(uid).update({
          username: this.username,
          email: this.email,
          featureEnabled: this.featureEnabled,
        });

        this.initialUsername = this.username;
        this.initialEmail = this.email;
        this.initialFeatureEnabled = this.featureEnabled;

        auth.displayName = this.username;
        auth.email = this.email;
        if (this.password) {
          auth.password = this.password;
        }
        sessionStorage.setItem("user", JSON.stringify(auth));

        this.password = "";
        this.confirmPassword = "";
        this.message = "変更を保存しました";
        this.discardChanges();
        this.clearMessage();
      } catch (error) {
        console.error("ユーザーデータの更新に失敗", error);
        this.errorMessage = "変更の保存に失敗しました";
        this.discardChanges();
        this.clearMessage();
      }
    },
    discardChanges() {
      this.username = this.initialUsername;
      this.nowPassword = "";
      this.password = "";
      this.confirmPassword = "";
      this.showPassword = false;
      this.featureEnabled = this.initialFeatureEnabled;
    },
    clearMessage() {
      setTimeout(() => {
        this.message = "";
        this.errorMessage = "";
      }, 4000);
    },
  },
};
</script>

<style>
.text-center {
  text-align: center;
}

.justify-center {
  display: flex;
  justify-content: center;
}

.switch-container {
  display: flex;
  align-items: center;
  max-width: fit-content;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.config-alert {
  margin-bottom: 0px;
}
</style>
