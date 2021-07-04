function download() {
  const canvas = document.getElementById("canvas");

  const temp = canvas.toDataURL("image/jpeg", 1.0);
  console.log(canvas.toDataURL("image/jpeg", 1.0));
  console.log(temp);

  downloadImage(temp, "untitled.jpeg");
}
//From https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
function downloadImage(data, filename = "untitled.jpeg") {
  var a = document.createElement("a");
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}
