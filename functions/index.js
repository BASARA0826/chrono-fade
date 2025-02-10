const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

exports.vanishTask = onDocumentCreated("task/{taskId}", (event) => {
  const task = event.data.data();
  const interval = task.interval * 1000; // ミリ秒変換
  const taskId = event.params.taskId;

  const vanishInterval = setInterval(async () => {
    const taskDoc = await admin
      .firestore()
      .collection("task")
      .doc(taskId)
      .get();
    const taskData = taskDoc.data();

    if (taskData.completeFlg) {
      clearInterval(vanishInterval);
      return;
    }

    const titleChars = taskData.vanish_title.split("");
    const contentChars = taskData.vanish_content.split("");
    const allChars = [...titleChars, ...contentChars];
    const randomIndex = Math.floor(Math.random() * allChars.length);

    if (randomIndex < titleChars.length) {
      titleChars[randomIndex] = "　";
    } else {
      contentChars[randomIndex - titleChars.length] = "　";
    }

    const updatedVanishTitle = titleChars.join("");
    const updatedVanishContent = contentChars.join("");

    await admin.firestore().collection("task").doc(taskId).update({
      vanish_title: updatedVanishTitle,
      vanish_content: updatedVanishContent,
    });

    if (
      updatedVanishTitle.trim() === "" &&
      updatedVanishContent.trim() === ""
    ) {
      await admin.firestore().collection("task").doc(taskId).update({
        dispFlg: false,
      });
      clearInterval(vanishInterval);
    }
  }, interval);
});
