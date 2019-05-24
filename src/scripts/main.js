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

  // FPS
  // const fpsNow = performance.now();
  // while (times.length > 0 && times[0] <= fpsNow - 1000) {
  //   times.shift();
  // }
  // times.push(fpsNow);
  // fps = times.length;
  // FPS

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
    // const fps = ticker.FPS;
    fpsCounter.innerText = `FPS ${fps}`;
    shipCount.innerText = `SHIPS ${fleet.length}`;
  }
  // FRAME RATE

  // PROXIMITY: Used to add hover sprites
  let proxShip;
  let proxStar;
  // PROXIMITY: Used to add hover sprites

  // STARS: Loop through stars. Mark for hover. Display name.
  universe.forEach(star => {
    if (
      mouse &&
      distanceAndAngleBetweenTwoPoints(mouse.x, mouse.y, star.x, star.y)
        .distance < mouseStarProximity
    ) {
      proxStar = star;
    }
    if (selectedStar && star.id === selectedStar.id) {
      if (!star.selected) {
        star.selected = true;
        const starNameOffset = star.message.width + 20;
        let starNameStartY = star.y - 4.5;
        if (star.y <= star.message.height + 5) {
          starNameStartY = star.message.height;
        }
        if (star.y > gamesize.height - 14) {
          starNameStartY = gamesize.height - 10;
        }
        let starNameStartX = star.x + 20;
        if (star.x > gamesize.width - (starNameOffset + 10)) {
          starNameStartX = star.x - starNameOffset;
        }
        if (star.x < starNameOffset + 10) {
          starNameStartX = star.x + 20;
        }
        star.message.position.set(starNameStartX, starNameStartY);
        star.message.resolution = 2;
        star.message.alpha = 0;
        stage.addChild(star.message);
        setTimeout(() => {
          star.message.alpha = 1;
        }, textAlphaDelay);
      }
    } else {
      if (star.selected) {
        star.selected = false;
        stage.removeChild(star.message);
      }
    }
  });
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
  fleet.forEach(ship => {
    ship.getTravelData();
    const newShipX =
      ship.coordinates.x + ship.travelData.vector.magnitudeX * delta;
    const newShipY =
      ship.coordinates.y + ship.travelData.vector.magnitudeY * delta;
    const newDirectionX = newShipX > ship.destination.x ? "west" : "east";
    const newDirectionY = newShipY > ship.destination.y ? "north" : "south";
    if (ship.travelling) {
      if (
        newDirectionX !== ship.directionX ||
        newDirectionY !== ship.directionY
      ) {
        ship.distanceToDestination = 0;
        ship.coordinates.x = ship.destination.x;
        ship.coordinates.y = ship.destination.y;
      }

      if (ship.distanceToDestination <= 0) {
        ship.travelling = false;
        ship.getNewDestination();
      } else {
        ship.coordinates = { x: newShipX, y: newShipY };
        ship.sprite.x = newShipX;
        ship.sprite.y = newShipY;
      }
    }
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
    if (selectedShip && ship.id === selectedShip.id) {
      voyageLine.clear();
      // lock ship to view on each frame
      if (lockShip) {
        centerView(ship.coordinates);
      }
      if (!ship.setSelected) {
        ship.setSelected = true;
        ship.message.alpha = 0;
        ship.statsText.alpha = 0;
        stage.addChild(ship.message);
        stage.addChild(ship.statsText);
        setTimeout(() => {
          ship.message.alpha = 1;
          ship.statsText.alpha = 1;
        }, textAlphaDelay);
      }
      if (showVoyage) {
        voyageLine.moveTo(ship.coordinates.x, ship.coordinates.y);
        voyageLine.lineTo(ship.destination.x, ship.destination.y);
      }
      if (ship.scanning && ship.destinations.length > 0) {
        destinationLine.clear();
        ship.destinations.forEach(destination => {
          destinationLine.moveTo(ship.coordinates.x, ship.coordinates.y);
          if (
            distanceAndAngleBetweenTwoPoints(
              destination.x,
              destination.y,
              ship.currentScan.coordinates.x,
              ship.currentScan.coordinates.y
            ).distance <= ship.currentScan.scanRadius
          ) {
            destinationLine.lineTo(destination.x, destination.y);
          }
        });
      }

      if (displayStats) {
        ship.statsText.visible = true;
        ship.message.visible = true;

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
        ship.statsText.text = `ETA: ${convertTime(
          Math.floor(ship.distanceToDestination / (ship.velocity * 60))
        )}\nDIST: ${renderDistance(ship.distanceToDestination)}\nDEST: ${
          ship.destination.name
        }\nVEL: ${renderVelocity(ship.velocity)}`;
        ship.statsText.position.set(textStartX, textStartY);
        ship.message.position.set(nameStartX, nameStartY);
      } else {
        ship.statsText.visible = false;
        ship.message.visible = false;
      }
    } else {
      if (ship.setSelected) {
        destinationLine.clear();
        voyageLine.clear();
        ship.setSelected = false;
        stage.removeChild(ship.message);
        stage.removeChild(ship.statsText);
      }
    }
  });
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
      scan.scanRadius += scan.scanSpeed;
      if (scan.scanRadius >= scan.scanRange || scan.graphics.alpha <= 0) {
        scanLayer.removeChild(scan.graphics);
        delete scans[scan.id];
        delete activeScans[scan.id];
      }
    });
  }
}
