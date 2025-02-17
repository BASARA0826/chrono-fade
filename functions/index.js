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

    console.log(`onDocumentCreated: ${taskId}`, task);

    if (!task) return;

    // 初回処理
    await processVanish(taskId, "onDocumentCreated");
  }
);

// タスク更新時に関数呼び出し
let updateCallCount = {};

exports.updateVanishTask = onDocumentUpdated(
  {
    document: "task/{taskId}",
    timeoutSeconds: 540,
    maxInstances: 1,
  },
  async (event) => {
    const beforeTask = event.data.before.data();
    const afterTask = event.data.after.data();
    const taskId = event.params.taskId;

    console.log("onDocumentUpdated", afterTask);
    console.log(
      "beforeTask.intervalList2:",
      JSON.stringify(beforeTask.intervalList2)
    );
    console.log(
      "afterTask.intervalList2:",
      JSON.stringify(afterTask.intervalList2)
    );

    if (!updateCallCount[taskId]) updateCallCount[taskId] = 0;
    updateCallCount[taskId]++;

    if (beforeTask.completedFlg || afterTask.completedFlg) return;

    // vanishFlgがfalseのときだけtrueにしてprocessVanishを呼び出す
    if (!afterTask.vanishFlg) {
      await admin
        .firestore()
        .collection("task")
        .doc(taskId)
        .update({ vanishFlg: true });
      await processVanish(
        taskId,
        `onDocumentUpdated (${updateCallCount[taskId]})`
      );
    } else {
      console.log("else onDocumentUpdated");
    }
  }
);

// 文字消去処理
async function processVanish(taskId, source) {
  console.log(`processVanish Started Called from ${source}`);
  const taskDocRef = admin.firestore().collection("task").doc(taskId);
  const taskDoc = await taskDocRef.get();
  const taskData = taskDoc.data();
  let localIntervalList = [...taskData.intervalList2];

  // タスク完了時に処理終了
  if (taskData.completedFlg) return;

  if (localIntervalList.length > 0) {
    const waitTime = localIntervalList.shift() * 1000;
    // 指定時間待機
    console.log(`waiting for ${waitTime} ms`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // localIntervalListが空ならintervalList2を更新しない
    if (localIntervalList.length !== 0) {
      console.log("Updating intervalList2");
      await taskDocRef.update({
        intervalList2: localIntervalList,
        vanishFlg: false,
      });
      return;
    }
  }

  if (localIntervalList.length === 0) {
    console.log("vanish-Started");
    let titleChars = taskData.vanish_title.split("");
    let contentChars = taskData.vanish_content.split("");
    let allChars = [...titleChars, ...contentChars];

    // vanish_titleとvanish_contentが全て空白の場合、dispFlgをfalseにして処理終了
    if (allChars.every((char) => char === "　")) {
      await taskDocRef.update({ dispFlg: false });
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
    await taskDocRef.update({
      vanish_title: titleChars.join(""),
      vanish_content: contentChars.join(""),
    });

    // vanish_titleとvanish_contentが全て空白の場合、dispFlgをfalseにする
    if (
      titleChars.every((char) => char === "　") &&
      contentChars.every((char) => char === "　")
    ) {
      await taskDocRef.update({ dispFlg: false });
      return;
    }

    // dispFlgがtrueならintervalList2内のデータを復活させてonDocumentUpdatedを実行させるようにする
    if (taskData.dispFlg) {
      console.log("processVanish-repeat");
      await taskDocRef.update({
        intervalList2: [...taskData.intervalList],
        vanishFlg: false,
      });
    }

    console.log("processVanish-finished");
  }
}
