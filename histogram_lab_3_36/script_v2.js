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
  width: window.innerWidth * 0.8,
  height: window.innerHeight * 0.8
};

var marginSettings = {
  top:60,
  bottom: 80,
  left: 80,
  right: 0
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
                  .range([0, graphHeight]);

    var binMaker = d3.histogram()
                      .domain([0,10])
                      .thresholds([2, 4, 6, 8,]);

    var bins = binMaker(dataSet[day]);
    console.log("Bins:", bins)
    var barWidth = graphWidth / bins.length;

    var graphSVG = d3.select(svgSelector)

    var graphData = graphSVG.select(".graph-data", true);

    var graphBars = graphData.selectAll(".graph-bar")
                              .data(bins)
                              .transition()
                              .duration(1000)
                              .attr("x", function(bar, i){return (i * barWidth) + margins.left})
                              .attr("y", function(bar, i){console.log("bar-y:" + yScale(bar.length));return graphHeight + margins.top - yScale(bar.length)})
                              .attr("width", barWidth)
                              .attr("height", function(bar){console.log("Value:"+ bar.length + " Height:" +  yScale(bar.length));return yScale(bar.length)})
                              .attr("class", "graph-bar")


    var barLabels = graphData.selectAll("text")
                            .data(bins)
                            .enter()
                            .append("text")
                            .attr("x", function(bar, i){return (i * barWidth) + margins.left + (barWidth/2.4)})
                            .attr("y", function(){return graphHeight + margins.top + 30})
                            .text(function(bar){
                              //console.log("String", String(bar.x0) + "-" + String(bar.x1));
                              return String(bar.x0) + "-" + String(bar.x1);
                            })
                            .attr("class", "bar-label")
                            .attr("font-size", 25);

    d3.select(".day-label").text("")
                          .text("Day" + selectedDay.replace("day", ""))
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
  var xAxisScale = d3.scaleLinear()
                    .domain([0, dataSet[day].length])
                    .range([0, graphHeight]);

  var yScale = d3.scaleLinear()
                .domain([0, dataSet[day].length])
                .range([0, graphHeight]);

  var yAxisScale = d3.scaleLinear()
                .domain([0, dataSet[day].length])
                .range([graphHeight, 0]);

  var yAxis = d3.axisLeft()
                .scale(yAxisScale);

  var binMaker = d3.histogram()
                    .domain([0,10])
                    .thresholds([2, 4, 6, 8,]);

  var bins = binMaker(dataSet[day]);


  var barWidth = graphWidth / bins.length;


  //console.log("Input data:",  Object.keys(dataSet));
 console.log("bins:", bins);

  var colorScale = d3.scaleOrdinal(d3.schemeAccent);

  var graphSVG = d3.select(svgSelector)
              .attr("width", screen.width)
              .attr("height", screen.height)

  graphBorder = graphSVG.append("rect")
                     .attr("border-style", "solid")
                     .attr("x", margins.left)
                     .attr("y", margins.top)
                     .attr("width", graphWidth)
                     .attr("height", graphHeight)
                     .attr("fill", "#d5f4e6")
                     //.style("stroke", "black")
                     //.style("stroke-width", borderWidth)
                     .classed("graph-border", true);

  var dayLabel = graphSVG.append("g")
                        .append("text")
                        .attr("x", margins.left + graphWidth/2 - 50)
                        .attr("y", margins.top /2)
                        .attr("font-size", 40)
                        .text("Day"+selectedDay)
                        .classed("day-label", true);


  var graphData = graphSVG.append("g")
                    .attr("x", margins.left)
                    .attr("y", margins.top)
                    .classed("graph-data", true);

  var yAxis = graphSVG.append("g")
                      .call(yAxis)
                      .attr("transform", function(){
                      return "translate(" + (margins.left - 3) + "," + margins.top + ")";
                      });


  var graphBars = graphData.selectAll("rect")
                            .data(bins)
                            .enter()
                            .append("rect")
                            .attr("x", function(bar, i){return (i * barWidth) + margins.left})
                            .attr("y", function(bar, i){console.log("bar-y:" + yScale(bar.length));return graphHeight + margins.top - yScale(bar.length)})
                            .attr("width", barWidth)
                            .attr("height", function(bar){console.log("Value:"+ bar.length + " Height:" +  yScale(bar.length));return yScale(bar.length)})
                            .attr("class", "graph-bar");



  var barLabels = graphData.selectAll("text")
                          .data(bins)
                          .enter()
                          .append("text")
                          .attr("x", function(bar, i){return (i * barWidth) + margins.left + (barWidth/2.4)})
                          .attr("y", function(){return graphHeight + margins.top + 30})
                          .text(function(bar){
                            //console.log("String", String(bar.x0) + "-" + String(bar.x1));
                            return String(bar.x0) + "-" + String(bar.x1);
                          })
                          .attr("class", "bar-label")
                          .attr("font-size", 25);

  var xLabel = graphSVG.append("text")
                        .text("Score")
                        .attr("x", function(){return graphWidth/2 + margins.left - 35})
                        .attr("y", function(){return graphHeight + margins.top + 70})
                        .attr("font-size", 25)

    var yLabel = graphSVG.append("text")
                          .text("Frequency")
                          .attr("x", function(){return margins.left - 50})
                          .attr("y", function(){return margins.top - 10})
                          .attr("font-size", 20)
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
                    //d3.selectAll(".graph-bar").remove();
                    d3.selectAll(".bar-label").remove();
                    newSelectedDay = this.innerText;
                    dataPromise.then(function(data){
                        var reformattedData = reformatData(data);
                        updateChart(reformattedData, "#histogram", newSelectedDay, screenSettings, marginSettings);
                      });
                  });
  //console.log(dayButtons);
}

dataPromise.then(function(data){
      var reformattedData = reformatData(data);
      drawChart(reformattedData, "#histogram", 1, screenSettings, marginSettings);
      createDayMenu(reformattedData, ".pure-menu-list");
    });
window.alert("Day menu on the side can scroll.")


//Next: Set the buckets
