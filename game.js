// STATS
const stats = new Stats();
let showStats = false;
document.body.appendChild(stats.dom);
stats.showPanel();
function toggleStats() {
  if (showStats) {
    stats.showPanel();
    showStats = false;
  } else {
    stats.showPanel(2);
    showStats = true;
  }
}
// STATS

// VARIABLES
let mouse;
let selectedShip;
let fleet;
let universe;
let lockShip;
let translate = false;

const fleetSize = 1000;
const shipVelocity = 1000;
const gamesize = 3000; // universe size 3000
const starDensity = 1000; // 90
const starProximity = 5;
const generateShips = false;
const starAttempts = 500;
const proximity = 20;

const canvasPos = {
  x: 0,
  y: 0
};
// VARIABLES

// DOM
const canvasWrapper = document.getElementById("canvas__wrapper");
const fpsCounter = document.getElementById("fps");
const shipCount = document.getElementById("shipCount");
const starCount = document.getElementById("starCount");
const gameContainer = document.getElementById("game__container");
const loadBar = document.getElementById("loader");

const devButton = document.getElementById("dev_console");
const shipFocus = document.getElementById("ship_focus");
const destinationFocus = document.getElementById("destination_focus");

const shipLock = document.getElementById("ship_lock");
const deselect = document.getElementById("deselect");

const gameContainerSize = {
  height: gameContainer.clientHeight,
  width: gameContainer.clientWidth
};
// DOM

devButton.addEventListener("click", toggleStats);

shipFocus.addEventListener("click", () => {
  if (selectedShip) {
    lockShip = false;
    centerView(selectedShip.coordinates);
  }
});

destinationFocus.addEventListener("click", () => {
  if (selectedShip) {
    lockShip = false;
    centerView(selectedShip.destination);
  }
});

deselect.addEventListener("click", () => {
  if (selectedShip) {
    lockShip = false;
    selectedShip = undefined;
  }
});

shipLock.addEventListener("click", () => {
  lockShip = !lockShip;
  shipLock.classList.toggle("active");
});

// INIT PIXI
let Application = PIXI.Application,
  loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources,
  Sprite = PIXI.Sprite,
  Graphics = PIXI.Graphics,
  Text = PIXI.Text;
let starContainer;
let shipContainer;
let style = new PIXI.TextStyle({
  fontFamily: "Inconsolata",
  letterSpacing: 1.75,
  fontSize: 12,
  fontWeight: 700,
  fill: "white"
});
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}
// PIXI.utils.sayHello(type);
PIXI.utils.skipHello(type);
let app = new Application({
  width: gamesize,
  height: gamesize,
  antialias: true,
  transparent: true,
  resolution: 1
});
canvasWrapper.appendChild(app.view);
// load assets
loader
  .add([
    "assets/sprites/ship.png",
    "assets/sprites/ship-selected.png",
    "assets/sprites/ship-selection-ring.png",
    "assets/sprites/star.png"
  ])
  .load(setup);
// INIT PIXI

// TEXTURES
let unselectShipTexture;
let selectedShipTexture;
let selectionRingTexture;
let starTexture;
// TEXTURES

// FUNCTIONS
function getRandomWholeNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: (Math.atan2(y, x) * 180) / Math.PI
  };
}

function Vector(magnitude, angle) {
  var angleRadians = (angle * Math.PI) / 180;

  this.magnitudeX = magnitude * Math.cos(angleRadians);
  this.magnitudeY = magnitude * Math.sin(angleRadians);
}

function getRandomStar() {
  return universe[getRandomWholeNumber(0, universe.length - 1)];
}

function makeShip(index) {
  const origin = getRandomStar();
  let destination = getRandomStar();
  return {
    name: `${index % 2 === 0 ? "SHIP" : "SHIPPPPPPPP"}-${index + 1}`,
    origin,
    destination,
    directionX: origin.x > destination.x ? "west" : "east",
    directionY: origin.y > destination.y ? "north" : "south",
    coordinates: origin,
    // id: uuid(),
    status: "STD",
    velocity: shipVelocity,
    radius: {
      base: 3,
      hover: 10,
      selected: 6
    },
    maxVelocity: 10,
    prepTime: 10,
    setSelected: false,
    scanning: {
      active: false,
      startingRadius: 1,
      currentRadius: 1,
      endRadius: 200,
      speed: 0.5
    },
    acceleration: 10,
    deceleration: 10,
    travelling: true,
    stopping: false,
    launchTime: 0,
    onApproach: false,
    distanceToDestination: distanceAndAngleBetweenTwoPoints(
      origin.x,
      origin.y,
      destination.x,
      destination.y
    ).distance
  };
}

function generateFleet() {
  const fleet = new Array(fleetSize).fill(undefined).map((value, index) => {
    return makeShip(index);
  });
  return fleet;
}

function updateProgress(cur, tot) {
  const percent = Math.floor((cur / tot) * 100);
  console.log(percent);
  // loadBar.style.transform = `translate(calc(${percent}%)px, 0)`;
  // loadBar.style.transform = `translate(${percent}px, 0)`;
}

function generateUniverse(size, density) {
  console.log("make stars");
  const stars = Math.floor((size * size) / density);
  const starCoords = [];
  let i = 0;
  for (let i = 0; i < stars; i++) {
    // updateProgress(starCoords.length, stars);
    let newStarCoords;
    if (i === 0) {
      starCoords.push({
        x: getRandomWholeNumber(10, size),
        y: getRandomWholeNumber(10, size)
      });
    } else {
      let tries = 0;
      while (newStarCoords === undefined) {
        let prox = false;
        const someCoords = {
          x: getRandomWholeNumber(10, size),
          y: getRandomWholeNumber(10, size)
        };

        for (let s = 0; s < starCoords.length; s++) {
          if (checkProximity(starProximity, someCoords, starCoords[s])) {
            tries++;
            if (tries > starAttempts) {
              throw new Error("universe limits too tight");
            }
            prox = true;
            break;
          }
        }
        if (!prox) {
          newStarCoords = someCoords;
        }
      }
      starCoords.push(newStarCoords);
    }
  }
  return starCoords;
}

function getTravelData(ship, milliseconds) {
  const travelData = {};
  travelData.distanceAndAngle = distanceAndAngleBetweenTwoPoints(
    ship.coordinates.x,
    ship.coordinates.y,
    ship.destination.x,
    ship.destination.y
  );
  travelData.shipVector = new Vector(
    ship.velocity,
    travelData.distanceAndAngle.angle
  );
  travelData.elapsedSeconds = milliseconds / 1000;
  return travelData;
}

function getStarRadius() {
  const starSizes = [0.75, 1.25, 1.75, 2.25, 2.75];

  const random = Math.random();
  if (random <= 0.4) {
    return starSizes[0];
  }
  if (random > 0.4 && random <= 0.75) {
    return starSizes[1];
  }
  if (random > 0.75 && random <= 0.85) {
    return starSizes[2];
  }
  if (random > 0.85 && random <= 0.95) {
    return starSizes[3];
  }
  if (random > 0.95) {
    return starSizes[4];
  }
}

function centerView(coords, shipToFollow) {
  if (lockShip === true) {
    canvasWrapper.style.transition = `none`;
  } else {
    canvasWrapper.style.transition = `transform 250ms ease-in-out`;
  }
  let coordinates = coords;
  // let followedShip;
  // if (shipToFollow) {
  //   followedShip = fleet.filter(ship => ship.name === shipToFollow.name)[0];
  //   if (followedShip) {
  //     coordinates = followedShip.coordinates;
  //   }
  // }
  const newX = (coordinates.x - (gameContainerSize.width + 1) / 2) * -1;
  const newY = (coordinates.y - (gameContainerSize.height + 2) / 2) * -1;

  const newMapPosition = {
    x:
      newX < 0 && newX > (gamesize - gameContainerSize.width) * -1
        ? newX
        : newX >= 0
        ? 0
        : newX < (gamesize - gameContainerSize.width) * -1
        ? (gamesize - gameContainerSize.width) * -1
        : newX,
    y:
      newY < 0 && newY > (gamesize - (gameContainerSize.height - 4)) * -1
        ? newY
        : newY >= 0
        ? 0
        : newY < (gamesize - (gameContainerSize.height - 4)) * -1
        ? (gamesize - (gameContainerSize.height - 4)) * -1
        : newY
  };

  canvasPos.x = newMapPosition.x;
  canvasPos.y = newMapPosition.y;
  canvasWrapper.style.transform = `translate(${canvasPos.x}px,${
    canvasPos.y
  }px)`;
}

function initShipSprites(ship) {
  ship.sprite = new Sprite();
  ship.sprite.texture = unselectShipTexture;

  // add message
  ship.message = new Text(ship.name, style);
  ship.message.resolution = 2;

  app.stage.addChild(ship.sprite);
  app.stage.addChild(ship.message);
  app.stage.addChild(ship.selection);
  app.stage.addChild(ship.destinationSprite);
}

let destinationSprite;
let selectionSprite;
let hoverSprite;
//This `setup` function will run when the image has loaded
function setup() {
  // TEXTURES
  unselectShipTexture = resources["assets/sprites/ship.png"].texture;
  selectedShipTexture = resources["assets/sprites/ship-selected.png"].texture;
  selectionRingTexture =
    resources["assets/sprites/ship-selection-ring.png"].texture;
  starTexture = resources["assets/sprites/star.png"].texture;
  // TEXTURES
  function updateMouse(event) {
    const bounds = event.target.getBoundingClientRect();
    const newMouse = {
      x: event.x - bounds.left,
      y: event.y - bounds.top
    };
    mouse = newMouse;
  }
  app.view.addEventListener("mousemove", function(event) {
    const bounds = event.target.getBoundingClientRect();
    const newMouse = {
      x: event.x - bounds.left,
      y: event.y - bounds.top
    };
    mouse = newMouse;
  });
  app.view.addEventListener("mouseleave", function(event) {
    mouse = {
      x: undefined,
      y: undefined
    };
  });
  app.view.addEventListener("click", function(event) {
    const bounds = event.target.getBoundingClientRect();
    const clickCoords = {
      x: event.x - bounds.left,
      y: event.y - bounds.top
    };
    const clickedShip = fleet.filter(ship => {
      return checkProximity(proximity, clickCoords, ship.coordinates);
    })[0];
    if (clickedShip) {
      lockShip = false;
      selectedShip = clickedShip;
      centerView(clickedShip.coordinates, clickedShip);
    } else {
      selectedShip = undefined;
    }
  });

  universe = generateUniverse(gamesize, starDensity);
  starCount.innerText = `STARS ${universe.length.toLocaleString()}`;
  starContainer = new PIXI.ParticleContainer();
  universe.forEach(starCoordinate => {
    const star = new Sprite(starTexture);
    const starSize = getStarRadius();
    star.x = starCoordinate.x;
    star.y = starCoordinate.y;
    star.height = starSize;
    star.width = starSize;
    star.resolution = 1;
    starContainer.addChild(star);
  });
  app.stage.addChild(starContainer);

  fleet = generateFleet();
  shipContainer = new PIXI.ParticleContainer();
  fleet.forEach(ship => {
    // assign starting sprite and starting texture
    ship.sprite = new Sprite();
    ship.sprite.texture = unselectShipTexture;
    ship.sprite.height = 6;
    ship.sprite.width = 6;

    // add message
    ship.message = new Text(ship.name, style);
    ship.message.resolution = 2;

    shipContainer.addChild(ship.sprite);
  });
  app.stage.addChild(shipContainer);

  destinationSprite = new Sprite(selectedShipTexture);
  selectionSprite = new Sprite(selectionRingTexture);
  hoverSprite = new Sprite(selectedShipTexture);
  selectedShipSprite = new Sprite(selectedShipTexture);
  destinationSprite.height = 6;
  destinationSprite.width = 6;
  hoverSprite.height = 20;
  hoverSprite.width = 20;
  selectedShipSprite.height = 10;
  selectedShipSprite.width = 10;
  selectionSprite.visible = false;
  destinationSprite.visible = false;
  hoverSprite.visible = false;
  selectedShipSprite.visible = false;
  app.stage.addChild(selectionSprite);
  app.stage.addChild(destinationSprite);
  app.stage.addChild(hoverSprite);
  app.stage.addChild(selectedShipSprite);

  //Set the game state
  state = play;

  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
  //Update the current game state:
  state(delta);
}

function checkProximity(distance, origin, target) {
  if (
    origin.x - target.x < distance &&
    origin.x - target.x > distance * -1 &&
    origin.y - target.y < distance &&
    origin.y - target.y > distance * -1
  ) {
    return true;
  }
  return false;
}

let frames = 60;
function play(delta) {
  stats.begin();
  frames++;
  if (frames >= 60) {
    frames = 0;
    const fps = app.ticker.FPS;
    fpsCounter.innerText = `FPS ${fps.toFixed(0)}`;
    shipCount.innerText = `SHIPS ${fleet.length}`;
    if (fps > 30 && generateShips) {
      const newShip = makeShip(fleet.length);
      initShipSprites(newShip);
      fleet.push(newShip);
    }
  }
  // update all ships
  let proxShip;
  fleet.forEach((ship, index) => {
    if (ship.travelling) {
      const travelData = getTravelData(ship, delta);
      const distanceToDestination = travelData.distanceAndAngle.distance;
      ship.distanceToDestination = distanceToDestination;
      if (ship.distanceToDestination < 1) {
        ship.origin = ship.coordinates;
        ship.destination = getRandomStar();
      }
      const newShipX =
        ship.coordinates.x +
        travelData.shipVector.magnitudeX * travelData.elapsedSeconds;
      const newShipY =
        ship.coordinates.y +
        travelData.shipVector.magnitudeY * travelData.elapsedSeconds;

      ship.coordinates = { x: newShipX, y: newShipY };
      ship.directionX = newShipX > ship.destination.x ? "west" : "east";
      ship.directionY = newShipY > ship.destination.y ? "north" : "south";

      if (mouse && checkProximity(proximity, ship.coordinates, mouse)) {
        proxShip = ship;
      }

      ship.sprite.x = newShipX - 3;
      ship.sprite.y = newShipY - 3;

      if (selectedShip && ship.name === selectedShip.name) {
        // lock ship to view on each frame
        if (lockShip) {
          centerView(ship.coordinates);
        }
        if (!ship.setSelected) {
          ship.setSelected = true;
          app.stage.addChild(ship.message);
        }
        // remove previous line and text
        app.stage.removeChild(ship.line);

        // update ship message position and add to stage
        let nameStartY = newShipY - 4.5;
        if (newShipY <= 12) {
          nameStartY = 16;
        }
        if (newShipY > gamesize - 14) {
          nameStartY = gamesize - 10;
        }

        const nameOffset = ship.message.width + 26;

        let nameStartX =
          ship.directionX === "east" ? newShipX - nameOffset : newShipX + 26;
        if (newShipX > gamesize - (nameOffset + 10)) {
          nameStartX = newShipX - nameOffset;
        }
        if (newShipX < nameOffset + 10) {
          nameStartX = newShipX + 26;
        }
        ship.message.position.set(nameStartX, nameStartY);

        // add line primitive and add to stage
        ship.line = new Graphics();
        ship.line.lineStyle(1, 0x70ffe9);
        ship.line.moveTo(newShipX, newShipY);
        ship.line.lineTo(ship.destination.x, ship.destination.y);
        app.stage.addChild(ship.line);
      } else {
        if (ship.setSelected) {
          ship.setSelected = false;
          app.stage.removeChild(ship.line);
          app.stage.removeChild(ship.message);
        }
      }
    }
  });
  // update selection related sprites
  if (proxShip) {
    if (!hoverSprite.visible) {
      hoverSprite.visible = true;
    }
    if (canvasWrapper.style.cursor !== "pointer") {
      canvasWrapper.style.cursor = "pointer";
    }
    hoverSprite.x = proxShip.coordinates.x - 10;
    hoverSprite.y = proxShip.coordinates.y - 10;
  } else {
    if (hoverSprite.visible) {
      hoverSprite.visible = false;
    }
    if (canvasWrapper.style.cursor !== "default") {
      canvasWrapper.style.cursor = "default";
    }
  }
  if (selectedShip) {
    if (!selectedShipSprite.visible) {
      selectedShipSprite.visible = true;
    }
    selectionSprite.x = selectedShip.coordinates.x - 20;
    selectionSprite.y = selectedShip.coordinates.y - 20;
    selectionSprite.visible = true;
    destinationSprite.visible = true;
    destinationSprite.x = selectedShip.destination.x - 3;
    destinationSprite.y = selectedShip.destination.y - 3;
    selectedShipSprite.x = selectedShip.coordinates.x - 5;
    selectedShipSprite.y = selectedShip.coordinates.y - 5;
  } else {
    if (selectedShipSprite.visible) {
      selectedShipSprite.visible = false;
    }
    if (destinationSprite.visible) {
      destinationSprite.visible = false;
    }
    if (selectionSprite.visible) {
      selectionSprite.visible = false;
    }
  }
  stats.end();
}

// CONTROLS
function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener("keydown", downListener, false);
  window.addEventListener("keyup", upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

let keyObject = keyboard("ArrowDown");
keyObject.press = () => {
  translate = true;
};
keyObject.release = () => {
  translate = false;
};
// CONTROLS
