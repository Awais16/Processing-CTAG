'use strict';

/**
 * Takes care of movement in the system
 */
class Movement
{
    /**
     * move closer to that coordinates, depends on speed of ship
     * @param {Ship} ship
     * @param {Point} coordsTo
     * @constructor
     */
    static MoveTo(ship, coordsTo)
    {
        var totalDifferenceX = this.Difference(ship.GetCoordinateCenter().GetX(), coordsTo.GetX());
        var totalDifferenceY = this.Difference(ship.GetCoordinateCenter().GetY(), coordsTo.GetY());
        var distance = Math.sqrt((totalDifferenceX*totalDifferenceX) + (totalDifferenceY*totalDifferenceY));
        var factor = distance / ship.GetSpeed();
        var xMovement = 0;
        var yMovement = 0;
        if(distance > ship.GetSpeed()){
            yMovement = totalDifferenceY/factor;
            xMovement = totalDifferenceX/factor;
        }


        if(coordsTo.GetX() > ship.GetCoordinateCenter().GetX())
        {
            //ship.xPosition += speed;
            ship.SetCoordinateX(ship.GetBodyRect().GetX() + xMovement);
            //console.log('bigger ' + ship.GetSpeed());
        }
        else if(coordsTo.GetX() < ship.GetCoordinateCenter().GetX())
        {
            //ship.xPosition -= speed;
            ship.SetCoordinateX(ship.GetBodyRect().GetX() - xMovement);
            //console.log('smaller ' + ship.GetSpeed());
        }

        if(coordsTo.GetY() > ship.GetCoordinateCenter().GetY())
        {
            //ship.yPosition += speed;
            ship.SetCoordinateY(ship.GetBodyRect().GetY() + yMovement);
        }
        else if(coordsTo.GetY() < ship.GetCoordinateCenter().GetY())
        {
            //ship.yPosition -= speed;
            ship.SetCoordinateY(ship.GetBodyRect().GetY() - yMovement);
        }

    }


    /**
     * will return a coordinate in the distance to targetrect
     * @param {Rect} originRect object requesting the coordinates (rect)
     * @param {Rect} targetRect
     * @param {Number} distance
     * @constructor
     */
    static GetPointFromRect(originRect, targetRect, distance)
    {

        var coordsAroundTarget = [];
        coordsAroundTarget.push(new Point(targetRect.GetX() - (distance/2), targetRect.GetY() - (distance/2)));
        coordsAroundTarget.push(new Point(targetRect.GetX() - (distance/2), targetRect.GetY() + targetRect.GetHeight() + (distance/2)));
        coordsAroundTarget.push(new Point(targetRect.GetX() + targetRect.GetWidth() + (distance/2), targetRect.GetY() + targetRect.GetHeight() + (distance/2)));
        coordsAroundTarget.push(new Point(targetRect.GetX() + targetRect.GetWidth() + (distance/2), targetRect.GetY() - (distance/2)));

        coordsAroundTarget.forEach(function (element, index)
        {
            //console.log(element);

            if(element.GetX() < 0)
            {
                element.SetX(0);
            }

            if(element.GetX() > $("#spaceDiv").width())
            {
                element.SetX($("#spaceDiv").width());
            }

            if(element.GetY() < 0)
            {
                element.SetY(0);
            }

            if(element.GetY() > $("#spaceDiv").height())
            {
                element.SetY($("#spaceDiv").height());
            }
        });

        var minDistance = 1000000;
        var minCoords = {};
        var centerOriginRect = new Point(originRect.GetX() + (originRect.GetWidth()/2), originRect.GetY() + (originRect.GetHeight()/2))
        coordsAroundTarget.forEach(function (element, index)
        {
            var dist = Sensor.GetDistanceFromPointToPoint(centerOriginRect, element);
            if(dist < minDistance)
            {
                minDistance = dist;
                minCoords = new Point(element.GetX(), element.GetY());
            }
        });


        //shuffle the coordinates a bit with random values
        var returnPoint = new Point(minCoords.GetX(), minCoords.GetY());
        var xOrY = Math.floor((Math.random() * 2) + 1);
        coordsAroundTarget.forEach(function (element, index)
        {
            if((element.GetX() == minCoords.GetX()) &&  (element.GetY() != minCoords.GetY()) && xOrY == 1)
            {
                var smallerY = (element.GetY() < minCoords.GetY()) ? element.GetY() : minCoords.GetY();
                returnPoint.SetY(Math.floor((Math.random() * Movement.Difference(element.GetY(), minCoords.GetY())) + 1) + smallerY);
            }


            if((Movement.Difference(element.GetY(), minCoords.GetY()) < 3) &&  (element.GetX() != minCoords.GetX()) && xOrY == 2)
            {
                var smallerY = (element.GetX() < minCoords.GetX()) ? element.GetX() : minCoords.GetX();
                returnPoint.SetX(Math.floor((Math.random() * Movement.Difference(element.GetX(), minCoords.GetX())) + 1) + smallerY);
            }
        });


        return returnPoint;
    }

    /**
     * difference between 2 values, always positive
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     * @constructor
     */
    static Difference(a, b)
    {
        return Math.abs(a - b);
    }
}
