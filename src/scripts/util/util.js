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
  const image = renderer.extract.image(starContainer);
  image.id = "voyage_image";
  document.body.appendChild(image);
  setTimeout(() => {
    document.body.removeChild(document.getElementById("voyage_image"));
  }, 5000);
}

function toggleVoyage() {
  showVoyage = !showVoyage;
  voyageLine.clear();
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

function makeShip(index) {
  const range = 50 * 60;
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
  // const starSizes = [2, 2.5, 3, 4, 5];
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
  let remainingSeconds = parseInt(seconds, 10);
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
  // 5878625373183.61 miles per light year
  // 60 pixels per light year
  return ((distance / 60) * 5878625373183.61).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

const panSpeed = 250;
function centerView(coords, centerShip) {
  if (lockShip === true) {
    canvasWrapper.style.transition = `none`;
  } else {
    canvasWrapper.style.transition = `transform ${panSpeed}ms linear`;
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
    }, panSpeed);
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
  lockShip = false;
  const newCanvasX = canvasPos.x + directions[direction].x;
  const maxCanvasX = (gamesize.width - gameContainerSize.width) * -1;
  const newCanvasY = canvasPos.y + directions[direction].y;
  const maxCanvasY = (gamesize.height - gameContainerSize.height) * -1 - 4;

  canvasPos.x =
    newCanvasX > 0 ? 0 : newCanvasX < maxCanvasX ? maxCanvasX : newCanvasX;
  canvasPos.y =
    newCanvasY > 0 ? 0 : newCanvasY < maxCanvasY ? maxCanvasY : newCanvasY;
  canvasWrapper.style.transform = `translate(${canvasPos.x}px,${
    canvasPos.y
  }px)`;
  panning = window.requestAnimationFrame(mil => panMap(direction));
}

function stopMapPan() {
  window.cancelAnimationFrame(panning);
}
