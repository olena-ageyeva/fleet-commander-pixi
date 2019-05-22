let fleet; // array: all ships
let lockShip; // boolean: lock view ot selected ship
let mouse; // object: mouse position. {x, y}
let selectedShip; // object: refernce to selected ship
let showVoyage = false; // boolean. draw voyage lines
let universe; // array: all stars

const fleetSize = 1000; // int: size of initial fleet array
const gamesize = { width: 3960, height: 3960 }; // object: height and width of map canvas. 3136 for 5000 stars
const shipVelocity = 1000; // int: speed of ships
const starAttempts = 750000000; // int: max loop for star generation.
const starDensity = 78400; // int: density of stars. higer values = fewer stars
const starEdgeDistance = 50; // int: keep stars away from map edge
const starProximity = 180; // int: min distance between stars
const mouseProximity = 20; // int: mouse proximity for ship selection

// object: initial position of game canvas
const canvasPos = {
  x: 0,
  y: 0
};
