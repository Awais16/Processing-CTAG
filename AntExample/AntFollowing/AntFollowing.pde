// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following
// Via Reynolds: // http://www.red3d.com/cwr/steer/PathFollow.html

// Using this variable to decide whether to draw all the stuff
boolean debug = false;

// A path object (series of connected points)
Path path;

// Two vehicles
Vehicle car1;
Vehicle car2;
ArrayList<Vehicle> ants;

ArrayList<PImage> spriteImages;
int spriteFrame=1;
float SMOOTH_DIST=20.0;
PImage bg;
void setup() {
  size(800, 600);
  // Call a function to generate new Path object
  newPath=null;
  newPath();
  
  spriteImages= new ArrayList<PImage>();
  spriteImages.add(loadImage("Ant up.png"));
  spriteImages.add(loadImage("Ant normal.png"));
  spriteImages.add(loadImage("Ant down.png"));
  
//  spriteImages.add(loadImage("Ant2_1.png"));
//  spriteImages.add(loadImage("Ant2_2.png"));
//  spriteImages.add(loadImage("Ant2_3.png"));
  
  bg= loadImage("dirt2.jpg");
  
  // Each vehicle has different maxspeed and maxforce for demo purposes
  //car1 = new Vehicle(new PVector(0, height/2), 2, 0.04);
  ants= new ArrayList<Vehicle>();
  ants.add(new Vehicle(new PVector(0, height/2), 2, 0.04));
  ants.add(new Vehicle(new PVector(0, height/2), 3, 0.1));
}

void draw() {
  background(bg);
  // Display the path
  path.display();
  // The boids follow the path
  
  for(Vehicle ant: ants){
   ant.follow(path);
   ant.run();
   ant.borders(path); 
   //ant.drawFootPrints(); not realisting
  }

  // Instructions
  fill(0);
  text("Hit space bar to toggle debugging lines.\n Drag mouse to generate a new path.", 10, height-30);
}

void newPath() {
  // A path is a series of connected points
  // A more sophisticated path might be a curve
  path = new Path();
  path.addPoint(-20, height/2);
  path.addPoint(random(0, width/2), random(0, height));
  path.addPoint(random(width/2, width), random(0, height));
  path.addPoint(width+20, height/2);
}

public void keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
}

//public boolean isNewPath;
public Path newPath;

public void mousePressed() {
  //newPath();
  if (mouseButton == LEFT){
    //draw path;
    newPath= new Path();
    newPath.addPoint(mouseX,mouseY);
  }else{
    //add ant
    ants.add(new Vehicle(new PVector(0, height/2), random(0.5,5), random(0.05,0.20)));
  }
  
}

public void mouseDragged(){
  if (mouseButton == LEFT){
    if(newPath!=null){
      newPath.addPoint(mouseX,mouseY);
    }
  }
}

public void mouseReleased(){
    if(mouseButton == LEFT && newPath!=null){
      newPath.addPoint(mouseX,mouseY);
      // smooth it up, remove the points that are too close;
      PVector lastPoint=newPath.getStart();
      //newPath.addPoint(lastPoint.x,lastPoint.y); //for closed path
      int i=1;
      while(i<newPath.size()){
        PVector nextPoint= newPath.get(i);
       float distance= dist(lastPoint.x,lastPoint.y,nextPoint.x,nextPoint.y);
        if(distance<SMOOTH_DIST){
         newPath.remove(i);
        }else{
          lastPoint=newPath.get(i);
          i++;
        }
      }
      path=newPath;
      newPath=null;
    }
}
