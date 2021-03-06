// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following

class Path {

  // A Path is an arraylist of points (PVector objects)
  ArrayList<PVector> points;
  // A path has a radius, i.e how far is it ok for the boid to wander off
  float radius;

  Path() {
    // Arbitrary radius of 20
    radius = 15;
    points = new ArrayList<PVector>();
  }

  // Add a point to the path
  void addPoint(float x, float y) {
    PVector point = new PVector(x, y);
    points.add(point);
  }
  
  PVector getStart() {
     return points.get(0);
  }

  PVector getEnd() {
     return points.get(points.size()-1);
  }
  
  PVector get(int i){
    PVector point=null;
    if(i<points.size()){
      point=points.get(i);
    }
    return point;
  }
  
  int size(){
    return points.size();
  }
  
  PVector remove(int i){
    PVector point=null;
    if(i<points.size()){
      point=points.remove(i);
    }
    return point;
  }


  // Draw the path
  void display() {
    // Draw thick line for radius
    if(debug)
      stroke(175);
    else
      stroke(255,255,255,20);
    strokeWeight(radius*1.5);
    noFill();
    beginShape();
    for (PVector v : points) {
      vertex(v.x, v.y);
    }
    endShape();
    // Draw thin line for center of path
    if(debug)
      stroke(0);
    else
      stroke(255,200,155,30);
    strokeWeight(5);
    noFill();
    beginShape();
    for (PVector v : points) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}
