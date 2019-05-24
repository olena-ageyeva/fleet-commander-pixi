const {
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Renderer,
  Container,
  Ticker,
  ParticleContainer
} = PIXI;

const Loader = PIXI.Loader.shared;
const Resources = PIXI.Loader.shared.resources;

// create renderer
const renderer = new Renderer({
  width: gamesize.width,
  height: gamesize.height,
  antialias: true,
  transparent: true,
  resolution: 1
});

// create containers
const shipContainer = new ParticleContainer(); // all ship dots
const stage = new Container(); // all dynamic sprites
const starContainer = new ParticleContainer(); // all stars
const voyageLayer = new Container(); // all voyage graphics
const scanLayer = new Container(); // all voyage graphics

// create graphics and text
const textStyle = new PIXI.TextStyle({
  fontFamily: "Inconsolata",
  letterSpacing: 1.75,
  lineHeight: 13,
  fontSize: 12,
  fontWeight: 700,
  fill: "white"
});
const voyageLine = new Graphics();
voyageLine.lineStyle(3, 0x70ffe9);

const destinationLine = new Graphics();
destinationLine.lineStyle(1, 0xffffff);

// const scanCircle = new Graphics();
// scanCircle.lineStyle(2, 0x70ffe9);

// attach canvas and containers
canvasWrapper.appendChild(renderer.view);
stage.addChild(starContainer);
stage.addChild(shipContainer);
stage.addChild(voyageLayer);
stage.addChild(scanLayer);
voyageLayer.addChild(voyageLine);
voyageLayer.addChild(destinationLine);

// start ticker
const ticker = new Ticker();
ticker.add(() => {
  renderer.render(stage);
}, PIXI.UPDATE_PRIORITY.LOW);
ticker.start();

// add event listeners
renderer.view.addEventListener("mousemove", function(event) {
  const bounds = event.target.getBoundingClientRect();
  const newMouse = {
    x: event.x - bounds.left,
    y: event.y - bounds.top
  };
  mouse = newMouse;
});
renderer.view.addEventListener("mouseleave", function(event) {
  mouse = {
    x: undefined,
    y: undefined
  };
});
renderer.view.addEventListener("click", function(event) {
  const bounds = event.target.getBoundingClientRect();
  const clickCoords = {
    x: event.x - bounds.left,
    y: event.y - bounds.top
  };
  const clickedShip = fleet.filter(ship => {
    return (
      distanceAndAngleBetweenTwoPoints(
        clickCoords.x,
        clickCoords.y,
        ship.coordinates.x,
        ship.coordinates.y
      ).distance < mouseProximity
    );
  })[0];
  const clickedStar = universe.filter(star => {
    return (
      distanceAndAngleBetweenTwoPoints(
        clickCoords.x,
        clickCoords.y,
        star.x,
        star.y
      ).distance < mouseStarProximity
    );
  })[0];
  if (clickedShip || clickedStar) {
    setVoyage(clickedShip !== undefined || selectedShip !== undefined);
    setLockShip(false);
    if (clickedStar) {
      selectedStar = clickedStar;
      centerView(clickedStar);
    }
    if (clickedShip) {
      setShipStats(true);
      selectedShip = clickedShip;
      centerView(clickedShip.coordinates, clickedShip);
      if (!selectedStar) {
        selectedStar = universeMap[clickedShip.destination.id];
      }
    }
  } else {
    if (clickedOnce) {
      showCenterViewSprite(1, panSpeed, clickCoords, true);
    } else {
      setLockShip(false);
      clickedOnce = true;
      setTimeout(() => {
        clickedOnce = false;
      }, 300);
    }
  }
});

function showCenterViewSprite(alpha, hideDelay, coords, centerNow) {
  clearCenterViewSprite = false;
  centerViewSprite.x = coords.x;
  centerViewSprite.y = coords.y;
  centerViewSprite.alpha = alpha;
  centerViewSprite.visible = true;
  if (centerNow) {
    centerView(coords);
  }
  setTimeout(() => {
    clearCenterViewSprite = true;
  }, hideDelay);
}

// load assets
Loader.add([
  "assets/sprites/ship.png",
  "assets/sprites/ship-selected.png",
  "assets/sprites/ship-selection-ring.png",
  "assets/sprites/star-selection-ring.png",
  "assets/sprites/star-hover-ring.png",
  "assets/sprites/star.png",
  "assets/sprites/center-view-box.png"
]).load(setup);

// declate textures
let unselectShipTexture;
let selectedShipTexture;
let selectionRingTexture;
let starSelectionRingTexture;
let starHoverRingTexture;

let starTexture;
let centerViewTexture;

// declare sprites
let destinationSprite;
let selectionSprite;
let starSelectionSprite;
let starHoverSprite;
let hoverSprite;
let selectedShipSprite;
let centerViewSprite;

function setup() {
  // define textures
  unselectShipTexture = Resources["assets/sprites/ship.png"].texture;
  selectedShipTexture = Resources["assets/sprites/ship-selected.png"].texture;
  selectionRingTexture =
    Resources["assets/sprites/ship-selection-ring.png"].texture;
  starSelectionRingTexture =
    Resources["assets/sprites/star-selection-ring.png"].texture;
  starHoverRingTexture =
    Resources["assets/sprites/star-hover-ring.png"].texture;
  starTexture = Resources["assets/sprites/star.png"].texture;
  centerViewTexture = Resources["assets/sprites/center-view-box.png"].texture;

  // generate the universe
  universe = generateUniverse(gamesize, starDensity);
  starCount.innerText = `STARS ${universe.length.toLocaleString()}`;

  universe.forEach(star => {
    universeMap[star.id] = star;
  });

  // place star sprites
  universe.forEach(starCoordinate => {
    const star = new Sprite(starTexture);
    star.anchor.set(0.5);
    const starSize = getStarRadius();
    star.x = starCoordinate.x;
    star.y = starCoordinate.y;
    star.height = starSize;
    star.width = starSize;
    star.resolution = 1;
    star.cacheAsBitmap = true;
    starContainer.addChild(star);
  });

  fleet = generateFleet();
  fleet.forEach(ship => {
    // assign starting sprite and starting texture
    ship.sprite = new Sprite();
    ship.sprite.anchor.set(0.5);
    ship.sprite.texture = unselectShipTexture;
    ship.sprite.height = 6;
    ship.sprite.width = 6;

    ship.sprite.x = ship.coordinates.x;
    ship.sprite.y = ship.coordinates.y;

    // add message
    ship.message = new Text(ship.name, textStyle);
    ship.statsText = new Text("STATUS: UNKNOWN", textStyle);
    ship.message.resolution = 2;
    ship.statsText.resolution = 2;

    shipContainer.addChild(ship.sprite);
  });

  fleet.forEach(ship => {
    fleetMap[ship.id] = ship;
  });

  // create sprites
  destinationSprite = new Sprite(selectedShipTexture);
  destinationSprite.anchor.set(0.5);
  destinationSprite.height = 6;
  destinationSprite.width = 6;
  destinationSprite.visible = false;

  selectionSprite = new Sprite(selectionRingTexture);
  selectionSprite.anchor.set(0.5);
  selectionSprite.visible = false;

  starSelectionSprite = new Sprite(starSelectionRingTexture);
  starSelectionSprite.anchor.set(0.5);
  starSelectionSprite.visible = false;
  starSelectionSprite.height = 30;
  starSelectionSprite.width = 30;

  starHoverSprite = new Sprite(starHoverRingTexture);
  starHoverSprite.anchor.set(0.5);
  starHoverSprite.visible = false;

  hoverSprite = new Sprite(selectedShipTexture);
  hoverSprite.anchor.set(0.5);
  hoverSprite.height = 20;
  hoverSprite.width = 20;
  hoverSprite.visible = false;

  selectedShipSprite = new Sprite(selectedShipTexture);
  selectedShipSprite.anchor.set(0.5);
  selectedShipSprite.height = 10;
  selectedShipSprite.width = 10;
  selectedShipSprite.visible = false;

  centerViewSprite = new Sprite(centerViewTexture);
  centerViewSprite.anchor.set(0.5);
  centerViewSprite.visible = false;

  // attach all sprites
  stage.addChild(selectionSprite);
  stage.addChild(starSelectionSprite);
  stage.addChild(starHoverSprite);
  stage.addChild(destinationSprite);
  stage.addChild(hoverSprite);
  stage.addChild(selectedShipSprite);
  stage.addChild(centerViewSprite);

  //Start the game loop
  ticker.add(delta => gameLoop(delta));
}
