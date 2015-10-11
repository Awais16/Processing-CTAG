'use strict';

class Sensor
{

    /**
     * returns all asteroid objects that are in range of the ship
     * @param {Asteroid[]} asteroids
     * @param {Ship }ship
     * @returns {Array}
     * @constructor
     */
    static GetAsteroidsInRange(asteroids, ship)
    {
        var asteroidsInRange = [];
        asteroids.forEach(function (element, index)
        {
            if(Sensor.GetDistanceFromPointToPoint(element.GetCoordinateCenter(), ship.GetCoordinateCenter()) <= ship.GetSensorRange())
            {
                asteroidsInRange.push(element);
            }

        });
        return asteroidsInRange;
    }

    /**
     * returns all cargoships that are in range
     * @param {Ship[]} ships
     * @param {Ship} ship
     * @returns {Array}
     * @constructor
     */
    static GetShipsInRange(ships, ship)
    {
        var shipsInRange = [];
        ships.forEach(function (element, index)
        {
            if(Sensor.GetDistanceFromPointToPoint(element.GetCoordinateCenter(), ship.GetCoordinateCenter()) <= ship.GetSensorRange())
            {
                shipsInRange.push(element);
            }
/*            if(ship.GetSensorRect().Intersects(element.GetBodyRect()))
            {
                shipsInRange.push(element);
            }*/
        });
        return shipsInRange;
    }

    /**
     * get distance between asteroid and ship
     * @param {Asteroid} asteroid
     * @param {Ship} ship
     * @returns {Number}
     * @constructor
     */
    static GetDistance(asteroid, ship)
    {
        var xAst = asteroid.GetBodyRect().GetX() + ( asteroid.GetBodyRect().GetWidth() / 2);
        var yAst = asteroid.GetBodyRect().GetY() + ( asteroid.GetBodyRect().GetHeight() / 2);
        var xShi = ship.GetBodyRect().GetX() + ( ship.GetBodyRect().GetWidth() / 2);
        var yShi = ship.GetBodyRect().GetY() + ( ship.GetBodyRect().GetHeight() / 2);
        return this.GetDistanceFromPointToPoint(new Point(xAst, yAst), new Point(xShi, yShi))
    }

    /**
     * distance from point to point
     * @param {Point} point1
     * @param {Point} point2
     * @returns {Number} distance in pixel
     * @constructor
     */
    static GetDistanceFromPointToPoint(point1, point2)
    {
        var totalDifferenceX = Movement.Difference(point1.GetX(), point2.GetX());
        var totalDifferenceY = Movement.Difference(point1.GetY(), point2.GetY());
        return Math.sqrt((totalDifferenceX*totalDifferenceX) + (totalDifferenceY*totalDifferenceY));
    }

    /**
     * return true when targetShip is in sensor range
     * @param {Ship} shipLooking - Ship looking
     * @param {Ship} targetShip
     * @returns {boolean}
     * @constructor
     */
    static ShipIsInSensorRange(shipLooking, targetShip)
    {
        var distance = Sensor.GetDistanceFromPointToPoint(shipLooking.GetCoordinateCenter(), targetShip.GetCoordinateCenter());
        return (distance <= shipLooking.GetSensorRange());
    }

    /**
     * ship in weaponrange?
     * @param {Ship} shipLooking
     * @param {Ship} targetShip
     * @returns {boolean}
     * @constructor
     */
    static ShipIsInWeaponRange(shipLooking, targetShip)
    {
        var distance = this.GetDistanceFromPointToPoint(shipLooking.GetCoordinateCenter(), targetShip.GetCoordinateCenter());
        return (distance <= shipLooking.GetWeaponRange());
    }
}

/**
 * defines a rect with upper left xy coordinates, width and length
 */
class Rect
{
    /**
     * Constructor of Rect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     */
    constructor(x, y, width, height)
    {
        //x coordinate of upper left corner
        this._x = x;
        //y coordinate of upper left corner
        this._y = y;
        //width of the rect
        this._width = width;
        //height of the rect
        this._height = height;
    }

    /**
     * does the rect contains followingcoordinates?
     * @param {Number} x
     * @param {Number} y
     * @returns {boolean}
     * @constructor
     */
    ContainsPoint(x, y)
    {
        if(x < _x || x > _x)
        {
            return false;
        }

        if(y < _y || y > _y)
        {
            return false;
        }

        return true;
    }


    /**
     * does this rect intersect with the given one?
     * @param {Rect} rect
     * @returns {boolean}
     * @constructor
     */
    Intersects(rect)
    {
        var trueOrNot = rect.GetX() + rect.GetHeight() > this.GetX()
            && rect.GetY() + rect.GetWidth() > this.GetY()
            && rect.GetX() < this.GetX() + this.GetWidth()
            && rect.GetY() < this.GetY() + this.GetHeight();

        return trueOrNot;
    }

    GetX()
    {
        return this._x;
    }

    GetY()
    {
        return this._y;
    }

    GetWidth()
    {
        return this._width;
    }

    GetHeight()
    {
        return this._height;
    }
}



/**
 * defines a point in 2 dimensions
 */
class Point
{
    constructor(x, y)
    {
        //x coordinate of point
        this._x = x;
        //y coordinate of point
        this._y = y;
    }

    GetX()
    {
        return this._x;
    }

    GetY()
    {
        return this._y;
    }

    SetX(x)
    {
        this._x = x;
    }

    SetY(y)
    {
        this._y = y;
    }
}