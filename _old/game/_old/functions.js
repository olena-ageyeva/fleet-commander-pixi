// ENGINE AND UTIL FUNCTIONS

import { fleet, universe } from "./main";
import { Ship } from "./ship";
import { Star } from "./star";

// CENTER THE RENDER VIEW IN THE FRAME
export function centerView(coords, centerShip) {
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
      setLockShip(true);
    }, 250);
  }
}

export function checkProximity(distance, origin, target) {
  if (
    origin.x - target.x < distance &&
    origin.x - target.x > distance * -1 &&
    origin.y - target.y < distance &&
    origin.y - target.y > distance * -1
  ) {
    return true;
  }
  return false;
}

// GET DISTANCE AND ANGLE BETWEEN 2 POINTS
export function distanceAndAngleBetweenTwoPoints(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: (Math.atan2(y, x) * 180) / Math.PI
  };
}

// GENERATE A FLEET
export function generateFleet(fleetSize) {
  new Array(fleetSize).fill(undefined).map((value, index) => {
    fleet.push(makeShip(index));
  });
}

// GENERATE THE UNIVERSE
export function generateUniverse(size, density, proximity) {
  const totalStars = Math.floor((size.width * size.height) / density);
  for (let i = 0; i < totalStars; i++) {
    let newStarCoords;
    if (i === 0) {
      universe.stars.push(
        new Star(
          `STAR - ${i + 1}`,
          getRandomWholeNumber(10, size.width),
          getRandomWholeNumber(10, size.height)
        )
      );
    } else {
      let tries = 0;
      while (newStarCoords === undefined) {
        let prox = false;
        const someCoords = {
          x: getRandomWholeNumber(10, size.width),
          y: getRandomWholeNumber(10, size.height)
        };

        for (let s = 0; s < universe.stars.length; s++) {
          if (checkProximity(proximity, someCoords, universe.stars[s])) {
            tries++;
            if (tries > universe.starAttempts) {
              throw new Error("universe limits too tight");
            }
            prox = true;
            break;
          }
        }
        if (!prox) {
          newStarCoords = someCoords;
        }
      }
      universe.stars.push(
        new Star(`STAR - ${i + 1}`, newStarCoords.x, newStarCoords.y)
      );
    }
  }
}

// GET A RANDOM STAR. ACCEPTS A LIMIT.
export function getRandomStar(limit) {
  if (limit && limit.distance > 0) {
    const limitedStars = universe.stars.filter(limitStar =>
      checkProximity(limit.distance, limitStar, limit.origin)
    );
    const newStar =
      limitedStars[getRandomWholeNumber(0, limitedStars.length - 1)];
    return newStar;
  }
  return universe.stars[getRandomWholeNumber(0, universe.stars.length - 1)];
}

// GET A RANDOM WHOLE NUMBER BETWEEN PROVIDED MIN AND MAX
export function getRandomWholeNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getStarRadius() {
  const starSizes = [1.4, 1.75, 1.9, 2.25, 2.5];

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

// generates ships
export function makeShip(index) {
  const range = 100;
  const name = `${index % 2 === 0 ? "SHIP" : "ANOTHER SHIP"}-${index + 1}`;
  const origin = getRandomStar();
  const destination = getRandomStar({ distance: range, origin });
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

// TOGGLE VOYAGE LINE DRAWING
export function toggleVoyage() {
  showVoyage = !showVoyage;
  voyageLine.clear();
}

// CREATES VECTOR OBJECT
export function Vector(magnitude, angle) {
  var angleRadians = (angle * Math.PI) / 180;

  this.magnitudeX = magnitude * Math.cos(angleRadians);
  this.magnitudeY = magnitude * Math.sin(angleRadians);
}
