# Processing-CTAG
Processing flocking example for CTAG video

## Bee Flocking
Usually Bees don't flock like birds but this can be used to understand the agent. This visualization is based on flocking example by Daniel Shiffman. Every bee in formation flock together with three main forces effecting them
Separation, Cohesion and alignment.

Bee's steering towards a interesting point(flower or flock) is calculated using

STEER = DESIRED - VELOCITY

After filling from flower, bees are not really effected for few seconds.


###parameters 
flowerDistance :  Distance to attract bee

onFlowerState : Different state of bee i.e steered to Flower, onFlower, just sat.

onFlowerDuration : will sit on flower for this duration  (millisec)

nextOnFlowerDuration : will not be active (attracted, aligned etc) for this duration (millisec) 


## Ant lanes