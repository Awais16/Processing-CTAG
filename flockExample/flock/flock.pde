Flock flock;
PImage bgImg,flower1,flower2;
ArrayList<Flower> flowers;
ArrayList<PImage> bSprite;
int flockSize=20;

void setup() {
  size(1024,768); //size of bgImage should of equal to this
  flock = new Flock();
  
  bgImg= loadImage("bg1.jpg");
  flower1= loadImage("Flower03.png");
  flower2= loadImage("Flower04.png");
  
  bSprite=new ArrayList<PImage>();
  bSprite.add(loadImage("Bee up.png"));
  bSprite.add(loadImage("Bee normal.png"));
  bSprite.add(loadImage("Bee down.png"));
  bSprite.add(loadImage("Bee stop.png"));
  
  flowers=new ArrayList<Flower>(); //list of add flowers
 
  
  // Add an initial set of boids into the system
  for (int i = 0; i <flockSize ; i++) {
    flock.addBoid(new Boid(width/2,height/2,bSprite));
  }
}

void draw() {
  background(bgImg);
  //draw flowers
  for (Flower flo : flowers) {
      flo.draw();
    }
  
  flock.run();
}

// Add a new boid into the System
void mousePressed() {
  if (mouseButton == RIGHT){
    addFlower();
  }else{
    flock.addBoid(new Boid(mouseX,mouseY,bSprite));  
  }
  
}

void addFlower(){
    Flower fl;
    if(int(random(0,3))==1){
      fl= new Flower(mouseX,mouseY,flower1);
    }else{
      fl= new Flower(mouseX,mouseY,flower2);
    }
    flowers.add(fl);  
}

// The Flock (a list of Boid objects)

class Flock {
  ArrayList<Boid> boids; // An ArrayList for all the boids
  Flock() {
    boids = new ArrayList<Boid>(); // Initialize the ArrayList
  }

  void run() {
    for (Boid b : boids) {
      b.run(boids);  // Passing the entire list of boids to each boid individually
    }
  }

  void addBoid(Boid b) {
    boids.add(b);
  }

}




// The Boid class

class Boid {

  PVector location;
  PVector velocity;
  PVector acceleration;
  float r;
  float maxforce;    // Maximum steering force
  float maxspeed;    // Maximum speed
  
  float flowerDistance;
  int onFlowerState;
  double onFlowerStartTime;
  double onFlowerDuration; //will sit on flower for these millies millis
  double lastOnFlowerTime;
  double nextOnFlowerDuration; //after which bee will be attracted again to a flower :millis
  //for animation
  ArrayList<PImage> spriteImages;
  int spriteFrame;

    Boid(float x, float y, ArrayList<PImage> sprite) {
    acceleration = new PVector(0, 0);

    // This is a new PVector method not yet implemented in JS
    // velocity = PVector.random2D();

    // Leaving the code temporarily this way so that this example runs in JS
    float angle = random(TWO_PI);
    velocity = new PVector(cos(angle), sin(angle));

    location = new PVector(x, y);
    r = 2.0;
    maxspeed = 2;
    maxforce = 0.03;
    
    
    spriteImages=sprite;
    spriteFrame=0;
    flowerDistance=100.0;
    onFlowerState=0;
    onFlowerDuration= 10000;//10sec
    nextOnFlowerDuration= 20000; //20sec
  }

  void run(ArrayList<Boid> boids) {
    flock(boids);
    update();
    borders();
    render();
  }

  void applyForce(PVector force) {
    // We could add mass here if we want A = F / M
    acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  void flock(ArrayList<Boid> boids) {
    
    steerToFlower();
    
    //if(this.onFlowerState==0 ){ //if its not on flower then apply other forces or just flied from flowers
      PVector sep = separate(boids);   // Separation
      PVector ali = align(boids);      // Alignment
      PVector coh = cohesion(boids);   // Cohesion
      
      // Arbitrarily weight these forces
      sep.mult(2.3);
      ali.mult(1.0);
      coh.mult(1.0);
      // Add the force vectors to acceleration
      applyForce(sep);
      applyForce(ali);
      applyForce(coh);
    //}
    
  }
  
  int findClosest(){
    float min=flowerDistance;
    int i=0,index=-1;
    for (Flower flower: flowers){
       //println(flower.numOfBees);
       float d = PVector.dist(this.location, flower.location);
       if(d<min){
         min=d;
         index=i;
       }
       i++;
    }
    return index;
  }
  
  void steerToFlower(){
      
      //for (Flower flower: flowers){
        int closestFlower=this.findClosest();
        if(closestFlower!=-1){
          
        
          Flower flower= flowers.get(closestFlower);       
            
          float d = PVector.dist(this.location, flower.location);
          //println("distance="+d);
          
          if(flower.numOfBees<flower.maxBees){
            if(d<flowerDistance && this.onFlowerState==0){ //<>//
              flower.numOfBees++;
              this.onFlowerState=1;
              this.acceleration.add(seek(flower.location));
            }
          }else if(this.onFlowerState==0){
            /*PVector steerAway=seek(flower.location);
            steerAway.normalize();
            steerAway.mult(-0.1*(maxspeed/3));
            steerAway.limit(maxspeed);
            this.acceleration.add(steerAway);*/
          }
          
          if(this.onFlowerState==1){
            this.acceleration.add(seek(flower.location));
            if(d<(flowerDistance/2)){
              this.velocity.normalize();
              this.velocity.mult(maxspeed/3);
              this.onFlowerState=2;
            }
          }
          
          if(this.onFlowerState==2){
              this.acceleration.add(seek(flower.location));
              if(d<(flowerDistance/3)){
                this.velocity.normalize();
                this.velocity.mult(0.1);
                this.onFlowerStartTime = millis();
                this.onFlowerState=3; 
              } 
              //println("state3: dead slow!");
              //println("sitTime"+(this.flowerSitTime));
          }
         
         
          if(this.onFlowerState==3){
            this.acceleration.add(seek(flower.location));
            if(d<10){
              /*this.velocity.x= this.velocity.x*-1;
              this.velocity.y= this.velocity.y*-1;*/
              this.velocity.mult(0);
              this.acceleration.mult(0.0001);
              this.onFlowerState=4;
            }
          }
            
            if(this.onFlowerState==4){
             if(this.onFlowerDuration<(millis()-this.onFlowerStartTime)){
                //println("times up");
                //should fly away from flower now;
                flower.numOfBees--;
                
                //println(flowers.get(0).numOfBees);
                float angle = random(TWO_PI);
                this.velocity = new PVector(cos(angle), sin(angle));
                this.onFlowerState=5;
                this.lastOnFlowerTime=millis();
              } 
            }
          }  
            
            if(onFlowerState==5){
              if(this.nextOnFlowerDuration<(millis()-this.lastOnFlowerTime)){
                //println("refilled");
                this.onFlowerState=0;
              } 
            }
        
      //}//for flower
      
  }
  
  

  // Method to update location
  void update() {
    // Update velocity
    velocity.add(acceleration);
    // Limit speed
    velocity.limit(maxspeed);
    location.add(velocity);
    // Reset accelertion to 0 each cycle
    acceleration.mult(0);
  }
  

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  PVector seek(PVector target) {
    PVector desired = PVector.sub(target, location);  // A vector pointing from the location to the target
    // Scale to maximum speed
    desired.normalize();
    desired.mult(maxspeed);

    // Above two lines of code below could be condensed with new PVector setMag() method
    // Not using this method until Processing.js catches up
    // desired.setMag(maxspeed);

    // Steering = Desired minus Velocity
    PVector steer = PVector.sub(desired, velocity);
    steer.limit(maxforce);  // Limit to maximum steering force
    return steer;
  }

  void render() {
    // Draw a triangle rotated in the direction of velocity
    float theta = velocity.heading2D() + radians(90);
    // heading2D() above is now heading() but leaving old syntax until Processing.js catches up
    
    /*fill(200, 100);
    stroke(255);
    pushMatrix();
    translate(location.x, location.y);
    rotate(theta);
    beginShape(TRIANGLES);
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape();
    popMatrix();
    */
    
    animate(theta);
    
  }

  // Wraparound
  void borders() {
    if (location.x < -r) location.x = width+r;
    if (location.y < -r) location.y = height+r;
    if (location.x > width+r) location.x = -r;
    if (location.y > height+r) location.y = -r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  PVector separate (ArrayList<Boid> boids) {
    float desiredseparation = 25.0f;
    PVector steer = new PVector(0, 0, 0);
    int count = 0;
    // For every boid in the system, check if it's too close
    for (Boid other : boids) {
      float d = PVector.dist(location, other.location);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation) && (other.onFlowerState==0 && this.onFlowerState==0) ) {
        // Calculate vector pointing away from neighbor
        PVector diff = PVector.sub(location, other.location);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div((float)count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // First two lines of code below could be condensed with new PVector setMag() method
      // Not using this method until Processing.js catches up
      // steer.setMag(maxspeed);

      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(maxspeed);
      steer.sub(velocity);
      steer.limit(maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  PVector align (ArrayList<Boid> boids) {
    float neighbordist = 50;
    PVector sum = new PVector(0, 0);
    int count = 0;
    for (Boid other : boids) {
      float d = PVector.dist(location, other.location);
      if ((d > 0) && (d < neighbordist) && (other.onFlowerState==0 && this.onFlowerState==0)) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div((float)count);
      // First two lines of code below could be condensed with new PVector setMag() method
      // Not using this method until Processing.js catches up
      // sum.setMag(maxspeed);

      // Implement Reynolds: Steering = Desired - Velocity
      sum.normalize();
      sum.mult(maxspeed);
      PVector steer = PVector.sub(sum, velocity);
      steer.limit(maxforce);
      return steer;
    } 
    else {
      return new PVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  PVector cohesion (ArrayList<Boid> boids) {
    float neighbordist = 50;
    PVector sum = new PVector(0, 0);   // Start with empty vector to accumulate all locations
    int count = 0;
    for (Boid other : boids) {
      float d = PVector.dist(location, other.location);
      if ((d > 0) && (d < neighbordist) && (other.onFlowerState==0 && this.onFlowerState==0)) {
        sum.add(other.location); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return seek(sum);  // Steer towards the location
    } 
    else {
      return new PVector(0, 0);
    }
  }
  
  
  //functions animation  
  void animate(float theta){
    
    pushMatrix();
    //translate and rotate to give direction to the image.
    translate(location.x,location.y);
    rotate(theta);
    imageMode(CENTER);
    if(this.onFlowerState==4){
      //spriteFrame = 1;
      image(spriteImages.get(spriteImages.size()-1), 0,0);
    }else{
      spriteFrame = (spriteFrame+1) % (spriteImages.size()-1);
      image(spriteImages.get(spriteFrame), 0,0);
    }
    
    
    popMatrix();
  }
 
  
} //boid class ends


class Flower{
  PImage flower;
  PVector location;
  int numOfBees;
  int maxBees=2;
  
  Flower(float x,float y,PImage flower){
    location= new PVector(x,y);
    this.flower=flower;
    numOfBees=0;
  }
  
  void draw(){
   image(flower,location.x,location.y); 
  }
}//class Flower
