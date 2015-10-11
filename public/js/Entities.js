
    'use strict';

    /**
     * Superclass for all ships, contain values that each ship needs
     */
    class Ship
    {
        constructor(id, rectPosition, color, handleObjects)
        {
            //unique id of ship
            this._id = id;
            //pixel per interval speed
            this._speed = 2.0;
            //the rect which defines the ship
            this._shipRect = rectPosition;
            //color of the ship
            this._color = color;
            //range that the ship can see other ships
            this._sensorRange = 300;
            //range that ship can fire its weapons
            this._weaponRange = 100;
            //reference to object which hold many important infomations about galaxy
            this._handleObjects = handleObjects;

        }

        GetBodyRect()
        {
            return this._shipRect;
        }

        //get center coordinate of ship
        GetCoordinateCenter()
        {
            return new Point(this._shipRect.GetX() + (this._shipRect.GetWidth()/2), this._shipRect.GetY() + (this._shipRect.GetHeight()/2));
        }

        GetId()
        {
            return this._id;
        }

        GetSensorRange()
        {
            return this._sensorRange;
        }

        GetSpeed()
        {
            return this._speed;
        }

        GetWeaponRange()
        {
            return this._weaponRange;
        }

        /**
         * for now just a flag is set that a hit was received. not used yet.
         * @param damage - this could be an object in the future, defining the kind of weapon, strengt, ship which shot etc.
         * @constructor
         */
        MakeDamage(damage)
        {
            //this._wasHit = true;
        }

        /**
         * Reset hits, should happen in the beginning of each round. not used.
         * @constructor
         */
        ResetHits()
        {
            //this._wasHit = false;
        }

        SetBodyRect(rect)
        {
            this._shipRect = rect;
        }

        SetCoordinateX(x)
        {
            this._shipRect = new Rect(x, this._shipRect.GetY(), this._shipRect.GetWidth(), this._shipRect.GetWidth());
        }

        SetCoordinateY(y)
        {
            this._shipRect = new Rect(this._shipRect.GetX(), y , this._shipRect.GetWidth(), this._shipRect.GetWidth());
        }

        SetSpeed(speed)
        {
            this._speed = speed;
        }

    }

    /**
     * A cargo ship
     */
    class CargoShip extends Ship
    {
        constructor(curTonnage, maxTonnage, id, rectPosition, color, handleObjects)
        {
            super(id, rectPosition, color, handleObjects);

            //current weight load
            this._currentTonnage = curTonnage;
            //maximal weight load
            this._maximalTonnage = maxTonnage;
            //reference to the AI
            this._intelligence = new IntelligenceShipCargo(this, this._handleObjects);



            this._speed = 3.1;
        }

        GetAiActivity()
        {
            return this._intelligence.GetActivity();
        }

        /**
         * 
         * @constructor
         */
        NextMove()
        {
            this._intelligence.NextMove();
        }




    }


    /**
     * A pirate ship, hunting for treasure
     */
    class PirateShip extends Ship
    {
        constructor(curTonnage, maxTonnage, id, rectPosition, color, handleObjects)
        {
            super(id, rectPosition, color, handleObjects);

            //current weight load
            this._currentTonnage = curTonnage;
            //max weight load
            this._maximalTonnage = maxTonnage;
            //reference to the AI
            this._intelligence = new IntelligenceShipPirate(this, this._handleObjects);



            this._speed = (Math.random() * 2) + 1 + Math.random();
        }
        GetAiActivity()
        {
            return this._intelligence.GetActivity();
        }

        GetGroup()
        {
            return this._intelligence.GetGroup();
        }

        /**
         * Is this Ship member in a group?
         * @returns {boolean}
         * @constructor
         */
        HasGroup()
        {
            return this._intelligence.HasGroup();
        }

        /**
         * Is this ship a Master AI?
         * @returns {boolean}
         * @constructor
         */
        IsMaster()
        {
            return this._intelligence.IsMaster();
        }

        /**
         * next move from AI
         * @constructor
         */
        NextMove()
        {
            this._intelligence.NextMove();
        }

        /**
         * set activity in AI
         * @param {String} activity
         * @constructor
         */
        SetActivity(activity)
        {
            this._intelligence.SetActivity(activity);
        }

        /**
         * next move in AI
         * @param {GroupAction} groupAction
         * @constructor
         */
        SetGroup(groupAction)
        {
            this._intelligence.SetGroup(groupAction);
        }



    }

    /**
     * An Asteroid Object
     */
    class Asteroid
    {
        constructor(id, positionRect, resources)
        {
            //unique id
            this._id = id;
            //the rect which defines the asteroid
            this._positionRect = positionRect;
            //resources left in the asteroid
            this._resources = resources;
        }

        GetBodyRect()
        {
            return this._positionRect;
        }

        /**
         * get center coordinate of
         * @constructor
         */
        GetCoordinateCenter()
        {
            return new Point(this._positionRect.GetX() + (this._positionRect.GetWidth()/2), this._positionRect.GetY() + (this._positionRect.GetHeight()/2));
        }
    }

    /**
     * An object of this class is used from the so called boss AI to give orders to the slave AIs
     */
    class GroupAction
    {
        /**
         * constructor
         * @param {Number[]} memberIds List of the member ids which are in this group already
         * @param {Number} bossId the id of the boss AI
         */
        constructor(memberIds, bossId)
        {
            this._memberIds = memberIds;
            this._bossId = bossId;
            //the id of the ship which is hunted right now
            this._shipToHunt = -1;
            //activity of the boss AI, copied from the slaves
            this._activity = null;
            //target position of the boss AI, copied from the slaves
            this._targetPosition = new Point(0, 0);
        }

        AddMemberId(memberId)
        {
            this._memberIds.push(memberId);
        }

        GetActivity()
        {
            return this._activity;
        }

        GetBossId()
        {
            return this._bossId;
        }

        GetMemberIds()
        {
            return _memberIds;
        }

        GetShipToHunt()
        {
            return this._shipToHunt;
        }

        GetTargetPosition()
        {
            return this._targetPosition;
        }

        /**
         * remove member id from memberlist
         * @param id
         * @constructor
         */
        RemoveMemberId(id)
        {
            var indexToRemove = -1;

            this._memberIds.forEach(function (element, index)
            {
                if(element == id)
                {
                    this.indexToRemove = index;
                }
            });

            if(indexToRemove > -1)
            {
                this._memberIds.splice(indexToRemove,1);
            }
            else
            {
                console.log('error removing member id');
            }
        }

        /**
         * set the activity
         * @param {String} activity
         * @constructor
         */
        SetActivity(activity)
        {
            this._activity = activity
        }

        /**
         * set the boss id
         * @param {Number} id
         * @constructor
         */
        SetBossId(id)
        {
            this._bossId = id;
        }

        /**
         * set id for ship to hunt
         * @param {number} shipToHunt
         * @constructor
         */
        SetShipToHunt(shipToHunt)
        {
            this._shipToHunt = shipToHunt;
        }

        /**
         *
         * @param {Point} targetPosition
         * @constructor
         */
        SetTargetPosition(targetPosition)
        {
            this._targetPosition = targetPosition;
        }

    }



