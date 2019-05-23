let fleet; // array: all ships
let lockShip; // boolean: lock view ot selected ship
let mouse; // object: mouse position. {x, y}
let selectedShip; // object: refernce to selected ship
let selectedStar;
let showVoyage = false; // boolean. draw voyage lines
let universe; // array: all stars
let universeMap = {}; // object of all stars for proximity calc without the need to loop
let clickedOnce = false;
let maxVolume = 0.3;
const panSpeed = 500;
let clearCenterViewSprite = false;
const pixelsPerLightYear = 60;
const lightYear = 5878625373183.61;
const lightSecond = 186282.39705;
const baseSpeedMultiplier = 0.00000190128526888; // multiplied by base speed to get 1c
const baseShipSpeed = 0.01666666666666666667; // to move 1 pixel at 60fps

// 30 pixels per light year

const fleetSize = 1000; // int: size of initial fleet array
const gamesize = { width: 3000, height: 3000 }; // object: height and width of map canvas
const starAttempts = 750000000; // int: max loop for star generation.
const starDensity = 9000; // int: density of stars. higer values = fewer stars
const starEdgeDistance = 30; // int: keep stars away from map edge
// 30 pixels per light year
const starProximity = 30; // int: min distance between stars
const mouseProximity = 10; // int: mouse proximity for ship selection
const mouseStarProximity = 5;

// object: initial position of game canvas
const canvasPos = {
  x: 0,
  y: 0
};
