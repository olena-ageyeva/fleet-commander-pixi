import {
  fleet,
  mouse,
  mouseProximity,
  selectedShip,
  canvasWrapper,
  fpsCounter,
  shipCount
} from "./main";
import { checkProximity, getRandomStar } from "./functions";
import {
  hoverSprite,
  selectedShipSprite,
  selectionSprite,
  destinationSprite,
  ticker
} from "./engine";

let frames = 0;
export function play(delta) {
  // stats.begin();
  frames++;
  if (frames >= 60) {
    frames = 0;
    const fps = ticker.FPS;
    fpsCounter.innerText = `FPS ${fps.toFixed(0)}`;
    shipCount.innerText = `SHIPS ${fleet.length}`;
  }
  // update all ships
  let proxShip;

  fleet.forEach((ship, index) => {
    if (index === 0) {
      console.log(ship);
    }
    if (ship.travelling) {
      ship.getTravelData(delta);

      if (ship.distanceToDestination < 1) {
        ship.origin = ship.coordinates;
        ship.destination = getRandomStar({
          distance: ship.range,
          origin: ship.origin
        });
        ship.voyages.push({
          origin: ship.origin,
          destination: ship.destination
        });
        if (ship.voyages.length > 10) {
          ship.voyages.shift();
        }
      }
      const newShipX =
        ship.coordinates.x +
        ship.travelData.vector.magnitudeX * ship.travelData.elapsedSeconds;
      const newShipY =
        ship.coordinates.y +
        ship.travelData.vector.magnitudeY * ship.travelData.elapsedSeconds;

      ship.coordinates = { x: newShipX, y: newShipY };
      ship.directionX = newShipX > ship.destination.x ? "west" : "east";
      ship.directionY = newShipY > ship.destination.y ? "north" : "south";

      if (mouse && checkProximity(mouseProximity, ship.coordinates, mouse)) {
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
  if (selectedShip.id) {
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
  // stats.end();
}
