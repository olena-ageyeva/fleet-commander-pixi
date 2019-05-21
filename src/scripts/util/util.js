function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function takeSnapshot() {
  const image = renderer.extract.image(starContainer);
  image.id = "voyage_image";
  document.body.appendChild(image);
  setTimeout(() => {
    document.body.removeChild(document.getElementById("voyage_image"));
  }, 5000);
}

// FUNCTIONS
function toggleVoyage() {
  showVoyage = !showVoyage;
  voyageLine.clear();
}
