// popup.ts – Logic for NoCode DevOps + Design Suite b.v1.0 🚀

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openTermux") as HTMLButtonElement;
  const runBtn = document.getElementById("runScript") as HTMLButtonElement;

  openBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openTermux" }, (response) => {
      console.log("ℹ️ Response:", response.status);
    });
  });

  runBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "runDevOps" }, (response) => {
      console.log("ℹ️ Response:", response.status);
    });
  });
});
