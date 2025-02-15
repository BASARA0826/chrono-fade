const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

// タスク作成時に関数呼び出し
exports.vanishTask = onDocumentCreated(
  {
    document: "task/{taskId}",
    timeoutSeconds: 540,
  },
  async (event) => {
    const task = event.data.data();
    const taskId = event.params.taskId;

    if (!task) return;

    // 初回処理
    await processVanish(taskId);
  }
);

// タスク更新時に関数呼び出し
exports.updateVanishTask = onDocumentUpdated(
  {
    document: "task/{taskId}",
    fieldFilters: ["intervalList2", "completedFlg"],
    timeoutSeconds: 540,
  },
  async (event) => {
    const beforeTask = event.data.before.data();
    const afterTask = event.data.after.data();
    const taskId = event.params.taskId;

    if (!afterTask || afterTask.completedFlg) return;

    // intervalList2が更新された場合に関数呼び出し
    if (beforeTask.intervalList2 !== afterTask.intervalList2) {
      await processVanish(taskId);
    }
  }
);

// 文字消去処理
async function processVanish(taskId) {
  const taskDocRef = admin.firestore().collection("task").doc(taskId);

  await admin.firestore().runTransaction(async (transaction) => {
    const taskDoc = await transaction.get(taskDocRef);
    const taskData = taskDoc.data();
    let localIntervalList = [...taskData.intervalList2];

    // タスク完了時に処理終了
    if (taskData.completedFlg) return;

    // vanishFlgがtrueのとき処理しない
    if (taskData.vanishFlg) return;

    // vanishFlgをtrueにして、処理開始
    transaction.update(taskDocRef, { vanishFlg: true });

    if (localIntervalList.length > 0) {
      const waitTime = localIntervalList.shift() * 1000;
      // 指定時間待機
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // localIntervalListが空ならintervalList2を更新しない
      if (localIntervalList.length !== 0) {
        transaction.update(taskDocRef, {
          intervalList2: localIntervalList,
          vanishFlg: false,
        });
        return;
      }
    }

    if (localIntervalList.length === 0) {
      let titleChars = taskData.vanish_title.split("");
      let contentChars = taskData.vanish_content.split("");
      let allChars = [...titleChars, ...contentChars];

      // vanish_titleとvanish_contentが全て空白の場合、dispFlgをfalseにして処理終了
      if (allChars.every((char) => char === "　")) {
        transaction.update(taskDocRef, { dispFlg: false, vanishFlg: false });
        return;
      }

      // ランダムに1文字を空白にする(全角スペースの場合は再探索)
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allChars.length);
      } while (allChars[randomIndex] === "　");

      if (randomIndex < titleChars.length) {
        titleChars[randomIndex] = "　";
      } else {
        contentChars[randomIndex - titleChars.length] = "　";
      }

      // 更新
      transaction.update(taskDocRef, {
        vanish_title: titleChars.join(""),
        vanish_content: contentChars.join(""),
      });

      // vanish_titleとvanish_contentが全て空白の場合、dispFlgをfalseにする
      if (
        titleChars.every((char) => char === "　") &&
        contentChars.every((char) => char === "　")
      ) {
        transaction.update(taskDocRef, { dispFlg: false, vanishFlg: false });
        return;
      }

      // dispFlgがtrueならintervalList2内のデータを復活させてonDocumentUpdatedを実行させるようにする
      if (taskData.dispFlg) {
        transaction.update(taskDocRef, {
          intervalList2: [...taskData.intervalList],
          vanishFlg: false,
        });
      }
    }
  });
}
