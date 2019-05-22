function gameLoop(delta) {
  play(delta);
}

let frames = 60;

function play(delta) {
  frames++;
  if (frames >= 60) {
    frames = 0;
    const fps = ticker.FPS;
    fpsCounter.innerText = `FPS ${fps.toFixed(0)}`;
    shipCount.innerText = `SHIPS ${fleet.length}`;
  }
  let proxShip;
  fleet.forEach((ship, index) => {
    if (ship.travelling) {
      ship.getTravelData(delta);
      if (ship.distanceToDestination < 1) {
        ship.origin = ship.coordinates;
        ship.destination = getRandomStar({
          distance: ship.range,
          origin: ship.origin
        });
        if (ship.voyages.length > 100) {
          ship.voyages.shift();
        }
      }
      const newShipX =
        ship.coordinates.x + ship.travelData.vector.magnitudeX * delta;
      const newShipY =
        ship.coordinates.y + ship.travelData.vector.magnitudeY * delta;
      ship.coordinates = { x: newShipX, y: newShipY };
      ship.directionX = newShipX > ship.destination.x ? "west" : "east";
      ship.directionY = newShipY > ship.destination.y ? "north" : "south";
      if (
        mouse &&
        distanceAndAngleBetweenTwoPoints(
          mouse.x,
          mouse.y,
          ship.coordinates.x,
          ship.coordinates.y
        ).distance < mouseProximity
      ) {
        proxShip = ship;
      }
      ship.sprite.x = newShipX;
      ship.sprite.y = newShipY;
      if (selectedShip && ship.id === selectedShip.id) {
        // lock ship to view on each frame
        if (lockShip) {
          centerView(ship.coordinates);
        }
        if (!ship.setSelected) {
          ship.setSelected = true;
          stage.addChild(ship.message);
          stage.addChild(ship.statsText);
        }
        let textStartY;
        let textStartX = newShipX - 20;
        // ADJUST DISPLAY Y
        if (
          (ship.directionY === "north" ||
            newShipY < ship.statsText.height * 1.75) &&
          newShipY < gamesize.height - ship.statsText.height * 1.75
        ) {
          textStartY = newShipY + 20 + 7;
        } else {
          textStartY = newShipY - 20 - ship.statsText.height - 5;
        }
        // ADJUST DISPLAY X
        if (newShipX >= gamesize.width - (ship.statsText.width - 10)) {
          textStartX = gamesize.width - ship.statsText.width - 10;
        }
        if (newShipX <= 30) {
          textStartX = 10;
        }
        // update ship message position and add to stage
        const nameOffset = ship.message.width + 26;
        let nameStartY = newShipY - 4.5;
        if (newShipY <= ship.message.height + 5) {
          nameStartY = ship.message.height;
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
        ship.statsText.text = `ETA: ${convertTime(
          Math.floor(ship.distanceToDestination / ship.velocity / 60)
        )}\nDIST: ${renderDistance(ship.distanceToDestination)}\nDEST: ${
          ship.destination.name
        }`;
        ship.message.position.set(nameStartX, nameStartY);
        ship.statsText.position.set(textStartX, textStartY);
        voyageLine.clear();
        voyageLine.moveTo(newShipX, newShipY);
        voyageLine.lineTo(ship.destination.x, ship.destination.y);
      } else {
        if (ship.setSelected) {
          voyageLine.clear();
          ship.setSelected = false;
          stage.removeChild(ship.message);
          stage.removeChild(ship.statsText);
        }
      }
    }
  });
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
    if (!selectionSprite.visible) {
      selectionSprite.visible = true;
    }
    if (!destinationSprite.visible) {
      destinationSprite.visible = true;
    }
    destinationSprite.x = selectedShip.destination.x;
    destinationSprite.y = selectedShip.destination.y;
    selectedShipSprite.x = selectedShip.coordinates.x;
    selectedShipSprite.y = selectedShip.coordinates.y;
    selectionSprite.x = selectedShip.coordinates.x;
    selectionSprite.y = selectedShip.coordinates.y;
    selectionSprite.rotation += 0.01;
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
