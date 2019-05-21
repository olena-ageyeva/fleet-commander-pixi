function getRandomWholeNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: (Math.atan2(y, x) * 180) / Math.PI
  };
}

function Vector(magnitude, angle) {
  var angleRadians = (angle * Math.PI) / 180;

  this.magnitudeX = magnitude * Math.cos(angleRadians);
  this.magnitudeY = magnitude * Math.sin(angleRadians);
}

function getRandomStar(limit) {
  if (limit && limit.distance > 0) {
    const limitedStars = universe.filter((limitStar, index) => {
      const starDistance = distanceAndAngleBetweenTwoPoints(
        limitStar.x,
        limitStar.y,
        limit.origin.x,
        limit.origin.y
      ).distance;
      return starDistance <= limit.distance;
    });
    let getStar = true;
    let newStar;
    let tries = 0;
    newStar = limitedStars[getRandomWholeNumber(0, limitedStars.length - 1)];
    return newStar;
  }
  return universe[getRandomWholeNumber(0, universe.length - 1)];
}

function makeShip(index) {
  const range = 200;
  const origin = getRandomStar();
  const destination = getRandomStar({ distance: range, origin });
  const name = `${index % 2 === 0 ? "SHIP" : "SHIPPPPPPPP"}-${index + 1}`;
  const distanceToDestination = distanceAndAngleBetweenTwoPoints(
    origin.x,
    origin.y,
    destination.x,
    destination.y
  ).distance;
  const newShip = new Ship(
    destination,
    distanceToDestination,
    name,
    origin,
    range
  );
  return newShip;
}

function generateFleet() {
  const fleet = new Array(fleetSize).fill(undefined).map((value, index) => {
    return makeShip(index);
  });
  return fleet;
}

function getStarCoordinate(name, size) {
  return {
    name,
    x: getRandomWholeNumber(starEdgeDistance, size.width),
    y: getRandomWholeNumber(starEdgeDistance, size.height)
  };
}

function generateUniverse(size, density) {
  const stars = Math.floor((size.width * size.height) / density);
  const starCoords = [];
  for (let i = 0; i < stars; i++) {
    if (i === 0) {
      starCoords.push(getStarCoordinate(`STAR-${i + 1}`, size));
    } else {
      let newCoordinate = undefined;
      let tries = 0;
      while (newCoordinate === undefined) {
        newCoordinate = getStarCoordinate(`STAR-${i + 1}`, size);
        for (let s = 0; s < starCoords.length; s++) {
          tries++;
          if (tries > starAttempts) {
            throw new Error("bad stars!");
          }
          const currentStar = starCoords[s];
          const starDistance = distanceAndAngleBetweenTwoPoints(
            currentStar.x,
            currentStar.y,
            newCoordinate.x,
            newCoordinate.y
          ).distance;
          if (starDistance < starProximity) {
            newCoordinate = undefined;
            break;
          }
        }
      }
      starCoords.push(newCoordinate);
    }
  }
  return starCoords;
}

function getTravelData(ship, milliseconds) {
  const travelData = {};
  travelData.distanceAndAngle = distanceAndAngleBetweenTwoPoints(
    ship.coordinates.x,
    ship.coordinates.y,
    ship.destination.x,
    ship.destination.y
  );
  travelData.shipVector = new Vector(
    ship.velocity,
    travelData.distanceAndAngle.angle
  );
  travelData.elapsedSeconds = milliseconds / 1000;
  return travelData;
}

function getStarRadius() {
  // const starSizes = [1.75, 2, 2.25, 2.5, 2.75];
  const starSizes = [2, 2, 2, 2, 2];

  const random = Math.random();
  if (random <= 0.3) {
    return starSizes[0];
  }
  if (random > 0.3 && random <= 0.75) {
    return starSizes[1];
  }
  if (random > 0.75 && random <= 0.85) {
    return starSizes[2];
  }
  if (random > 0.85 && random <= 0.95) {
    return starSizes[3];
  }
  if (random > 0.95) {
    return starSizes[4];
  }
}

function centerView(coords, centerShip) {
  if (lockShip === true) {
    canvasWrapper.style.transition = `none`;
  } else {
    canvasWrapper.style.transition = `transform 250ms ease-in-out`;
  }
  let coordinates = coords;
  const newX = (coordinates.x - (gameContainerSize.width + 1) / 2) * -1;
  const newY = (coordinates.y - (gameContainerSize.height + 2) / 2) * -1;

  const newMapPosition = {
    x:
      newX < 0 && newX > (gamesize.width - gameContainerSize.width) * -1
        ? newX
        : newX >= 0
        ? 0
        : newX < (gamesize.width - gameContainerSize.width) * -1
        ? (gamesize.width - gameContainerSize.width) * -1
        : newX,
    y:
      newY < 0 && newY > (gamesize.height - (gameContainerSize.height - 4)) * -1
        ? newY
        : newY >= 0
        ? 0
        : newY < (gamesize.height - (gameContainerSize.height - 4)) * -1
        ? (gamesize.height - (gameContainerSize.height - 4)) * -1
        : newY
  };

  canvasPos.x = newMapPosition.x;
  canvasPos.y = newMapPosition.y;
  canvasWrapper.style.transform = `translate(${canvasPos.x}px,${
    canvasPos.y
  }px)`;
  if (centerShip) {
    setTimeout(() => {
      lockShip = true;
    }, 250);
  }
}

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
  // update all ships
  let proxShip;

  fleet.forEach((ship, index) => {
    if (ship.travelling) {
      const travelData = getTravelData(ship, delta);
      const distanceToDestination = travelData.distanceAndAngle.distance;
      ship.distanceToDestination = distanceToDestination;
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
        ship.coordinates.x +
        travelData.shipVector.magnitudeX * travelData.elapsedSeconds;
      const newShipY =
        ship.coordinates.y +
        travelData.shipVector.magnitudeY * travelData.elapsedSeconds;

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
  if (selectedShip) {
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
}
