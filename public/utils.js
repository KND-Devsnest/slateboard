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
//https://stackoverflow.com/a/30832210/10159640
function saveJSON() {
  let data = JSON.stringify(drawings);
  let filename = "slateBoard.json";
  let type = "json";
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function loadJSON() {
  const textarea = document.getElementById("tarea");
  drawings = JSON.parse(textarea.value);
  console.log(drawings);
  drawings.forEach((i) => {
    painting = true;
    reDraw(i);
    ctx.beginPath();
    painting = false;
  });
}
