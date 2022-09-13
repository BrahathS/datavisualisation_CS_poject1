/**
 * I have used created this data visualisation by following the steps of Dan Shiffman video on Youtube watching "Mapping Earthquakes" Ref: https://www.youtube.com/watch?v=ZiYdOwOrGyc
 *    that was one of the example on learn.gold follow them and working on construct function to embed into the project
 */
function CovidVaccine() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Covid Vaccine';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'Covidvaccine';

  this.longitude = 0; //variable of longitude
  this.latitude = 0;//variable of latitude 
  this.zoom = 1; //var of zoom of image map

 
  this.preload = function() {
    /**
     * this imgmap loads the API following the link and preloaded calls when the program is lauched. 
     * the API link is from mapbox.com that shows all the data with world information.
     * loadimage renders the before to ensure it is ready to view. As, callback function needs to handle images as its ready.
     */
    
    this.mapimage = loadImage('https://api.mapbox.com/styles/v1/mapbox/light-v9/static/0,0,1,0,0/1024x720?access_token=pk.eyJ1IjoiYnNoZXQwMDEiLCJhIjoiY2tvMXE4cno2MHMxZjJucDRva2N1dzEzciJ9.DamFmwp-h1E8DlOquegRmA');
    /**
     * data is loaded giving its path to the file stored in the project
     * Ref: https://developers.google.com/public-data/docs/canonical/countries_csv 
     * this is the reference to the data found in github that is recorded and saved on the one spreadsheet.
     * Ref: https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations/country_data 
     * this is link to number of vaccination given all over the world.
     */
    this.vaccinedata = loadTable('/data/vaccine/vaccinedata.csv', 'csv', 'header');

  };

  /**
   * longtitude and latitude coordinates of the map to be scaled 
   * mercatorX constructor function that is taking the longitude coordinates as Web Mercator is sphere shpaed map projecting through its map which needs to be flat using the formula  
   * mercatorY constructor function that is taking the latitude coordinates 
   */
   // here:https://en.wikipedia.org/wiki/Web_Mercator_projection)

   this.mercatorX = function(long) {
    let longitudeRadian = radians(long);//convert degrees to radians
    let a = (256 / PI) * Math.pow(2, this.zoom);
    //The pow() function is an efficient  way of multiplying numbers by themselves in large quantities.
    let b = longitudeRadian + PI;
    return a * b;
};

this.mercatorY = function(latit) {
    let latitudeRadian = radians(latit); //convert degrees to radians

    let a = (256 / PI) * Math.pow(2, this.zoom);
    let b = tan(PI / 4 + latitudeRadian / 2);
    let c = PI - log(b);
    return a * c;
};

this.destroy = function() {
};
  
this.setup = function() {
    this.centerX = this.mercatorX(this.longitude);//longtitude position
    this.centerY = this.mercatorY(this.latitude);//latitude position
    noStroke();
    this.ratioMinimum = min(this.vaccinedata.getColumn('Total_Vaccinated'));//minimum number of vaccine
    this.ratioMaximum = max(this.vaccinedata.getColumn('Total_Vaccinated'));//maximum number of vaccine and taking the value from the file
};
    
  this.draw = function() {
    noLoop();
    colorMode(HSB); //Setting colorMode(HSB) lets you use the HSB system.
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(this.mapimage, 0, 0);
  
    //the for loop is going through an array of data saved in file gets the values from strings stored in this file
    for (var i = 0; i < this.vaccinedata.getRowCount(); i++) {
        
        let latit = this.vaccinedata.getString(i, 0);//getting all values stored at index "0" - latitude column
        let long = this.vaccinedata.getString(i, 1);//getting all values stored at index "1" - longtitude column

        let mag = this.vaccinedata.getString(i, 2);//getting all values stored at index "2" - total vaccination 


        let xcoord = this.mercatorX(long) - this.centerX;//longtitude converted to x coordinates
        let ycoord = this.mercatorY(latit) - this.centerY;//latitude converted to y coordinates

        //sqrt of current ratio because sizes of ellipses 
        let diameter = map(sqrt(mag), 0, sqrt(this.ratioMaximum), 3, 40);
        //get the color with current hue
        let colour = color(200, 100, 200, 0.8)


        fill(colour);//apply color
        ellipse(xcoord, ycoord, diameter, diameter);
    }
    
    
  };
}
