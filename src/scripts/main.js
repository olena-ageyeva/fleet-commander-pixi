function gameLoop(delta) {
  play(delta);
}

let frames = 60;

let lastUpdate = Date.now();
function play(deltaTime) {
  // DELTA
  const now = Date.now();
  const elapsed = (now - lastUpdate) / 16.6666666666666667;
  lastUpdate = now;
  const delta = elapsed;
  // DELTA

  // AUDIO
  let audioStopping = audPlayer.duration - audPlayer.currentTime <= 10;
  if (!audPlayer.paused && audioStopping) {
    const newVolume = audPlayer.volume - 0.0005;
    audPlayer.volume = newVolume >= 0 ? newVolume : 0;
    if (audPlayer.volume === 0) {
      audPlayer.pause();
      nextTrack();
    }
  } else if (
    !audPlayer.paused &&
    audPlayer.volume < maxVolume &&
    !audioStopping
  ) {
    audPlayer.volume += 0.0005;
  } else if (audPlayer.paused && audioStopping) {
    nextTrack();
  }
  // AUDIO

  // FRAME RATE
  frames++;
  if (frames >= 60) {
    frames = 0;
    const tickerFPS = ticker.FPS;
    fpsCounter.innerText = `FPS ${fps} TICKER ${tickerFPS.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )} DELTA ${delta.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    shipCount.innerText = `SHIPS ${fleet.length}`;
  }
  // FRAME RATE

  // PROXIMITY: Used to add hover sprites
  let proxShip;
  let proxStar;
  // PROXIMITY: Used to add hover sprites

  // STARS: Loop through stars. Mark for hover. Display name.
  for (let s = 0; s < universe.length; s++) {
    // universe.forEach(star => {
    if (
      mouse &&
      distanceAndAngleBetweenTwoPoints(
        mouse.x,
        mouse.y,
        universe[s].x,
        universe[s].y
      ).distance < mouseStarProximity
    ) {
      proxStar = universe[s];
    }
    if (selectedStar && universe[s].id === selectedStar.id) {
      if (!universe[s].selected) {
        universe[s].selected = true;
        const starNameOffset = universe[s].message.width + 20;
        let starNameStartY = universe[s].y - 4.5;
        if (universe[s].y <= universe[s].message.height + 5) {
          starNameStartY = universe[s].message.height;
        }
        if (universe[s].y > gamesize.height - 14) {
          starNameStartY = gamesize.height - 10;
        }
        let starNameStartX = universe[s].x + 20;
        if (universe[s].x > gamesize.width - (starNameOffset + 10)) {
          starNameStartX = universe[s].x - starNameOffset;
        }
        if (universe[s].x < starNameOffset + 10) {
          starNameStartX = universe[s].x + 20;
        }
        universe[s].message.position.set(starNameStartX, starNameStartY);
        universe[s].message.resolution = 2;
        universe[s].message.alpha = 0;
        stage.addChild(universe[s].message);
        setTimeout(() => {
          universe[s].message.alpha = 1;
        }, textAlphaDelay);
      }
    } else {
      if (universe[s].selected) {
        universe[s].selected = false;
        stage.removeChild(universe[s].message);
      }
    }
    // });
  }
  if (selectedStar && proxStar) {
    if (
      distanceAndAngleBetweenTwoPoints(
        selectedStar.x,
        selectedStar.y,
        proxStar.x,
        proxStar.y
      ).distance === 0
    ) {
      proxStar = undefined;
    }
  }
  // STARS: Loop through stars. Mark for hover. Display name.

  // SHIPS: Loop through ships. Mark for hover. Display text. Draw line.
  for (let f = 0; f < fleet.length; f++) {
    // fleet.forEach(ship => {
    fleet[f].getTravelData();
    const newShipX =
      fleet[f].coordinates.x + fleet[f].travelData.vector.magnitudeX * delta;
    const newShipY =
      fleet[f].coordinates.y + fleet[f].travelData.vector.magnitudeY * delta;
    const newDirectionX = newShipX > fleet[f].destination.x ? "west" : "east";
    const newDirectionY = newShipY > fleet[f].destination.y ? "north" : "south";
    if (fleet[f].travelling) {
      if (
        newDirectionX !== fleet[f].directionX ||
        newDirectionY !== fleet[f].directionY
      ) {
        fleet[f].distanceToDestination = 0;
        fleet[f].coordinates.x = fleet[f].destination.x;
        fleet[f].coordinates.y = fleet[f].destination.y;
      }

      if (fleet[f].distanceToDestination <= 0) {
        fleet[f].travelling = false;
        fleet[f].getNewDestination();
      } else {
        fleet[f].coordinates = { x: newShipX, y: newShipY };
        fleet[f].sprite.x = newShipX;
        fleet[f].sprite.y = newShipY;
      }
    }
    if (
      mouse &&
      distanceAndAngleBetweenTwoPoints(
        mouse.x,
        mouse.y,
        fleet[f].coordinates.x,
        fleet[f].coordinates.y
      ).distance < mouseProximity
    ) {
      proxShip = fleet[f];
    }
    if (selectedShip && fleet[f].id === selectedShip.id) {
      voyageLine.clear();
      // lock ship to view on each frame
      if (lockShip) {
        centerView(fleet[f].coordinates);
      }
      if (!fleet[f].setSelected) {
        fleet[f].setSelected = true;
        fleet[f].message.alpha = 0;
        fleet[f].statsText.alpha = 0;
        stage.addChild(fleet[f].message);
        stage.addChild(fleet[f].statsText);
        setTimeout(() => {
          fleet[f].message.alpha = 1;
          fleet[f].statsText.alpha = 1;
        }, textAlphaDelay);
      }
      if (showVoyage) {
        voyageLine.moveTo(fleet[f].coordinates.x, fleet[f].coordinates.y);
        voyageLine.lineTo(fleet[f].destination.x, fleet[f].destination.y);
      }
      if (fleet[f].scanning && fleet[f].destinations.length > 0) {
        destinationLine.clear();
        // fleet[f].destinations.forEach(destination => {
        for (let d = 0; d < fleet[f].destinations.length; d++) {
          destinationLine.moveTo(
            fleet[f].coordinates.x,
            fleet[f].coordinates.y
          );
          if (
            distanceAndAngleBetweenTwoPoints(
              fleet[f].destinations[d].x,
              fleet[f].destinations[d].y,
              fleet[f].currentScan.coordinates.x,
              fleet[f].currentScan.coordinates.y
            ).distance <= fleet[f].currentScan.scanRadius
          ) {
            destinationLine.lineTo(
              fleet[f].destinations[d].x,
              fleet[f].destinations[d].y
            );
          }
        }
      }

      if (displayStats) {
        fleet[f].statsText.visible = true;
        fleet[f].message.visible = true;

        // update ship message position and add to stage
        const nameOffset = fleet[f].message.width + 26;
        let nameStartY = newShipY - 4.5;
        if (newShipY <= fleet[f].message.height + 5) {
          nameStartY = fleet[f].message.height;
        }
        if (newShipY > gamesize.height - 14) {
          nameStartY = gamesize.height - 10;
        }
        let nameStartX =
          fleet[f].directionX === "east"
            ? newShipX - nameOffset
            : newShipX + 26;
        if (newShipX > gamesize.width - (nameOffset + 10)) {
          nameStartX = newShipX - nameOffset;
        }
        if (newShipX < nameOffset + 10) {
          nameStartX = newShipX + 26;
        }

        let textStartY;
        let textStartX = newShipX - 20;
        // ADJUST DISPLAY Y
        if (
          (fleet[f].directionY === "north" ||
            newShipY < fleet[f].statsText.height * 1.75) &&
          newShipY < gamesize.height - fleet[f].statsText.height * 1.75
        ) {
          textStartY = newShipY + 20 + 7;
        } else {
          textStartY = newShipY - 20 - fleet[f].statsText.height - 5;
        }
        // ADJUST DISPLAY X
        if (newShipX >= gamesize.width - (fleet[f].statsText.width - 10)) {
          textStartX = gamesize.width - fleet[f].statsText.width - 10;
        }
        if (newShipX <= 30) {
          textStartX = 10;
        }
        fleet[f].statsText.text = `ETA: ${convertTime(
          Math.floor(fleet[f].distanceToDestination / (fleet[f].velocity * 60))
        )}\nDIST: ${renderDistance(fleet[f].distanceToDestination)}\nDEST: ${
          fleet[f].destination.name
        }\nVEL: ${renderVelocity(fleet[f].velocity)}`;
        fleet[f].statsText.position.set(textStartX, textStartY);
        fleet[f].message.position.set(nameStartX, nameStartY);
      } else {
        fleet[f].statsText.visible = false;
        fleet[f].message.visible = false;
      }
    } else {
      if (fleet[f].setSelected) {
        destinationLine.clear();
        voyageLine.clear();
        fleet[f].setSelected = false;
        stage.removeChild(fleet[f].message);
        stage.removeChild(fleet[f].statsText);
      }
    }
  }
  // });
  if (selectedShip && proxShip) {
    if (
      distanceAndAngleBetweenTwoPoints(
        selectedShip.coordinates.x,
        selectedShip.coordinates.y,
        proxShip.coordinates.x,
        proxShip.coordinates.y
      ).distance === 0
    ) {
      proxShip = undefined;
    }
  }
  // SHIPS: Loop through ships. Mark for hover. Display text. Draw line.

  // CONTROL CENTER VIEW SQUARE SPRITE
  if (clearCenterViewSprite) {
    centerViewSprite.alpha -= 0.01;
    if (centerViewSprite.alpha <= 0) {
      centerViewSprite.visible = false;
      clearCenterViewSprite = false;
    }
  }
  // CONTROL CENTER VIEW SQUARE SPRITE

  // CONTROL SHIP HOVER SPRITE
  if (proxShip) {
    hoverSprite.visible = true;
    hoverSprite.x = proxShip.coordinates.x;
    hoverSprite.y = proxShip.coordinates.y;
  } else {
    hoverSprite.visible = false;
  }
  // CONTROL SHIP HOVER SPRITE

  // CONTROL STAR HOVER SPRITE
  if (proxStar) {
    starHoverSprite.visible = true;
    starHoverSprite.x = proxStar.x;
    starHoverSprite.y = proxStar.y;
  } else {
    starHoverSprite.visible = false;
  }
  // CONTROL STAR HOVER SPRITE

  // CONTROL STAR SELECT SPRITE
  if (selectedStar) {
    starSelectionSprite.visible = true;
    starSelectionSprite.x = selectedStar.x;
    starSelectionSprite.y = selectedStar.y;
  } else {
    starSelectionSprite.visible = false;
  }
  // CONTROL STAR SELECT SPRITE

  // CONTROL MOUSE POINTER
  if (!proxStar && !proxShip) {
    canvasWrapper.style.cursor = "default";
  } else {
    canvasWrapper.style.cursor = "pointer";
  }
  // CONTROL MOUSE POINTER

  // CONTROL SHIP SELECTION AND VOYAGE LINE
  if (selectedShip) {
    selectedShipSprite.visible = true;
    selectionSprite.visible = true;
    destinationSprite.visible = true;
    destinationSprite.x = selectedShip.destination.x;
    destinationSprite.y = selectedShip.destination.y;
    selectedShipSprite.x = selectedShip.coordinates.x;
    selectedShipSprite.y = selectedShip.coordinates.y;
    selectionSprite.x = selectedShip.coordinates.x;
    selectionSprite.y = selectedShip.coordinates.y;
    selectionSprite.rotation += 0.01;
  } else {
    selectedShipSprite.visible = false;
    destinationSprite.visible = false;
    selectionSprite.visible = false;
  }
  // CONTROL SHIP SELECTION AND VOYAGE LINE
  if (Object.keys(scans).length > 0) {
    Object.values(scans).forEach(scan => {
      if (activeScans[scan.id] === undefined) {
        activeScans[scan.id] = scan;
        scanLayer.addChild(scan.graphics);
      }
      scan.graphics.clear();
      scan.graphics.alpha = 1 - scan.scanRadius / scan.scanRange;
      scan.graphics.drawCircle(
        scan.coordinates.x,
        scan.coordinates.y,
        scan.scanRadius
      );
      scan.scanRadius += scan.scanSpeed * delta;
      if (scan.scanRadius >= scan.scanRange || scan.graphics.alpha <= 0) {
        scanLayer.removeChild(scan.graphics);
        fleetMap[scan.shipID].scanning = false;
        delete scans[scan.id];
        delete activeScans[scan.id];
      }
    });
  }
}
