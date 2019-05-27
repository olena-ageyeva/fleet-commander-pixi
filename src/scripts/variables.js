/********** DISTANCE **********/
const lightSecond = 186282.39705;
const lightYear = 5878625373183.61;
const pixelsPerLightYear = 60;
/********** DISTANCE **********/

/********** MAP **********/
const activeScans = {};
const autoLock = true;
const canvasPos = {
  x: 0,
  y: 0
};
let clearCenterViewSprite = false;
let clickedOnce = false;
const gamesize = { width: 3000, height: 3000 }; // object: height and width of map canvas
let lockShip; // boolean: lock view ot selected ship
const panSpeed = 500;
const scans = {};
const textAlphaDelay = 20;
/********** MAP **********/

/********** MUSIC **********/
let canplay = false;
let currentTrack;
const enableMusic = false;
let maxVolume = 0.3;
/********** MUSIC **********/

/********** SHIPS **********/
const baseShipSpeed = 0.01666666666666666667; // to move 1 pixel at 60fps
const baseSpeedMultiplier = 0.00000190128526888; // multiplied by base speed to get 1c
const cSpeed = 10000;
let displayStats = true;
let fleet; // array: all ships
const fleetMap = {};
const fleetSize = 1; // int: size of initial fleet array
const mouseProximity = 10; // int: mouse proximity for ship selection
let selectedShip; // object: refernce to selected ship
const shipRange = 2 * pixelsPerLightYear;
let showVoyage = false; // boolean. draw voyage lines
/********** SHIPS **********/

/********** STARS **********/
const mouseStarProximity = 5;
let selectedStar;
const starAttempts = 750000000; // int: max loop for star generation.
const starDensity = 9000; // int: density of stars. higer values = fewer stars
const starEdgeDistance = 50; // int: keep stars away from map edge
const starProximity = 30; // int: min distance between stars
let universe; // array: all stars
let universeMap = {}; // object of all stars for proximity calc without the need to loop
/********** STARS **********/

/********** UI **********/
let mouse; // object: mouse position. {x, y}
const skipAnimation = true;
/********** UI **********/

/********** FPS **********/
const displayFPS = true;
let fps;
const times = [];

function recordFPS() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    recordFPS();
  });
}

displayFPS && recordFPS();
/********** FPS **********/

/********** SHIP NAMES **********/
const shipNamePrefixes = [
  "BC",
  "BS",
  "CS",
  "HWSS",
  "ISS",
  "LWSS",
  "SC",
  "SS",
  "STS"
];
const shipNames = [
  "Beef Lizard",
  "Trident",
  "Artemis",
  "Manchester",
  "Ambition",
  "Chimera",
  "Diplomat",
  "Genesis",
  "Raving",
  "Visitor",
  "Hammerhead",
  "Vagabond",
  "Oregon",
  "Sparrow",
  "Victoria",
  "Venom",
  "Francesca",
  "Ace of Spades",
  "Hannibal",
  "Teresa",
  "Poseidon",
  "Defiance",
  "Nomad",
  "Perilous",
  "Nihilus",
  "Dragonstar",
  "Galatea",
  "Warrior",
  "Polaris",
  "Starhunter",
  "Arcadian",
  "Zenith",
  "Rhinoceros",
  "New Hope",
  "Commissioner",
  "Gremlin",
  "Jellyfish",
  "Raven",
  "Scythe",
  "Von Kamps",
  "Oathbringer",
  "Prophet",
  "Arcadia",
  "Ares",
  "Yucatan",
  "Ravager",
  "Globetrotter",
  "Renault",
  "Atlas",
  "Liberator",
  "Relentless",
  "Bandit",
  "Escorial",
  "Apocalypse",
  "Harpy",
  "Constellation",
  "Muriela",
  "Close Encounter",
  "Dream"
];
/********** SHIP NAMES **********/
