    var dataPromise = d3.json("classData.json")

//Reformat json data
var reformatData = function(jsonData){
      reformattedData = {}
      jsonData.forEach(function(peng){
        peng.quizes.forEach(function(quiz){
          var day = "day"+quiz.day;
          //console.log("|" + day + "|")
          var grade = quiz.grade;
          if (typeof reformattedData[day] === 'undefined') {
              // if the day's score array is not in the dataSet
              reformattedData[day] = []; //Initialize an array to store all the scores of the day
              reformattedData[day].push(grade);
          }
          else {
            reformattedData[day].push(grade);
          }
        });
      })
      console.log("Loaded data reformatted:", reformattedData);
      return reformattedData;
    };
  //dataSet format:
  //  {"day1": [score, score, score], "day2": [score, score, score],...}

//Graph settings
var screenSettings = {
width:700,
height:400
};

var marginSettings = {
  top:20,
  bottom: 30,
  left: 50,
  right: 50
}

var updateChart = function(dataSet, svgSelector, selectedDay, screen, margins){
    day = selectedDay;
    console.log("----------UPDATING data to------------", day);
    console.log("Selected day:", day);
    console.log(day + " dataset:", dataSet[day]);

    //Draw a histogram using the selectedDay's info
    var graphWidth  = screen.width - margins.left - margins.right;
    var graphHeight = screen.height - margins.top - margins.bottom;
    var xScale = d3.scaleLinear()
                  .domain(d3.extent(dataSet[day]));
                  //.range([0, graphWidth])

            console.log("length:", dataSet[day].length);
            console.log("height", graphHeight)

    var yScale = d3.scaleLinear()
                  .domain([0, dataSet[day].length])
                  .range([graphHeight - 15,0]);

    var binMaker = d3.histogram()
                      .domain([0,10])
                      .thresholds([2, 4, 6, 8,]);

    var bins = binMaker(dataSet[day]);
    console.log("Bins:", bins)
    var barWidth = graphWidth / bins.length;

    var graphSVG = d3.select(svgSelector)

    var graphData = graphSVG.select(".graph-data", true);

    var graphBars = graphData.selectAll("rect")
                              .data(bins)
                              .enter()
                              .append("rect")
                              .attr("x", function(bar, i){return i * barWidth + margins.left})
                              .attr("y", function(bar, i){return graphHeight - yScale(bar.length)})
                              .attr("width", barWidth)
                              .attr("height", function(bar){console.log("yScale:", yScale(bar.length));return yScale(bar.length)})
                              .attr("class", "graph-bar");

    var barLabel = graphData.selectAll("text")
                            .data(bins)
                            .enter()
                            .append("text")
                            .attr("x", function(bar, i){return i * barWidth + margins.left})
                            .attr("y", function(){return graphHeight + 10})
                            .text(function(bar){
                              console.log("String", String(bar.x0) + "-" + String(bar.x1));
                              return String(bar.x0) + "-" + String(bar.x1);
                            })
                            .attr("class", "bar-label")

};

var drawChart = function(dataSet, svgSelector, selectedDay, screen, margins)
//This function is called at the bottom of the code.
{
  day = "day" + selectedDay;
  console.log("Selected day:", day);
  console.log(day + " dataset:", dataSet[day]);

  //Draw a histogram using the selectedDay's info
  var graphWidth  = screen.width - margins.left - margins.right;
  var graphHeight = screen.height - margins.top - margins.bottom;
  var borderWidth = 1;
console.log("extent", d3.extent(dataSet[day]))
  var xScale = d3.scaleLinear()
                .domain(d3.extent(dataSet[day]));
                //.range([0, graphWidth])

          console.log("length:", dataSet[day].length);
          console.log("height", graphHeight)
  var yScale = d3.scaleLinear()
                .domain([0, dataSet[day].length])
                .range([graphHeight, 0]);

  var yAxis = d3.axisLeft()
   .scale(yScale);

  var binMaker = d3.histogram()
                    .domain([0,10])
                    .thresholds([2, 4, 6, 8,]);

  var bins = binMaker(dataSet[day]);


  var barWidth = graphWidth / bins.length;


  //console.log("Input data:",  Object.keys(dataSet));
 console.log("bins:", bins);




  //var yAxisScale = d3.scaleLinear()
                //.domain([0, 100])
                //.range([graphHeight - 15, 0]);

  //var yAxis = d3.axisLeft().scale(yAxisScale);

  var colorScale = d3.scaleOrdinal(d3.schemeAccent);

  //var barWidth = graphWidth / scoreFrequencies.length;
  //
  var graphSVG = d3.select(svgSelector)
              .attr("width", screen.width)
              .attr("height", screen.height);

              graphSVG.append("g")
                  .call(yAxis)
                  .attr("transform", function(){
                  return "translate(" + (margins.left - 2) + "," + "0)";
                  });

  var graphData = graphSVG.append("g")
                    .attr("x", margins.left)
                    .attr("y", margins.top)
                    .classed("graph-data", true);


  console.log("svg", )
  var graphBars = graphData.selectAll("rect")
                            .data(bins)
                            .enter()
                            .append("rect")
                            .attr("x", function(bar, i){return i * barWidth + margins.left})
                            .attr("y", function(bar, i){return graphHeight - yScale(bar.length)})
                            .attr("width", barWidth)
                            .attr("height", function(bar){console.log("yscale:", yScale(bar.length));return yScale(bar.length)})
                            .attr("class", "graph-bar");

  var barLabel = graphData.selectAll("text")
                          .data(bins)
                          .enter()
                          .append("text")
                          .attr("x", function(bar, i){return i * barWidth + margins.left})
                          .attr("y", function(){return graphHeight + 10})
                          .text(function(bar){
                            console.log("String", String(bar.x0) + "-" + String(bar.x1));
                            return String(bar.x0) + "-" + String(bar.x1);
                          })
                          .attr("class", "bar-label");

  var xLabel = graphData.append("text")
                        .text("Grades")
                        .attr("x", function(){return graphWidth/2 + margins.left - 25})
                        .attr("y", function(){return graphHeight + margins.bottom})
//var graphBars = graphData.selectAll("rect")
                     // .data(scoreFrequencies)
                     // .enter()
                     // .append("rect")
                     // .attr("width", barWidth)
                     // .attr("height", function(d){console.log("Loop"); return 10;})

                    //  .attr("width", barWidth)
                    //  .attr("height", function(peng){
                    //                   console.log(peng[selectedDay]);
                    //                   return yScale(peng[selectedDay])})
                    //  .attr("x", function(d,i)
                    //  { return margins.left + i*barWidth + (graphWidth/16);})//adjusting the center of bar
                    //  .attr("y", function(person){
                    //                   return graphHeight + margins.top- yScale(peng[selectedDay]) - 2})
                    // .attr("fill", function(person){return colorScale(person.name)})
                    // .style("stroke", "#EBFCFB")
                    // .style("stroke-width", 2)
                    // .classed("data-bar", true);
  };



var createDayMenu = function(dataSet, menuSelector){
  //console.log("List")
  var days = Object.keys(dataSet);
  //console.log("DAYS:", days);
  var dayButtons = d3.select(menuSelector).selectAll("li")
                  .data(days)
                  .enter()
                  .append("li")
                  .classed("pure-menu-link", true)
                  .classed("day-button", true)
                  .text(function(bar, i){return days[i]})
                  .on("click", function(){
                    console.log("Clicked");
                    d3.selectAll(".graph-bar").remove();
                    d3.selectAll(".bar-label").remove();
                    newSelectedDay = this.innerText;
                    dataPromise.then(function(data){
                        var reformattedData = reformatData(data);
                        updateChart(reformattedData, "#histogram", newSelectedDay, screenSettings, marginSettings);
                      });
                  });
  //console.log(dayButtons);
}
//Main process

dataPromise.then(function(data){
      var reformattedData = reformatData(data);
      drawChart(reformattedData, "#histogram", 1, screenSettings, marginSettings);
      createDayMenu(reformattedData, ".pure-menu-list");

    });


//Next: Set the buckets
