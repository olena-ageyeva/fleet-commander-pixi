// PIXI CONFIG
import * as PIXI from "pixi.js";

import { universe, canvasWrapper } from "./main";
import { setup } from "./setup";
import { play } from "./gameloop";
import { generateUniverse } from "./functions";

/********** RENDERER SETUP **********/

// PIXI ALIASES
const Graphics = PIXI.Graphics;
const loader = PIXI.Loader.shared;
export const resources = PIXI.Loader.shared.resources;
export const Sprite = PIXI.Sprite;
export const Text = PIXI.Text;
const Ticker = PIXI.Ticker;
const Renderer = PIXI.Renderer;
const ParticleContainer = PIXI.ParticleContainer;
const Container = PIXI.Container;

// TICKER
export const ticker = new Ticker();

// CONTAINERS
export const shipContainer = new ParticleContainer(); // ship sprites
export const stage = new Container(); // all containers
export const starContainer = new Container(); // star sprites
const voyageLayer = new Container(); // voyage line graphics

// STYLES
export const textStyle = new PIXI.TextStyle({
  fontFamily: "Inconsolata",
  letterSpacing: 1.75,
  fontSize: 12,
  fontWeight: 700,
  fill: "white"
});

// TEXTURES
export let selectedShipTexture;
export let selectionRingTexture;
export let starTexture;
export let unselectShipTexture;

// GRAPHICS
const voyageLine = new Graphics();
voyageLine.resolution = 1;
voyageLine.alpha = 0.5;
voyageLine.lineStyle(1, 0x5ffb8e);

export let renderer;
export function startEngine() {
  // INIT RENDERER

  renderer = new PIXI.Renderer({
    antialias: true,
    height: universe.size.height,
    resolution: 1,
    transparent: true,
    width: universe.size.width
  });

  // START TICKER
  ticker.add(() => {
    renderer.render(stage);
  }, PIXI.UPDATE_PRIORITY.LOW);
  ticker.start();

  // LOAD TEXTURES
  loader
    .add([
      "../assets/sprites/ship.png",
      "../assets/sprites/ship-selected.png",
      "../assets/sprites/ship-selection-ring.png",
      "../assets/sprites/star.png"
    ])
    .load(load);
}

export let hoverSprite;
export let selectionSprite;
export let destinationSprite;
export let selectedShipSprite;

function load() {
  unselectShipTexture = resources["../assets/sprites/ship.png"].texture;
  selectedShipTexture =
    resources["../assets/sprites/ship-selected.png"].texture;
  selectionRingTexture =
    resources["../assets/sprites/ship-selection-ring.png"].texture;
  starTexture = resources["../assets/sprites/star.png"].texture;
  // TEXTURES

  destinationSprite = new Sprite(selectedShipTexture);
  destinationSprite.anchor.set(0.5);
  destinationSprite.height = 6;
  destinationSprite.width = 6;
  destinationSprite.visible = false;

  selectionSprite = new Sprite(selectionRingTexture);
  selectionSprite.anchor.set(0.5);
  selectionSprite.visible = false;

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

  // LINK CONTAINERS, RENDERER, AND DOM
  generateUniverse(universe.size, universe.starDensity, universe.starProximity);

  voyageLayer.addChild(voyageLine);
  stage.addChild(shipContainer);
  stage.addChild(starContainer);
  stage.addChild(voyageLayer);
  canvasWrapper.appendChild(renderer.view);

  stage.addChild(selectionSprite);
  stage.addChild(destinationSprite);
  stage.addChild(hoverSprite);
  stage.addChild(selectedShipSprite);
  renderer.render(starContainer);

  setup();
}

export function gameLoop(delta) {
  //Update the current game state:
  play(delta);
}
