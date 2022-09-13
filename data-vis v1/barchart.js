function VirusChart(){
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Total number of Virus Cases and Deaths ';
    // Each visualisation must have a unique ID with no special characters.
    this.id = 'Virus';

   this.setup = function(){
    
   }
   
   this.draw = function(){
    var myChart = document.getElementById('myChart').getContext('2d'); //chart 
    var barchart = new Chart(myChart, {
        type: 'bar', //bar horizontal bar , pie , line, radar
        data:{
            labels:['Total Cases (in Million)', 'Deaths (in Million)'], //xaxis labels of data
            datasets:[{
                label: 'Coronavirus cases and deaths', //label incident for chart
                data:  [156, 3], //data 
                backgroundColor:[ 'green', 'red'], //different colours for data
            }]
        }, 
        options:{
            layout:{
                padding: 150, //padding around the bar chart
                left:50, //spacing of bar chart 

            }
        }
    })
   }


}
