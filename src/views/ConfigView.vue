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
            <v-avatar size="256" color="grey darken-1" class="mb-4">
              <v-img src="" alt="Account Image"></v-img>
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
              outlined
            ></v-text-field>
          </v-card-text>

          <!-- パスワードの編集 -->
          <v-divider></v-divider>
          <v-card-title>パスワード</v-card-title>
          <v-card-text>
            <v-text-field
              label="新しいパスワード"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePasswordVisibility"
            ></v-text-field>
            <v-text-field
              label="新しいパスワード（確認用）"
              v-model="confirmPassword"
              outlined
              type="password"
            ></v-text-field>
          </v-card-text>

          <!-- スライドボタン -->
          <v-divider></v-divider>
          <v-card-title
            >忘れかけた記録は成し遂げてもなお忘れたままだ</v-card-title
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
            <v-btn color="success" @click="saveChanges">変更保存</v-btn>
            <v-btn color="error" @click="discardChanges">変更破棄</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    username: "", // ユーザー名
    password: "", // 新しいパスワード
    confirmPassword: "", // パスワード確認用
    showPassword: false, // パスワードの表示/非表示切り替え
    featureEnabled: true, // 機能の有効/無効
  }),
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    changeAccountImage() {
      alert("アカウント画像を変更します！");
    },
    saveChanges() {
      alert("変更を保存しました！");
    },
    discardChanges() {
      alert("変更を破棄しました！");
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
