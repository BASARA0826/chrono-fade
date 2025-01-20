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
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordVisibility"
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
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordVisibility"
            ></v-text-field>
          </v-card-text>

          <!-- スライドボタン -->
          <v-divider></v-divider>
          <v-card-title
            >「記録」は「記憶」となり時とともに過ぎ、元に戻ることはない</v-card-title
          >
          <v-card-text>
            <v-switch
              v-model="featureEnabled"
              label="完了したタスクを完了時点の状態で表示します。無効にするとタスク作成時の内容を表示します"
              inset
            ></v-switch>
          </v-card-text>

          <!-- ボタン -->
          <v-divider></v-divider>
          <v-card-actions>
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
    username: "", // ユーザー名
    email: "", // メールアドレス
    nowPassword: "", // 現在のパスワード
    password: "", // 新しいパスワード
    confirmPassword: "", // パスワード確認用
    showPassword: false, // パスワードの表示/非表示切り替え
    featureEnabled: true, // 機能の有効/無効
    initialUsername: "", // 初期値を保存
    initialEmail: "", // 初期値を保存
    initialFeatureEnabled: true, // 初期値を保存
    nameRules: [
      (v) => !!v || "ユーザー名を入力してください",
      (v) => (v && v.length <= 10) || "10文字以下に設定してください",
    ],
    emailRules: [
      (v) => !!v || "メールアドレスを入力してください",
      (v) => /.+@.+\..+/.test(v) || "不正なメールアドレスです",
    ],
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
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
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
          alert("新しいパスワードと確認用パスワードが一致しません");
          this.discardChanges();
          return;
        }
        if (this.nowPassword !== auth.password) {
          alert("現在のパスワードが違います");
          this.discardChanges();
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
        auth.password = this.password;
        sessionStorage.setItem("user", JSON.stringify(auth));

        alert("ユーザーデータを更新しました");
        this.password = "";
        this.confirmPassword = "";
      } catch (error) {
        console.error("ユーザーデータの更新に失敗", error);
        alert("ユーザーデータの更新に失敗しました");
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
</style>
