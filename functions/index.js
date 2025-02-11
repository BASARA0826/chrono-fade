const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.vanishTask = onDocumentCreated("task/{taskId}", async (event) => {
  const task = event.data.data();
  const taskId = event.params.taskId;

  if (!task) return;

  // 初回処理
  await processVanish(taskId);
});

// タスク更新時に文字が消える処理を行う
exports.updateVanishTask = onDocumentUpdated("task/{taskId}", async (event) => {
  const beforeTask = event.data.before.data();
  const afterTask = event.data.after.data();
  const taskId = event.params.taskId;

  if (!afterTask || afterTask.completedFlg) return;

  // 文字消去を進行させる
  if (
    beforeTask.vanish_title !== afterTask.vanish_title ||
    beforeTask.vanish_content !== afterTask.vanish_content
  ) {
    await processVanish(taskId);
  }
});

// 文字消去処理
async function processVanish(taskId) {
  const taskDocRef = admin.firestore().collection("task").doc(taskId);
  const taskDoc = await taskDocRef.get();
  const taskData = taskDoc.data();

  if (!taskData || taskData.completedFlg) return;

  if (taskData.vanishFlg) return;

  await new Promise((resolve) => setTimeout(resolve, taskData.interval * 1000));

  await taskDocRef.update({ vanishFlg: true });

  let titleChars = taskData.vanish_title.split("");
  let contentChars = taskData.vanish_content.split("");
  let allChars = [...titleChars, ...contentChars];

  if (allChars.every((char) => char === "　")) {
    await taskDocRef.update({ dispFlg: false, vanishFlg: false });
    return;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allChars.length);
  } while (allChars[randomIndex] === "　");

  if (randomIndex < titleChars.length) {
    titleChars[randomIndex] = "　";
  } else {
    contentChars[randomIndex - titleChars.length] = "　";
  }

  await taskDocRef.update({
    vanish_title: titleChars.join(""),
    vanish_content: contentChars.join(""),
    vanishFlg: false,
  });

  // vanish_titleとvanish_contentが全て空白の場合、dispFlgをfalseにする
  if (
    titleChars.every((char) => char === "　") &&
    contentChars.every((char) => char === "　")
  ) {
    await taskDocRef.update({ dispFlg: false });
  }
}
