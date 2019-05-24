// VARIABLES AND DOM SETUP
import { toggleStats, toggleVoyage, centerView } from "./functions";
import { startEngine } from "./engine";

/********** DOM **********/

// CONTAINERS
export const canvasWrapper = document.getElementById("canvas__wrapper"); // wraps the sim. translating this pans the view.
const gameContainer = document.getElementById("game__container"); // wraps the canvas and panning arrows. the canvas translates relative to this

// DISPLAY
export const fpsCounter = document.getElementById("fps"); // used to FPS
const loadBar = document.getElementById("loader"); // loading bar
export const shipCount = document.getElementById("shipCount"); // used to display ship count
const starCount = document.getElementById("starCount"); // used to display star count

// BUTTONS
const deselect = document.getElementById("deselect"); // deselect button
const destinationFocus = document.getElementById("destination_focus"); // destination focus button
const devButton = document.getElementById("dev_console"); // dev console button
const shipFocus = document.getElementById("ship_focus"); // ship focus button
const shipLock = document.getElementById("ship_lock"); // ship lock button
const voyageToggle = document.getElementById("voyage_toggle"); // toggles drawing of voyage lines

/********** DOM **********/

/********** VARS **********/

// DATA
export const fleet = []; // ships
export const mouse = { x: 0, y: 0 }; // mouse position
export const selectedShip = {}; // reference to the selected ship
export const universe = {
  stars: [],
  size: { width: 3000, height: 3000 },
  starDensity: 4500,
  starProximity: 20,
  starAttempts: 100
}; // stars

// SWITCHES
let lockShip; // to toggle view centering lock
let showVoyage = false; // toggle voyage lines

// GENERATION
export const fleetSize = 1000; // ship quantity
const gameContainerSize = {
  // size of the game container. the canvas translates relative to this
  height: gameContainer.clientHeight,
  width: gameContainer.clientWidth
};
const mouseProximity = 20; // for highlighting ships on hover
const shipVelocity = 1000; // ship speed

// RENDERER VIEW POSITION
const canvasPos = {
  x: 0,
  y: 0
};

/********** VARS **********/

/********** LISTENERS **********/

// TOGGLE STAT DISPLAY
devButton.addEventListener("click", toggleStats);

// TOGGLE VOYAGE LINE DRAWING
voyageToggle.addEventListener("click", toggleVoyage);

// SELECT A SHIP
shipFocus.addEventListener("click", () => {
  if (selectedShip) {
    setLockShip(false);
    centerView(selectedShip.coordinates, selectedShip);
  }
});

// FOCUS ON DESTINATION
destinationFocus.addEventListener("click", () => {
  if (selectedShip) {
    setLockShip(false);
    centerView(selectedShip.destination);
  }
});

// DESELECT
deselect.addEventListener("click", () => {
  if (selectedShip) {
    setLockShip(false);
    selectedShip = undefined;
  }
});

// TOGGLE VIEW LOCKING TO SHIP
shipLock.addEventListener("click", () => {
  lockShip = !lockShip;
  shipLock.classList.toggle("active");
});

/********** LISTENERS **********/

startEngine();
