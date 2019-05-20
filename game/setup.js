import {
  ticker,
  gameLoop,
  Sprite,
  renderer,
  starContainer,
  unselectShipTexture,
  selectedShipTexture,
  selectionRingTexture,
  starTexture,
  shipContainer,
  stage,
  Text,
  textStyle,
  destinationSprite
} from "./engine";
import { universe, fleet, mouse, fleetSize } from "./main";

import { generateFleet, getStarRadius } from "./functions";
import { log } from "util";

export function setup() {
  renderer.view.addEventListener("mousemove", function(event) {
    const bounds = event.target.getBoundingClientRect();
    const newMouse = {
      x: event.x - bounds.left,
      y: event.y - bounds.top
    };
    mouse.x = newMouse.x;
    mouse.y = newMouse.y;
  });
  renderer.view.addEventListener("mouseleave", function(event) {
    mouse.x = undefined;
    mouse.y = undefined;
  });
  renderer.view.addEventListener("click", function(event) {
    const bounds = event.target.getBoundingClientRect();
    const clickCoords = {
      x: event.x - bounds.left,
      y: event.y - bounds.top
    };
    const clickedShip = fleet.filter(ship => {
      return checkProximity(proximity, clickCoords, ship.coordinates);
    })[0];
    if (clickedShip) {
      voyageLine.clear();
      lockShip = false;
      selectedShip = clickedShip;
      centerView(clickedShip.coordinates, clickedShip);
    } else {
      voyageLine.clear();
      selectedShip = undefined;
    }
  });

  starCount.innerText = `STARS ${universe.stars.length.toLocaleString()}`;

  universe.stars.forEach(starCoordinate => {
    const star = new Sprite(starTexture);
    star.anchor.set(0.5);
    const starSize = getStarRadius();
    star.position.x = starCoordinate.x;
    star.position.y = starCoordinate.y;
    star.height = starSize;
    star.width = starSize;
    star.resolution = 1;
    starContainer.addChild(star);
  });
  starContainer.cacheAsBitmap = true;

  generateFleet(fleetSize);

  fleet.forEach(ship => {
    // assign starting sprite and starting texture
    ship.sprite = new Sprite();
    ship.sprite.anchor.set(0.5);
    ship.sprite.texture = unselectShipTexture;
    ship.sprite.height = 6;
    ship.sprite.width = 6;

    // add message
    ship.message = new Text(ship.name, textStyle);
    ship.statsText = new Text("STATS: THIS IS A STAT", textStyle);
    ship.message.resolution = 2;
    ship.statsText.resolution = 2;
    shipContainer.addChild(ship.sprite);
  });

  //Start the game loop
  // ticker.add(delta => gameLoop(delta));
}
