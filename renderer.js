const information = document.getElementById("info");
information.innerText = `This app is running Chrome v${versions.chrome()}, node v${versions.node()} and electron v${versions.electron()} `;

const func = async () => {
  const response = await versions.ping();
  console.log(response);
};

func();

const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
setButton.addEventListener("click", () => {
  const title = titleInput.value;
  electronAPI.setTitle(title);
});
const fileOpen = document.getElementById("fileopen");
const filePathElement = document.getElementById("filePath");
fileOpen.addEventListener("click", async () => {
  const filePath = await window.electronAPI.openFile();
  filePathElement.innerText = filePath;
});

const counter = document.getElementById("counter");

window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue.toString();
  window.electronAPI.counterValue(newValue);
});
