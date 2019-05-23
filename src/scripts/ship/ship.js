class Ship {
  constructor(destination, distanceToDestination, name, origin, range) {
    this.baseVelocity = baseShipSpeed;
    this.coordinates = { x: origin.x, y: origin.y };
    this.cSpeed = 10000;
    this.destination = destination;
    this.directionX = origin.x > destination.x ? "west" : "east";
    this.directionY = origin.y > destination.y ? "north" : "south";
    this.distanceToDestination = distanceToDestination;
    this.id = generateUUID();
    this.name = name;
    this.origin = origin;
    this.range = range;
    this.setSelected = false;
    this.travelData = {};
    this.travelling = true;
    this.velocity = this.baseVelocity * baseSpeedMultiplier * this.cSpeed; // 1: 1 pixel per second base
    this.voyages = [{ origin, destination }];
    this.getTravelData = this.getTravelData.bind(this);
    this.getNewDestination = this.getNewDestination.bind(this);
  }

  getTravelData() {
    const distanceAndAngle = distanceAndAngleBetweenTwoPoints(
      this.coordinates.x,
      this.coordinates.y,
      this.destination.x,
      this.destination.y
    );
    this.travelData.angle = distanceAndAngle.angle;
    this.travelData.totalDistance = distanceAndAngle.distance;
    this.distanceToDestination = distanceAndAngle.distance;
    this.travelData.vector = new Vector(this.velocity, this.travelData.angle);
  }

  getNewDestination() {
    this.origin = this.coordinates;
    this.destination = getRandomStar({
      distance: this.range,
      origin: this.origin
    });
    this.directionX = this.origin.x > this.destination.x ? "west" : "east";
    this.directionY = this.origin.y > this.destination.y ? "north" : "south";
    if (this.voyages.length > 100) {
      this.voyages.shift();
    }
    this.travelling = true;
  }
}
