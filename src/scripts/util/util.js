function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function takeSnapshot() {
  const rStars = [...universe];
  const starCircles = [];
  rStars.forEach(rStar => {
    const starCircle = new Graphics();
    // starCircle.beginFill(0x70ffe9, 1);
    starCircle.drawCircle(rStar.x, rStar.y, 5);
    // starCircle.endFill();
    voyageLayer.addChild(starCircle);
    starCircles.push(starCircle);
  });
  while (rStars.length > 0) {
    const currentStar = rStars[0];
    const closeStars = rStars.filter(
      cStar =>
        distanceAndAngleBetweenTwoPoints(
          currentStar.x,
          currentStar.y,
          cStar.x,
          cStar.y
        ).distance <=
        pixelsPerLightYear * 2
    );
    closeStars.forEach(cStar => {
      voyageLine.moveTo(currentStar.x, currentStar.y);
      voyageLine.lineTo(cStar.x, cStar.y);
    });
    rStars.shift();
  }
  const image = renderer.extract.image(voyageLayer);
  showVoyage = false;
  voyageLine.clear();
  starCircles.forEach(starCircle => starCircle.destroy());
  image.id = "voyage_image";
  document.body.appendChild(image);
  setTimeout(() => {
    document.body.removeChild(document.getElementById("voyage_image"));
  }, 5000);
}

function setVoyage(on) {
  voyageLine.clear();
  if (on) {
    showVoyage = true;
    voyageToggle.classList.add("active");
  } else {
    showVoyage = false;
    voyageToggle.classList.remove("active");
  }
}

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
    let newStar;
    newStar = limitedStars[getRandomWholeNumber(0, limitedStars.length - 1)];
    return newStar;
  }
  return universe[getRandomWholeNumber(0, universe.length - 1)];
}

function rand(length, ...ranges) {
  let str = ""; // the string (initialized to "")
  while (length--) {
    // repeat this length of times
    const ind = Math.floor(Math.random() * ranges.length); // get a random range from the ranges object
    const min = ranges[ind][0].charCodeAt(0), // get the minimum char code allowed for this range
      max = ranges[ind][1].charCodeAt(0); // get the maximum char code allowed for this range
    const c = Math.floor(Math.random() * (max - min + 1)) + min; // get a random char code between min and max
    str += String.fromCharCode(c); // convert it back into a character and append it to the string str
  }
  return str; // return str
}

function generateStarName() {
  return `${rand(3, ["A", "Z"])}-${rand(4, ["G", "K"], ["0", "9"])}-${rand(2, [
    "A",
    "Z"
  ])}`;
}

function getRandomArrayElement(array) {
  return array[getRandomWholeNumber(0, array.length - 1)];
}

function makeShip(index) {
  const origin = getRandomStar();
  const destination = getRandomStar({ distance: shipRange, origin });
  const name = `${getRandomArrayElement(
    shipNamePrefixes
  )} ${getRandomArrayElement(shipNames)}`;
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
    shipRange
  );
  return newShip;
}

function generateFleet() {
  const fleet = new Array(fleetSize).fill(undefined).map((value, index) => {
    return makeShip(index);
  });
  return fleet;
}

function getStarCoordinate(size) {
  return {
    x: getRandomWholeNumber(starEdgeDistance, size.width),
    y: getRandomWholeNumber(starEdgeDistance, size.height)
  };
}

function generateUniverse(size, density) {
  const stars = Math.floor((size.width * size.height) / density);
  const starCoords = [];
  for (let i = 0; i < stars; i++) {
    if (i === 0) {
      const newCoordinate = getStarCoordinate(size);
      starCoords.push(new Star(newCoordinate.x, newCoordinate.y));
    } else {
      let newCoordinate = undefined;
      let tries = 0;
      while (newCoordinate === undefined) {
        newCoordinate = getStarCoordinate(size);
        for (let s = 0; s < starCoords.length; s++) {
          tries++;
          if (tries > starAttempts) {
            throw new Error(starCoords.length);
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
      starCoords.push(new Star(newCoordinate.x, newCoordinate.y));
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
  // const starSizes = [2, 4, 4, 4, 4];
  const starSizes = [4, 4, 4, 4, 4];

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

function convertTime(seconds) {
  let remainingSeconds = seconds;
  const days = Math.floor(remainingSeconds / (3600 * 24));
  const dayDisplay = days < 10 ? `0${days}` : days;
  remainingSeconds -= days * 3600 * 24;
  const hours = Math.floor(remainingSeconds / 3600);
  const hourDisplay = hours < 10 ? `0${hours}` : hours;
  remainingSeconds -= hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const minuteDisplay = minutes < 10 ? `0${minutes}` : minutes;
  remainingSeconds -= minutes * 60;
  const remainingSecondDisplay =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${dayDisplay}:${hourDisplay}:${minuteDisplay}:${remainingSecondDisplay}`;
}

function renderDistance(distance) {
  return `${((distance / pixelsPerLightYear) * lightYear).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  )} mi`;
  return distance;
}

function renderVelocity(velocity) {
  const mis = velocity * 60 * (lightYear / pixelsPerLightYear);
  const c = mis / lightSecond;
  const velDisplay = c >= 1 ? c : mis;
  return `${velDisplay.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${c >= 1 ? "c" : "mi/s"}`;
}

function centerView(coords, centerShip) {
  if (lockShip === true) {
    canvasWrapper.style.transition = `none`;
  } else {
    canvasWrapper.style.transition = `transform ${panSpeed}ms ease-in-out`;
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
  if (centerShip && autoLock) {
    setTimeout(() => {
      setLockShip(true);
    }, panSpeed);
  }
}

function setLockShip(lock) {
  if (lock) {
    lockShip = true;
    shipLock.classList.add("active");
  } else {
    lockShip = false;
    shipLock.classList.remove("active");
  }
}

let panning;
function panMap(direction) {
  const panStep = 10;
  const directions = {
    topLeft: { x: panStep, y: panStep },
    top: { x: 0, y: panStep },
    topRight: { x: panStep * -1, y: panStep },
    right: { x: panStep * -1, y: 0 },
    bottomRight: { x: panStep * -1, y: panStep * -1 },
    bottom: { x: 0, y: panStep * -1 },
    bottomLeft: { x: panStep, y: panStep * -1 },
    left: { x: panStep, y: 0 }
  };
  const newCanvasX = canvasPos.x + directions[direction].x;
  const maxCanvasX = (gamesize.width - gameContainerSize.width) * -1;
  const newCanvasY = canvasPos.y + directions[direction].y;
  const maxCanvasY = (gamesize.height - gameContainerSize.height) * -1 - 4;

  canvasPos.x =
    newCanvasX > 0 ? 0 : newCanvasX < maxCanvasX ? maxCanvasX : newCanvasX;
  canvasPos.y =
    newCanvasY > 0 ? 0 : newCanvasY < maxCanvasY ? maxCanvasY : newCanvasY;
  setLockShip(false);
  canvasWrapper.style.transition = `none`;
  canvasWrapper.style.transform = `translate(${canvasPos.x}px,${
    canvasPos.y
  }px)`;
  panning = window.requestAnimationFrame(mil => panMap(direction));
}

function stopMapPan() {
  window.cancelAnimationFrame(panning);
}

function newMission() {
  if (selectedShip !== undefined) {
    selectedShip.getNewDestination();
  }
}

function startShipScan() {
  if (selectedShip) {
    const scanCircle = new Graphics();
    scanCircle.lineStyle(2, 0x70ffe9);

    const newScan = {
      coordinates: selectedShip.coordinates,
      scanRange: selectedShip.scanRange,
      scanRadius: 0,
      scanSpeed: selectedShip.scanSpeed,
      shipID: selectedShip.id,
      graphics: scanCircle,
      id: generateUUID()
    };
    selectedShip.scanForDestinations(newScan);
    scans[newScan.id] = newScan;
  }
}

function setShipStats(on) {
  displayStats = on;
  if (displayStats) {
    shipStatsDisplay.classList.add("active");
  } else {
    shipStatsDisplay.classList.remove("active");
  }
}
