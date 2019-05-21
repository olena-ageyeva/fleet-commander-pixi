const testShip = new Ship({ x: 0, y: 0 }, 10, "test", { x: 0, y: 0 }, 100);
console.log(testShip);

// let Application = PIXI.Application,
//   loader = PIXI.Loader.shared,
//   resources = PIXI.Loader.shared.resources,
//   Sprite = PIXI.Sprite,
//   Graphics = PIXI.Graphics,
//   Text = PIXI.Text;

// // VARIABLES
// let mouse;
// let selectedShip;
// let fleet;
// let universe;
// let lockShip;
// let translate = false;
// let showVoyage = false;

// const fleetSize = 1000;
// const shipVelocity = 1000;
// const gamesize = { width: 4096, height: 4096 }; // 4096 max
// const starDensity = 10000;
// const starProximity = 50;
// const generateShips = false;
// const starAttempts = 1000000;
// const starEdgeDistance = 50;
// const proximity = 20;

// const canvasPos = {
//   x: 0,
//   y: 0
// };
// // VARIABLES

// DOM
// const canvasWrapper = document.getElementById("canvas__wrapper");
// const fpsCounter = document.getElementById("fps");
// const shipCount = document.getElementById("shipCount");
// const starCount = document.getElementById("starCount");
// const gameContainer = document.getElementById("game__container");
// let gameContainerSize;
// const loadBar = document.getElementById("loader");
// const voyageToggle = document.getElementById("voyage_toggle");
// const snapshot = document.getElementById("snapshot");
// const mapLoadingText = document.getElementById("map_loading_text");

// const mainInterface = document.getElementById("interface");
// const interfaceLoader = document.getElementById("interface_loader");
// const interfaceFader = document.getElementById("interface_fader");

// const devButton = document.getElementById("dev_console");
// const shipFocus = document.getElementById("ship_focus");
// const destinationFocus = document.getElementById("destination_focus");

// const shipLock = document.getElementById("ship_lock");
// const deselect = document.getElementById("deselect");

// DOM
// snapshot.addEventListener("click", takeSnapshot);
// voyageToggle.addEventListener("click", toggleVoyage);

// shipFocus.addEventListener("click", () => {
//   if (selectedShip) {
//     lockShip = false;
//     centerView(selectedShip.coordinates, selectedShip);
//   }
// });

// destinationFocus.addEventListener("click", () => {
//   if (selectedShip) {
//     lockShip = false;
//     centerView(selectedShip.destination);
//   }
// });

// deselect.addEventListener("click", () => {
//   if (selectedShip) {
//     lockShip = false;
//     selectedShip = undefined;
//   }
// });

// shipLock.addEventListener("click", () => {
//   lockShip = !lockShip;
//   shipLock.classList.toggle("active");
// });

// const skipAnimation = true;
// const animationTime = {
//   loadUITimeout: skipAnimation ? 0 : 500,
//   showUITimeout: skipAnimation ? 0 : 2000,
//   interfaceHeightTimeout: skipAnimation ? 0 : 750,
//   interfaceFadeTimeout: skipAnimation ? 0 : 750,
//   loadMapTimeout: skipAnimation ? 0 : 500,
//   blinkInterval: skipAnimation ? 0 : 500,
//   mainFadeTimeout: skipAnimation ? 0 : 1000
// };

// function loadUI() {
//   let width = interfaceLoader.clientWidth;
//   interfaceLoader.style.transform = `translate(${width}px, 0)`;
// }

// function showUI() {
//   mainInterface.removeChild(interfaceLoader);
//   mainInterface.style.width = `calc(100% - 50px)`;
//   setTimeout(() => {
//     mainInterface.style.height = `calc(100% - 50px)`;
//     setTimeout(() => {
//       interfaceFader.style.opacity = 1;
//       setTimeout(() => {
//         loadMap();
//       }, animationTime.loadMapTimeout);
//     }, animationTime.interfaceFadeTimeout);
//   }, animationTime.interfaceHeightTimeout);
// }

// function loadMap() {
//   let up = true;
//   let blinks = 0;
//   const blinkterval = setInterval(() => {
//     blinks++;
//     mapLoadingText.style.opacity = up ? 1 : 0.25;
//     up = !up;
//     if (blinks === 5) {
//       mapLoadingText.innerText = "COMPLETE";
//       clearInterval(blinkterval);
//       setTimeout(() => {
//         mapLoadingText.style.opacity = 0;
//         document.querySelectorAll(".game__content").forEach(node => {
//           node.style.opacity = 1;
//         });
//         document.querySelectorAll(".map__pan__control").forEach(node => {
//           node.style.opacity = 0.1;
//         });
//         gameContainerSize = {
//           height: gameContainer.clientHeight,
//           width: gameContainer.clientWidth
//         };
//       }, animationTime.mainFadeTimeout);
//     }
//   }, animationTime.blinkInterval);
// }

// setTimeout(() => {
//   loadUI();
//   setTimeout(() => {
//     showUI();
//   }, animationTime.showUITimeout);
// }, animationTime.loadUITimeout);

// INIT PIXI
// let starContainer;
// let shipContainer;
// let style = new PIXI.TextStyle({
//   fontFamily: "Inconsolata",
//   letterSpacing: 1.75,
//   fontSize: 12,
//   fontWeight: 700,
//   fill: "white"
// });
// const renderer = new PIXI.Renderer({
//   width: gamesize.width,
//   height: gamesize.height,
//   antialias: true,
//   transparent: true,
//   resolution: 1
// });
// canvasWrapper.appendChild(renderer.view);
// const stage = new PIXI.Container();
// const voyageLayer = new PIXI.Container();
// const voyageLine = new Graphics();
// voyageLine.resolution = 1;
// voyageLine.alpha = 1;
// voyageLayer.addChild(voyageLine);
// stage.addChild(voyageLayer);
// const ticker = new PIXI.Ticker();
// ticker.add(() => {
//   renderer.render(stage);
// }, PIXI.UPDATE_PRIORITY.LOW);
// ticker.start();
// // load assets
// loader
//   .add([
//     "assets/sprites/ship.png",
//     "assets/sprites/ship-selected.png",
//     "assets/sprites/ship-selection-ring.png",
//     "assets/sprites/star.png"
//   ])
//   .load(setup);
// INIT PIXI

// // TEXTURES
// let unselectShipTexture;
// let selectedShipTexture;
// let selectionRingTexture;
// let starTexture;
// // TEXTURES

// // FUNCTIONS
// function toggleVoyage() {
//   showVoyage = !showVoyage;
//   voyageLine.clear();
// }

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

function getRandomStar(limit) {
  if (limit && limit.distance > 0) {
    const limitedStars = universe.filter((limitStar, index) => {
      const starDistance = distanceAndAngleBetweenTwoPoints(
        limitStar.x,
        limitStar.y,
        limit.origin.x,
        limit.origin.y
      ).distance;
      return starDistance <= limit.distance;
    });
    let getStar = true;
    let newStar;
    let tries = 0;
    newStar = limitedStars[getRandomWholeNumber(0, limitedStars.length - 1)];
    return newStar;
  }
  return universe[getRandomWholeNumber(0, universe.length - 1)];
}

function makeShip(index) {
  const maxDist = 200;
  const origin = getRandomStar();
  const destination = getRandomStar({ distance: maxDist, origin });
  return {
    name: `${index % 2 === 0 ? "SHIP" : "SHIPPPPPPPP"}-${index + 1}`,
    origin,
    destination,
    voyages: [{ origin, destination }],
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
    maxTravelDistance: maxDist,
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
  // loadBar.style.transform = `translate(calc(${percent}%)px, 0)`;
  // loadBar.style.transform = `translate(${percent}px, 0)`;
}

function generateUniverse(size, density) {
  const stars = Math.floor((size.width * size.height) / density);
  const starCoords = [];
  let parentStar;
  for (let i = 0; i < stars; i++) {
    if (i === 0) {
      starCoords.push({
        // x: getRandomWholeNumber(10, size.width),
        // y: getRandomWholeNumber(10, size.height)
        name: `STAR-${i + 1}`,
        x: size.width / 2,
        y: size.height / 2
      });
      parentStar = starCoords[0];
    } else {
      let newStarCoords;
      let tries = 0;
      while (newStarCoords === undefined) {
        let prox = false;
        const someCoords = {
          name: `STAR-${i + 1}`,
          x: getRandomWholeNumber(starEdgeDistance, size.width),
          y: getRandomWholeNumber(starEdgeDistance, size.height)
        };
        for (let s = 0; s < starCoords.length; s++) {
          // checkProximity(starProximity, someCoords, starCoords[s])
          if (
            distanceAndAngleBetweenTwoPoints(
              someCoords.x,
              someCoords.y,
              starCoords[s].x,
              starCoords[s].y
            ).distance < starProximity
          ) {
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

      if (i % 50 === 0) {
        parentStar = newStarCoords;
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
  // const starSizes = [1.75, 2, 2.25, 2.5, 2.75];
  const starSizes = [3, 3, 3, 3, 3];

  const random = Math.random();
  if (random <= 0.3) {
    return starSizes[0];
  }
  if (random > 0.3 && random <= 0.75) {
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

function centerView(coords, centerShip) {
  if (lockShip === true) {
    canvasWrapper.style.transition = `none`;
  } else {
    canvasWrapper.style.transition = `transform 250ms ease-in-out`;
  }
  let coordinates = coords;
  const newX = (coordinates.x - (gameContainerSize.width + 1) / 2) * -1;
  const newY = (coordinates.y - (gameContainerSize.height + 2) / 2) * -1;

  const newMapPosition = {
    x:
      newX < 0 && newX > (gamesize.width - gameContainerSize.width) * -1
        ? newX
        : newX >= 0
        ? 0
        : newX < (gamesize.width - gameContainerSize.width) * -1
        ? (gamesize.width - gameContainerSize.width) * -1
        : newX,
    y:
      newY < 0 && newY > (gamesize.height - (gameContainerSize.height - 4)) * -1
        ? newY
        : newY >= 0
        ? 0
        : newY < (gamesize.height - (gameContainerSize.height - 4)) * -1
        ? (gamesize.height - (gameContainerSize.height - 4)) * -1
        : newY
  };

  canvasPos.x = newMapPosition.x;
  canvasPos.y = newMapPosition.y;
  canvasWrapper.style.transform = `translate(${canvasPos.x}px,${
    canvasPos.y
  }px)`;
  if (centerShip) {
    setTimeout(() => {
      lockShip = true;
    }, 250);
  }
}

// let destinationSprite;
// let selectionSprite;
// let hoverSprite;
// let selectedShipSprite;
//This `setup` function will run when the image has loaded
// function setup() {
//   // TEXTURES
//   unselectShipTexture = resources["assets/sprites/ship.png"].texture;
//   selectedShipTexture = resources["assets/sprites/ship-selected.png"].texture;
//   selectionRingTexture =
//     resources["assets/sprites/ship-selection-ring.png"].texture;
//   starTexture = resources["assets/sprites/star.png"].texture;
//   // TEXTURES
//   renderer.view.addEventListener("mousemove", function(event) {
//     const bounds = event.target.getBoundingClientRect();
//     const newMouse = {
//       x: event.x - bounds.left,
//       y: event.y - bounds.top
//     };
//     mouse = newMouse;
//   });
//   renderer.view.addEventListener("mouseleave", function(event) {
//     mouse = {
//       x: undefined,
//       y: undefined
//     };
//   });
//   renderer.view.addEventListener("click", function(event) {
//     const bounds = event.target.getBoundingClientRect();
//     const clickCoords = {
//       x: event.x - bounds.left,
//       y: event.y - bounds.top
//     };
//     const clickedShip = fleet.filter(ship => {
//       // return checkProximity(proximity, clickCoords, ship.coordinates);
//       return (
//         distanceAndAngleBetweenTwoPoints(
//           clickCoords.x,
//           clickCoords.y,
//           ship.coordinates.x,
//           ship.coordinates.y
//         ).distance < proximity
//       );
//     })[0];
//     if (clickedShip) {
//       voyageLine.clear();
//       lockShip = false;
//       selectedShip = clickedShip;
//       centerView(clickedShip.coordinates, clickedShip);
//     } else {
//       voyageLine.clear();
//       selectedShip = undefined;
//     }
//   });

//   universe = generateUniverse(gamesize, starDensity);
//   starCount.innerText = `STARS ${universe.length.toLocaleString()}`;
//   starContainer = new PIXI.Container();
//   // starContainer.maxSize = 1000000;

//   universe.forEach(starCoordinate => {
//     const star = new Sprite(starTexture);
//     star.anchor.set(0.5);
//     const starSize = getStarRadius();
//     star.x = starCoordinate.x;
//     star.y = starCoordinate.y;
//     star.height = starSize;
//     star.width = starSize;
//     star.resolution = 1;
//     starContainer.addChild(star);
//   });
//   starContainer.cacheAsBitmap = true;

//   stage.addChild(starContainer);

//   fleet = generateFleet();
//   shipContainer = new PIXI.ParticleContainer();
//   fleet.forEach(ship => {
//     // assign starting sprite and starting texture
//     ship.sprite = new Sprite();
//     ship.sprite.anchor.set(0.5);
//     ship.sprite.texture = unselectShipTexture;
//     ship.sprite.height = 6;
//     ship.sprite.width = 6;

//     // add message
//     ship.message = new Text(ship.name, style);
//     ship.statsText = new Text("STATS: THIS IS A STAT", style);
//     ship.message.resolution = 2;
//     ship.statsText.resolution = 2;

//     shipContainer.addChild(ship.sprite);
//   });
//   stage.addChild(shipContainer);

//   destinationSprite = new Sprite(selectedShipTexture);
//   destinationSprite.anchor.set(0.5);
//   selectionSprite = new Sprite(selectionRingTexture);
//   selectionSprite.anchor.set(0.5);
//   hoverSprite = new Sprite(selectedShipTexture);
//   hoverSprite.anchor.set(0.5);
//   selectedShipSprite = new Sprite(selectedShipTexture);
//   selectedShipSprite.anchor.set(0.5);
//   destinationSprite.height = 6;
//   destinationSprite.width = 6;
//   hoverSprite.height = 20;
//   hoverSprite.width = 20;
//   selectedShipSprite.height = 10;
//   selectedShipSprite.width = 10;
//   selectionSprite.visible = false;
//   destinationSprite.visible = false;
//   hoverSprite.visible = false;
//   selectedShipSprite.visible = false;
//   stage.addChild(selectionSprite);
//   stage.addChild(destinationSprite);
//   stage.addChild(hoverSprite);
//   stage.addChild(selectedShipSprite);

//   //Start the game loop
//   ticker.add(delta => gameLoop(delta));
// }

function gameLoop(delta) {
  play(delta);
}

// function checkProximity(distance, origin, target) {
//   if (
//     origin.x - target.x < distance &&
//     origin.x - target.x > distance * -1 &&
//     origin.y - target.y < distance &&
//     origin.y - target.y > distance * -1
//   ) {
//     return true;
//   }
//   return false;
// }

let frames = 60;

function play(delta) {
  frames++;
  if (frames >= 60) {
    frames = 0;
    const fps = ticker.FPS;
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
        ship.destination = getRandomStar({
          distance: ship.maxTravelDistance,
          origin: ship.origin
        });
        if (ship.voyages.length > 100) {
          ship.voyages.shift();
        }
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
      // checkProximity(proximity, ship.coordinates, mouse)
      if (
        mouse &&
        distanceAndAngleBetweenTwoPoints(
          mouse.x,
          mouse.y,
          ship.coordinates.x,
          ship.coordinates.y
        ).distance < proximity
      ) {
        proxShip = ship;
      }

      ship.sprite.x = newShipX;
      ship.sprite.y = newShipY;

      if (selectedShip && ship.name === selectedShip.name) {
        // lock ship to view on each frame
        if (lockShip) {
          centerView(ship.coordinates);
        }
        if (!ship.setSelected) {
          ship.setSelected = true;
          stage.addChild(ship.message);
          stage.addChild(ship.statsText);
        }
        // remove previous line and text
        stage.removeChild(ship.line);

        let textStartY;
        let textStartX = newShipX - 20;

        // ADJUST DISPLAY Y
        if (
          (ship.directionY === "north" || newShipY < 90) &&
          newShipY < gamesize.height - 100
        ) {
          textStartY = newShipY + 20 + 7;
        } else {
          textStartY = newShipY - 20 - ship.statsText.height - 5;
        }
        // ADJUST DISPLAY X
        if (newShipX >= gamesize.width - (ship.statsText.width - 20)) {
          textStartX = gamesize.width - ship.statsText.width;
        }
        if (newShipX <= 30) {
          textStartX = 10;
        }

        // update ship message position and add to stage
        const nameOffset = ship.message.width + 26;
        let nameStartY = newShipY - 4.5;
        if (newShipY <= 12) {
          nameStartY = 16;
        }
        if (newShipY > gamesize.height - 14) {
          nameStartY = gamesize.height - 10;
        }
        let nameStartX =
          ship.directionX === "east" ? newShipX - nameOffset : newShipX + 26;
        if (newShipX > gamesize.width - (nameOffset + 10)) {
          nameStartX = newShipX - nameOffset;
        }
        if (newShipX < nameOffset + 10) {
          nameStartX = newShipX + 26;
        }
        ship.message.position.set(nameStartX, nameStartY);
        ship.statsText.position.set(textStartX, textStartY);

        // add line primitive and add to stage
        ship.line = new Graphics();
        ship.line.lineStyle(1, 0x70ffe9);
        ship.line.moveTo(newShipX, newShipY);
        ship.line.lineTo(ship.destination.x, ship.destination.y);
        stage.addChild(ship.line);
      } else {
        if (ship.setSelected) {
          ship.setSelected = false;
          stage.removeChild(ship.line);
          stage.removeChild(ship.message);
          stage.removeChild(ship.statsText);
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
    hoverSprite.x = proxShip.coordinates.x;
    hoverSprite.y = proxShip.coordinates.y;
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
    selectionSprite.x = selectedShip.coordinates.x;
    selectionSprite.y = selectedShip.coordinates.y;
    selectionSprite.visible = true;
    destinationSprite.visible = true;
    destinationSprite.x = selectedShip.destination.x;
    destinationSprite.y = selectedShip.destination.y;
    selectedShipSprite.x = selectedShip.coordinates.x;
    selectedShipSprite.y = selectedShip.coordinates.y;
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

// function takeSnapshot() {
//   const image = renderer.extract.image(starContainer);
//   image.id = "voyage_image";
//   document.body.appendChild(image);
//   setTimeout(() => {
//     document.body.removeChild(document.getElementById("voyage_image"));
//   }, 5000);
// }
