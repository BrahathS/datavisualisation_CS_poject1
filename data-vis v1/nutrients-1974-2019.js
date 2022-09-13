function NutrietsTimeSeries() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Nutrients: 1984-2019';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'Nutrients-timeseries';

  // Title to display above the plot.
  this.title = 'Nutrients Intake';

    // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';
  //creating color for the graph 
  this.colors = [color(100,205,200), //vit A
                color(125,125,125), //niacin
                color(200,0,200), //riboflavin
                color(255,0,0), //protein
                color(125,175,50), //calcium
                color(200,100,200), //thiamin
                color(25,125,125), //vit C
                color(10,250,50), //iron
                color(15,25,255), //energy
               ] ;

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Margin positions around the plot. Left and bottom have double
    // margin size to make space for axis and tick labels on the canvas.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/nutrients1974-2019.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);

    // console.log(this.data.columns);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[11]);
    this.endYear = Number(this.data.columns[this.data.columns.length -1] );

    // this.startYear = 1974;
    // this.endYear = 2021;  

    for(var i =0; i < this.data.getRowCount(); i++){
        this.colors.push();
    }

    this.minPercentage = 80;         // giving the minimum gap for mapping to canvas .
    this.maxPercentage = 350;
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(this.minPercentage,
                        this.maxPercentage,
                        this.layout,
                        this.mapPayGapToHeight.bind(this),
                        0);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel,
                   this.yAxisLabel,
                   this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
   
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {

      var row = this.data.getRow(i);
      var previous = null;

      var l = row.getString(0);

      for (var j = 1; j < numYears; j++){
        // Create an object to store data for the current year.
        var current = {
        // Convert strings to numbers.
        'year': this.startYear + j - 1,
        'percentage':  row.getNum(j),
        };

        // console.log(current);
        
        if (previous != null) {
          // Draw line segment connecting previous year to current
          // year pay gap.
          stroke(this.colors[i]);
          line(
              this.mapYearToWidth(previous.year),
              this.mapPayGapToHeight(previous.percentage),
              this.mapYearToWidth(current.year), 
              this.mapPayGapToHeight(current.percentage),
          );
            
            // console.log(previous.payGap);
          
          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          var xLabelSkip = 20;
  
          // Draw the tick label marking the start of the previous year.
          if (i % xLabelSkip == 0) {
            drawXAxisTickLabel(previous.year, this.layout,
                               this.mapYearToWidth.bind(this));
          }
        }
      else{
        //text for label the line graphs
        
        stroke(this.colors[i]);
        // text(l, 100,this.mapPayGapToHeight(current.percentage));
        text(l, 1250, 80+50 * (i));
      }
  
      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
      }
    }
  };

  this.drawTitle = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(this.title,
         (this.layout.plotWidth() / 2) + this.layout.leftMargin,
         this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function(value) {
    return map(value,
               this.startYear,
               this.endYear,
               this.layout.leftMargin,   // Draw left-to-right from margin.
               this.layout.rightMargin);
  };

  this.mapPayGapToHeight = function(value) {
      return map(value,
               this.minPercentage,
               this.maxPercentage,
               this.layout.bottomMargin,   // Draw bottom-to-top from margin.
               this.layout.topMargin);
      
  };
}
