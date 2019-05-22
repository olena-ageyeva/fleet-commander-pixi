let fleet; // array: all ships
let lockShip; // boolean: lock view ot selected ship
let mouse; // object: mouse position. {x, y}
let selectedShip; // object: refernce to selected ship
let showVoyage = false; // boolean. draw voyage lines
let universe; // array: all stars

// 60 pixels per light year

const fleetSize = 1000; // int: size of initial fleet array
const gamesize = { width: 3000, height: 3000 }; // object: height and width of map canvas
const starAttempts = 750000000; // int: max loop for star generation.
const starDensity = 18000; // int: density of stars. higer values = fewer stars
const starEdgeDistance = 5; // int: keep stars away from map edge
// 60 pixels per light year
const starProximity = 30; // int: min distance between stars
const mouseProximity = 10; // int: mouse proximity for ship selection

// object: initial position of game canvas
const canvasPos = {
  x: 0,
  y: 0
};
