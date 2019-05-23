const skipAnimation = true;
let canplay = false;
setTimeout(() => {
  canplay = true;
}, 0);
document.body.addEventListener("click", () => {
  if (audPlayer.paused && canplay && enableMusic) {
    console.log("play music");

    audPlayer.play();
    canplay = false;
  }
});

// CONTAINERS
const canvasWrapper = document.getElementById("canvas__wrapper");
const gameContainer = document.getElementById("game__container");
const interfaceLoader = document.getElementById("interface_loader");
const mainInterface = document.getElementById("interface");
let gameContainerSize;

// DATA DISPLAY
const mapLoadingText = document.getElementById("map_loading_text");
const fpsCounter = document.getElementById("fps");
const shipCount = document.getElementById("shipCount");
const starCount = document.getElementById("starCount");

// UI
const loadBar = document.getElementById("loader");
const interfaceFader = document.getElementById("interface_fader");

// MENU CONTROLS
const voyageToggle = document.getElementById("voyage_toggle");
voyageToggle.addEventListener("click", toggleVoyage);

// HEADER CONTROLS
const devButton = document.getElementById("dev_console");
const listButton = document.getElementById("list");
const launchButton = document.getElementById("launch");
listButton.addEventListener("click", takeSnapshot);
launchButton.addEventListener("click", newMission);

// MAP CONTROLS
const shipFocus = document.getElementById("ship_focus");
const destinationFocus = document.getElementById("destination_focus");
const shipLock = document.getElementById("ship_lock");
const deselect = document.getElementById("deselect");
shipFocus.addEventListener("click", () => {
  if (selectedShip) {
    lockShip = false;
    centerView(selectedShip.coordinates, selectedShip);
  }
});

destinationFocus.addEventListener("click", () => {
  if (selectedShip) {
    lockShip = false;
    centerView(selectedShip.destination);
  }
});

shipLock.addEventListener("click", () => {
  lockShip = !lockShip;
  shipLock.classList.toggle("active");
});

deselect.addEventListener("click", () => {
  if (selectedShip) {
    lockShip = false;
    selectedShip = undefined;
    selectedStar = undefined;
  }
});

// ANIMATIONS
const animationTime = {
  loadUITimeout: skipAnimation === true ? 0 : 500,
  showUITimeout: skipAnimation === true ? 0 : 2000,
  interfaceHeightTimeout: skipAnimation === true ? 0 : 750,
  interfaceFadeTimeout: skipAnimation === true ? 0 : 750,
  loadMapTimeout: skipAnimation === true ? 0 : 500,
  blinkInterval: skipAnimation === true ? 0 : 500,
  mainFadeTimeout: 1000
};

function loadUI() {
  let width = interfaceLoader.clientWidth;
  interfaceLoader.style.transform = `translate(${width}px, 0)`;
}

function showUI() {
  mainInterface.removeChild(interfaceLoader);
  mainInterface.style.width = `calc(100% - 50px)`;
  setTimeout(() => {
    mainInterface.style.height = `calc(100% - 50px)`;
    setTimeout(() => {
      interfaceFader.style.opacity = 1;
      setTimeout(() => {
        loadMap();
      }, animationTime.loadMapTimeout);
    }, animationTime.interfaceFadeTimeout);
  }, animationTime.interfaceHeightTimeout);
}

function loadMap() {
  let up = true;
  let blinks = 0;
  const blinkterval = setInterval(() => {
    blinks++;
    mapLoadingText.style.opacity = up ? 1 : 0.25;
    up = !up;
    if (blinks === 5) {
      mapLoadingText.innerText = "COMPLETE";
      clearInterval(blinkterval);
      setTimeout(() => {
        mapLoadingText.style.opacity = 0;
        document.querySelectorAll(".game__content").forEach(node => {
          node.style.opacity = 1;
        });
        document.querySelectorAll(".map__pan__control").forEach(node => {
          node.style.opacity = 0.1;
          node.addEventListener("mousedown", ev => {
            panMap(ev.target.dataset.direction);
          });
          node.addEventListener("mouseup", ev => {
            stopMapPan();
          });
          node.addEventListener("mouseleave", ev => {
            stopMapPan();
          });
        });
        gameContainerSize = {
          height: gameContainer.clientHeight,
          width: gameContainer.clientWidth
        };
      }, animationTime.mainFadeTimeout);
    }
  }, animationTime.blinkInterval);
}

setTimeout(() => {
  loadUI();
  setTimeout(() => {
    showUI();
  }, animationTime.showUITimeout);
}, animationTime.loadUITimeout);
