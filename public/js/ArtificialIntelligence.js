'use strict';

/**
 * hold all the ships and asteroid references
 */
class HandleObjects
{

    constructor(widthStarSystem, heightStarSystem)
    {
        //width of the
        this._widthStarSystem = widthStarSystem;
        //height of the system
        this._heightStarSystem = heightStarSystem;
        //array with cargo ship references
        this._allCargoShips = [];
        //array with pirate ship refereces
        this._allPirateShips = [];
        //array with asteroid references
        this._allAsteroids = [];
    }

    /**
     * go through every ship and calculate the next step
     * @constructor
     */
    ComputeNextStep()
    {
        this._allCargoShips.forEach(function (element, index)
        {
            element.ResetHits();
            element.NextMove();
        });

        this._allPirateShips.forEach(function (element, index)
        {
            //console.log('bb');
            element.NextMove();
        });
    }

    /**
     * Add a cargoship
     * @param {Number} curTonnage
     * @param {Number} maxTonnage
     * @param {Number} id
     * @param {Number} xPosition
     * @param {Number} yPosition
     * @param {String} color
     * @constructor
     */
    AddCargoShip(curTonnage, maxTonnage, id, xPosition, yPosition, color)
    {
        var ship = new CargoShip(curTonnage, maxTonnage, id, xPosition, yPosition, color, this);
        this._allCargoShips.push(ship);
    }

    /**
     * Add a pirate ship
     * @param {Number} curTonnage
     * @param {Number} maxTonnage
     * @param {Number} id
     * @param {Number} xPosition
     * @param {Number} yPosition
     * @param {String} color
     * @constructor
     */
    AddPirateShip(curTonnage, maxTonnage, id, xPosition, yPosition, color)
    {
        var ship = new PirateShip(curTonnage, maxTonnage, id, xPosition, yPosition, color, this);
        this._allPirateShips.push(ship);
    }

    /**
     * Add an asteroid
     * @param {Asteroid} asteroid
     * @constructor
     */
    AddAsteroid(asteroid)
    {
        this._allAsteroids.push(asteroid);
    }

    /**
     * Get Asteroid by Id
     * @param {Number} id
     * @returns {Asteroid}
     * @constructor
     */
    GetAsteroidById(id)
    {
        var returnValue = null;

        this._allAsteroids.forEach(function (element, index)
        {
            if(element.GetId() == id)
            {
                returnValue = element;
            }
        });

        return returnValue;
    }

    /**
     * Getter for all Cargoships
     * @returns {Asteroid[]}
     * @constructor
     */
    GetAllAsteroids()
    {
        return this._allAsteroids;
    }

    /**
     * Get all cargo ships
     * @returns {CargoShip[]}
     * @constructor
     */
    GetAllCargoShips()
    {
        return this._allCargoShips;
    }

    /**
     * Get all pirate ships
     * @returns {PirateShip[]}
     * @constructor
     */
    GetAllPirateShips()
    {
        return this._allPirateShips;
    }

    /**
     * Get cargo ship by id
     * @param {Number} id
     * @returns {CargoShip}
     * @constructor
     */
    GetCargoShipById(id)
    {
        var returnValue = null;

        this._allCargoShips.forEach(function (element, index)
        {
            if(element.GetId() == id)
            {
                returnValue = element;
            }
        });

        return returnValue;
    }

    /**
     *  Get Pirate Ship By Id
     * @param {Number} id
     * @returns {PirateShip}
     * @constructor
     */
    GetPirateShipById(id)
    {
        var returnValue = null;

        this._allPirateShips.forEach(function (element, index)
        {
            if(element.GetId() == id)
            {
                returnValue = element;
            }
        });

        return returnValue;
    }


    /**
     * Get Width Star System
     * @returns {Number}
     * @constructor
     */
    GetWidthStarSystem()
    {
        return this._widthStarSystem;
    }


    /**
     * Get Height of Star System
     * @returns {*}
     * @constructor
     */
    GetHeightStarSystem()
    {
        return this._heightStarSystem;
    }

}

/**
 * basic ship intelligence
 */
class IntelligenceShip
{
    constructor(handleObjects, ship)
    {
        this._handleObjects = handleObjects;
        this._targetPosition = new Point(0, 0);
        this._activity = 'subclass_intialize_me';
        this._ship = ship;
    }

    //get closest asteroid to ship
    static GetNearestAsteroid(asteroids, ship)
    {
        var minDistance = 5000000;
        var minDistanceAsteroid;
        asteroids.forEach(function (element, index)
        {
            var dist = Sensor.GetDistance(element, ship);
            if(dist < minDistance)
            {
                minDistance = dist;
                minDistanceAsteroid = element;
            }
        });
        return minDistanceAsteroid;
    }

    GetActivity()
    {
        return this._activity;
    }

    SetActivity(activity)
    {
        this._activity = activity;
    }
}

/**
 * AI for Cargo Ship
 */
class IntelligenceShipCargo extends IntelligenceShip
{
    /**
     * Constructor
     * @param {CargoShip} cargoShip -Ship object
     * @param {HandleObjects} handleObjects -Handle Objects
     */
    constructor(cargoShip, handleObjects)
    {
        super(handleObjects,cargoShip);
        this._cargoShip = cargoShip;
        this._activity = 'find_asteroid';
        this._targetAsteroid = -1;
    }

    /**
     * Calculate Next Step
     */
    NextMove()
    {
        var pirateShipsInRange = Sensor.GetShipsInRange(this._handleObjects.GetAllPirateShips(), this._cargoShip);


        if(this._activity.indexOf('fly_to_escape') > -1)
        {
            Movement.MoveTo(this._cargoShip, this._targetPosition);
            if(Sensor.GetDistanceFromPointToPoint(this._cargoShip.GetCoordinateCenter(), this._targetPosition) < this._cargoShip.GetSpeed())
            {
                this._activity = 'fly_to_random';
            }
        }
        else if(pirateShipsInRange.length > 0)
        {
            this._targetPosition = Movement.GetPointFromRect(this._cargoShip.GetBodyRect(), pirateShipsInRange[0].GetBodyRect(), 1200);
            this._activity = 'fly_to_escape';

        }
        else if(this._activity.indexOf('fly_to_random') > -1)
        {
            var asteroidsInRange = Sensor.GetAsteroidsInRange(this._handleObjects.GetAllAsteroids(), this._cargoShip);

            //any asteroids in sight?
            if(asteroidsInRange.length > 0)
            {
                var closestAsteroid = IntelligenceShip.GetNearestAsteroid(asteroidsInRange, this._cargoShip);

                //closest asteroid found?
                if(closestAsteroid != undefined)
                {
                    this._targetPosition = Movement.GetPointFromRect(this._cargoShip.GetBodyRect(), closestAsteroid.GetBodyRect(), 100);
                    this._activity = 'fly_to_harvest';
                    //console.log('ship ' + this._cargoShip.GetId() + ': Fly to asteroid.');
                }
                else
                {
                    console.log('error with asteroid');
                }
            }
            //reached target?
            else if(Sensor.GetDistanceFromPointToPoint(this._cargoShip.GetCoordinateCenter(), this._targetPosition) < this._cargoShip.GetSpeed())
            {
                //console.log('ship ' + this._cargoShip.GetId() + ': Target position reached, change target position.');
                var x = Math.floor((Math.random() * this._handleObjects.GetWidthStarSystem()) + 1);
                var y = Math.floor((Math.random() * this._handleObjects.GetHeightStarSystem()) + 1);
                this._targetPosition = new Point(x, y);
            }
            else
            {
                Movement.MoveTo(this._cargoShip, this._targetPosition);
            }
        }
        else if(this._activity.indexOf('fly_to_harvest') > -1)
        {
            //target reached?
            if(Sensor.GetDistanceFromPointToPoint(this._cargoShip.GetCoordinateCenter(), this._targetPosition) < this._cargoShip.GetSpeed())
            {
                //console.log('a');
                //console.log('ship ' + this._cargoShip.GetId() + ': Target position reached, start harvesting.');
                this._activity = 'harvesting';
            }
            else
            {
                //console.log('b');
                Movement.MoveTo(this._cargoShip, this._targetPosition);
            }
        }
        else if(this._activity.indexOf('find_asteroid') > -1)
        {
            var asteroidsInRange = Sensor.GetAsteroidsInRange(this._handleObjects.GetAllAsteroids(), this._cargoShip);

            //any asteroids in sight?
            if(asteroidsInRange.length > 0)
            {
                var closestAsteroid = IntelligenceShip.GetNearestAsteroid(asteroidsInRange, this._cargoShip);

                //closest asteroid found?
                if(closestAsteroid != undefined)
                {
                    this._targetPosition = Movement.GetPointFromRect(this._cargoShip.GetBodyRect(), closestAsteroid.GetBodyRect(), 100);
                    this._activity = 'fly_to_harvest';
                    //console.log('ship ' + this._cargoShip.GetId() + ': Fly to asteroid.');
                }
                else
                {
                    console.log('error with asteroid');
                }
            }
            else
            {
                var x = Math.floor((Math.random() * this._handleObjects.GetWidthStarSystem()) + 1);
                var y = Math.floor((Math.random() * this._handleObjects.GetHeightStarSystem()) + 1);
                this._targetPosition = new Point(x, y);
                this._activity = 'find_asteroid_fly_to_random';
                //console.log('ship ' + this._cargoShip.GetId() + ': no asteroids in sight. Choose new coordinates to fly to.');
            }
        }
        else
        {
            if(!(this._activity == 'harvesting'))
                this._activity = 'fly_to_random';
        }
    }
}


/**
 * AI for Pirate Ship
 */
class IntelligenceShipPirate extends IntelligenceShip
{
    /**
     * Constructor
     * @param {PirateShip} pirateShip -Ship object
     * @param {HandleObjects} handleObjects -Handle Objects
     */
    constructor(pirateShip, handleObjects)
    {
        super(handleObjects, pirateShip);

        this._pirateShip = pirateShip;
        this._activity = 'fly_hunting';
        this._shipToHunt = -1;
        //every fifth pirate is a boss character, they will try to find other pirates to rule
        this._bossIntelligence = (Math.floor((Math.random() * 5) + 1) == 1);
        this._masterShipId = -1;
        this._groupAction = (this._bossIntelligence) ? new GroupAction([this._pirateShip.GetId()], this._pirateShip.GetId()) : null;
    }

    /**
     * Is this Ship member in a group?
     * @returns {boolean}
     * @constructor
     */
    HasGroup()
    {
        return (this._groupAction != null);
    }

    /**
     * Is this ship a Master AI?
     * @returns {boolean}
     * @constructor
     */
    IsMaster()
    {
        return this._bossIntelligence;
    }

    /**
     * fly to a random position, change action if something on the way is in sight (sensor range)
     */
    MoveToRandom()
    {
        var cargoShipsInRange = Sensor.GetShipsInRange(this._handleObjects.GetAllCargoShips(), this._pirateShip);

        //console.log(this._targetPosition.GetX() + ' ' +this._targetPosition.GetY() + ' ' + this._pirateShip.GetCoordinateCenter().GetX() + ' ' + this._pirateShip.GetCoordinateCenter().GetY());
        //any ships in sight?
        if(cargoShipsInRange.length > 0)
        {
            var closestShip = IntelligenceShip.GetNearestAsteroid(cargoShipsInRange, this._pirateShip);

            //closest ship found?
            if(closestShip != undefined)
            {
                this._targetPosition = Movement.GetPointFromRect(this._pirateShip.GetBodyRect(), closestShip.GetBodyRect(), this._pirateShip.GetWeaponRange() - 30);
                this._activity = 'fly_hunting';
                this._shipToHunt = closestShip.GetId();
                //console.log('ship ' + this._cargoShip.GetId() + ': Fly to asteroid.');
            }
            else
            {
                this._activity = 'hunting_error';
                console.log('error with ship');
            }
        }
        //reached random coords, new coords?
        //else if(this._targetPosition == this._pirateShip.GetCoordinateCenter())
        else if(Movement.Difference(this._targetPosition.GetX(), this._pirateShip.GetCoordinateCenter().GetX()) < 3 && Movement.Difference(this._targetPosition.GetY(), this._pirateShip.GetCoordinateCenter().GetY()) < 3)
        {
            var x = Math.floor((Math.random() * this._handleObjects.GetWidthStarSystem()) + 1);
            var y = Math.floor((Math.random() * this._handleObjects.GetHeightStarSystem()) + 1);
            this._targetPosition = new Point(x, y);
            this._activity = 'fly_hunting';
        }




        Movement.MoveTo(this._ship, this._targetPosition);
    }

    /**
     * Calculate Next Step
     */
    NextMove()
    {
        //is this ship a boss intelligence? search for slaves, refresh group contract
        if(this._bossIntelligence)
        {
            var pirateShipsInRange = Sensor.GetShipsInRange(this._handleObjects.GetAllPirateShips(), this._pirateShip);
            var groupAction = this._groupAction;
            groupAction.SetActivity('slave_' + this._activity);
            groupAction.SetShipToHunt(this._shipToHunt);
            groupAction.SetTargetPosition(this._targetPosition);

            pirateShipsInRange.forEach(function (element, index)
            {
                if(!element.HasGroup())
                {
                    groupAction.AddMemberId(element.GetId());
                    element.SetGroup(groupAction);
                    element.SetActivity('slave_hunting');
                }


            });
        }

        if(this._activity.indexOf('slave') > -1)
        {
            if(this._groupAction.GetActivity() != null)
            {
                this._activity = this._groupAction.GetActivity();
            }


            if(this._groupAction.GetShipToHunt() != null)
            {
                this._shipToHunt = this._groupAction.GetShipToHunt();
            }


            var masterShip = this._handleObjects.GetPirateShipById(this._groupAction.GetBossId());

            if(masterShip == null)
            {
                console.log('mastership is gone');
                this._activity = 'hunting';
            }
            else if(this._activity.indexOf('follow') > -1)
            {
                this._targetPosition = Movement.GetPointFromRect(this._pirateShip.GetBodyRect(), masterShip.GetBodyRect(), 100);
                Movement.MoveTo(this._pirateShip, this._targetPosition);
            }

        }


        if(this._activity.indexOf('hunting') > -1)
        {
            var shiptoHuntObject = this._handleObjects.GetCargoShipById(this._shipToHunt);

            //ship to hunt vanished?
            if(shiptoHuntObject === null)
            {
                if(!(this._activity.indexOf('slave') > -1))
                {
                    this.MoveToRandom();
                }
                else
                {
                    this._targetPosition = Movement.GetPointFromRect(this._pirateShip.GetBodyRect(), masterShip.GetBodyRect(), 100);
                    Movement.MoveTo(this._pirateShip, this._targetPosition);
                }
            }
            //target ship not in sensor range?
            else if(!Sensor.ShipIsInSensorRange(this._pirateShip, shiptoHuntObject))
            {
                if(!(this._activity.indexOf('slave') > -1))
                {
                    this._shipToHunt = -1;
                    this.MoveToRandom();
                }
                else
                {
                    this._targetPosition = Movement.GetPointFromRect(this._pirateShip.GetBodyRect(), masterShip.GetBodyRect(), 100);
                    Movement.MoveTo(this._pirateShip, this._targetPosition);
                }

            }
            //weapon range? no? fly closer
            else if(!Sensor.ShipIsInWeaponRange(this._pirateShip, shiptoHuntObject))
            {
                this._targetPosition = Movement.GetPointFromRect(this._pirateShip.GetBodyRect(), shiptoHuntObject.GetBodyRect(), this._pirateShip.GetWeaponRange() - 30);
                Movement.MoveTo(this._pirateShip, this._targetPosition);
                this._activity = (this._activity.indexOf('slave') > -1) ? 'slave_fly_hunting' : 'fly_hunting';
            }
            else
            {
                this._targetPosition = Movement.GetPointFromRect(this._pirateShip.GetBodyRect(), shiptoHuntObject.GetBodyRect(), this._pirateShip.GetWeaponRange() - 30);
                Movement.MoveTo(this._pirateShip, this._targetPosition);
                this._activity = (this._activity.indexOf('slave') > -1) ? 'slave_fly_hunting_shoot' : 'fly_hunting_shoot';
            }
        }
    }

    /**
     * Set a new Group Action
     * @param {GroupAction} groupAction
     * @constructor
     */
    SetGroup(groupAction)
    {
        this._groupAction = groupAction;
    }

    /**
     * Set a new Ship Id To Hunt
     * @param {Number} shipToHunt
     * @constructor
     */
    SetShipToHunt(shipToHunt)
    {
        this._shipToHunt = shipToHunt;
    }
}