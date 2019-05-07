dataP = d3.json("data/industry_data.json");

//Global GraphSettings---------------------------------------------------
svgScreen = {
  width: 800,
  height: 500,
}

svgMargin = {
  top: 50,
  bottom:30,
  left: 100,
  right: 240
}

var currentYear = 0;

var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear();
var colors = d3.scaleOrdinal([
"#4c78a8","#9ecae9","#f58518","#ffbf79","#54a24b","#88d27a","#b79a20","#f2cf5b","#439894","#83bcb6","#e45756","#ff9d98","#79706e", "#bab0ac", "#d67195","#fcbfd2","#b279a2","#d6a5c9","#9e765f","#d8b5a5"])
//var colors = d3.scale.category20();

var industry_list = ["Agriculture, Forestry and Fisheries", "Mining", "Food", "Texitile", "Paper and Pulp", "Chemical",
                      "Oil and Coal Product", "Ceramics, Stone Product", "Manufacture of Metal", "Fabricated Metal Product",
                      "Manufacture of General Purpose Machinery", "Manufacture of Electrical Machinery",
                      "Manufacture of Transportation Equipment","Manufacture of Precision Instrument industry", "Other Manufacture",
                      "Construction", "Electricity, gas, heat supply and water", "Retail","Finance and Insurance", "Real Estate",
                      "Transportation and Communication", "Services(Private, Non-profit)", "Services(Government)"]
//-----------------------------------------------------------------------


//Initializers-----------------------------------------------------------
var initScales = function(data, selectedVars, electedIndustries){
  collectiveValArrX = []
  data[selectedVars["x"]].industries.forEach(function(industryObj, i){
    // console.log("Industry:", industryObj.values)
    // console.log("Industry extent:", d3.extent(industryObj.values))
    // console.log("min:", d3.min(industryObj.values))
    // console.log("max", d3.max(industryObj.values));
    //
    // console.log("----------------")
    collectiveValArrX = collectiveValArrX.concat(d3.extent(industryObj.values));
    //console.log("extent:", collectiveValArrX.concat(d3.extent(industrObj.values)));

  });

  collectiveValArrY = []
  data[selectedVars["y"]].industries.forEach(function(industryObj, i){
    collectiveValArrY = collectiveValArrY.concat(d3.extent(industryObj.values));
    //console.log("extentY:", collectiveValArrY.concat(d3.extent(industrObj.values)));
  });
  //console.log("reducedY:", d3.extent(collectiveValArrY));
  //console.log("collectiveY:", d3.extent(collectiveValArrY));



  xScale.domain(d3.extent(collectiveValArrX))
        .range([svgMargin.left, svgScreen.width - svgMargin.right])
        //.nice();
  yScale.domain(d3.extent(collectiveValArrY))
        .range([svgScreen.height - svgMargin.top - svgMargin.bottom, svgMargin.top])
        //.nice();

  // xAxis.scale(xScale);
  // yAxis.scale(yScale);
  console.log("ScaleCheck X:", xScale.domain(), xScale.range());
  console.log("ScaleCheck y:", yScale.domain(), yScale.range())

};


var getSelectedVars = function(data){
  xVar = d3.select("#x-var").node().options[d3.select("#x-var").node().selectedIndex].value;
  yVar = d3.select("#y-var").node().options[d3.select("#y-var").node().selectedIndex].value;
  console.log("USING X=" + xVar + "   Y=" + yVar);
  indices = {}
  data.forEach(function(d, i){
    console.log("Checkking", d.dataType, "AND", yVar)
    console.log(d.dataType == yVar)
    if (d.dataType == xVar){indices["x"] = i;}
    if (d.dataType == yVar){indices["y"] = i;}
  });
  console.log("Selected Vars:", indices);
  return indices;
};
//-----------------------------------------------------------------------

var setUp = function(data){
  svg = d3.select("#chart-section")
          .append("svg")
          .attr("width", svgScreen.width)
          .attr("height", svgScreen.height)
          .attr("class", "chart-svg");

  graphBackground = svg.append("rect")
                      .attr("x", svgMargin.left)
                      .attr("width", svgScreen.width - svgMargin.left - svgMargin.right)
                      .attr("height", svgScreen.height - (svgMargin.bottom + svgMargin.top))
                      .attr("stroke-width", 5)
                      .attr("stroke", "black")
                      .attr("fill", "white")
                      .classed("graph-bg", true);
                      var d1 = [10,5,20,30];
  //Event listeners
};

var setUpEventListeners = function(data){
  d3.select("#start-animation")
    .on("click", function(){
      updateChart(data, 40);

    });

    d3.select("#x-var")
      .on("change", function(){
        d3.select("#chart-section>svg").node().remove();
        setUp();
        drawChart(data, currentYear);
      });

  d3.select("#y-var")
    .on("change", function(){
      d3.select("#chart-section>svg").node().remove();
      setUp();
      drawChart(data, currentYear);
    });
}

//-----------Supporter functions--------------
var getValueArrBetween = function(start, end){
  valuesInBetween = []
  if (start <= end){
    for (var i=start + 1; i <= end; i++){
      valuesInBetween.push(i)
    }}
  else  if (start > end){
      for (var i=start - 1; i >= end; i--){
        valuesInBetween.push(i)
      };
  };
  return valuesInBetween;  //This does not include the start value
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
};
//--------------------------------------------

var drawChart = function(data, year){
  svg = d3.select("#chart-section>svg");
  yearsInBetween = getValueArrBetween(0, year);
  //svg.call(yAxis);
  //Pick x & y variables
  selectedVars = getSelectedVars(data);
  initScales(data, selectedVars, industry_list);

  var xAxis = d3.axisBottom().scale(xScale).ticks(5);
  var yAxis = d3.axisLeft().scale(yScale);

  svg.append("g")
      .attr("class", "x-axis")
        .attr("transform", "translate(0," +(svgScreen.height - svgMargin.top - svgMargin.bottom) + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + svgMargin.left + ",0)")
      .call(yAxis);

  svg.append("g")
      .attr("class", "year-label-section")
      .append("text")
      .attr("class", "year-label")
      .text("Year: " + (1970 + currentYear))
      .attr("transform", "translate(" + (svgMargin.left + (svgScreen.width/2) - 280) + "," + (svgScreen.height - 32) +")")
      .attr("font-size", "20px");


  //legend
  legendRects = svg.append("g")
                    .attr("class", "legened-rect")
                    .selectAll("rect")
                    .data(industry_list)
                    .enter()
                    .append("rect")
                    // .attr("x", svgScreen.width - svgMargin.right + 10)
                    // .attr("y", svgrScreen.height - svgMargin.top)
                    .attr("width", 13)
                    .attr("height", 13)
                    .attr("transform", function(d, i){return "translate(" + (svgScreen.width - svgMargin.right + 10) + "," + ((16 * i) + 5) + ")"})
                    .attr("fill", function(d, i){return colors(d)});

  legendTexts = svg.append("g")
                    .attr("class", "legened-rect")
                    .selectAll("text")
                    .data(industry_list)
                    .enter()
                    .append("text")
                    .attr("transform", function(d, i){return "translate(" + (svgScreen.width - svgMargin.right + 27) + "," + ((16 * i) + 16) + ")"})
                    //.attr("fill", function(d, i){return colors(d)})
                    .attr("font-size", 12)
                    .text(function(d, i){return d});

if (year === 0){

  dots = svg.append("g")
            .attr("class", "data-points")
            .selectAll("circle")
            .data(data[selectedVars["x"]].industries)
            .enter()
            .append("circle")
            .attr("cx", function(industryObj, i){return xScale(industryObj.values[year])})
            .attr("cy", function(industryObj, i){return yScale(data[selectedVars["y"]].industries[i].values[year])})
            .attr("r", 4)
            .attr("fill", function(industrObj){return colors(industrObj.industry_name)})
            .attr("id", function(industryObj, i){console.log("running"); return "dot-" + i})
            .attr("class", "data-dot");
  };
  // testDot = d3.select(".data-points")
  //           .append("circle")
  //           .attr("cx", xScale(15000000))
  //           .attr("cy", yScale(70000000))
  //           .attr("r", 20)
  //           .classed("test-circle", true)




  pathGroup = svg.append("g")
          .attr("class", "dot-traces");

 industry_list.forEach(function(industry_name, industry_index){
   var line = d3.line()
                    .x(function(val, yearNum) { return xScale(data[selectedVars["x"]].industries[industry_index].values[yearNum]); })
                    .y(function(val, yearNum) { return yScale(data[selectedVars["y"]].industries[industry_index].values[yearNum]); });

   pathGroup.append("path")
       //.datum(data, function(data){console.log("IN:" + data[selectedVars["x"]].industries[industry_index].values);return data[selectedVars["x"]].industries[industry_index].values})
       .attr("fill", "none")
       .attr("stroke", colors(industry_name))
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 6)
       .attr("class","data-path")
       .attr("d", line(data[selectedVars["x"]].industries[industry_index].values.slice(0, year + 1)));

 });
};

var updateChart = function(data, targetYear){
  console.log("UPDATING")
  yearsInBetween = getValueArrBetween(currentYear, targetYear);
  console.log("Years in Between:" ,yearsInBetween)
  // testCircle = d3.select(".test-circle")
  //                 .transition()
  //                 .duration(1000)
  //                 .attr("cx", xScale(15000000))
  //                 .attr("cy", yScale(60000000))

                            // yearsInBetween.forEach(function(year, year_index){
    //   console.log("Year", year)
    //             dotTransitions.transition()
    //               .duration(500)
    //               .delay(500 * year_index)
    //               .attr("cx", function(industrObj, i){return xScale(data[selectedVars["x"]].industries[i].values[year])})
    //               .attr("cy", function(industrObj, i){return yScale(data[selectedVars["y"]].industries[i].values[year])});
    //   });
      //---path animation


    industry_list.forEach(function(industry_name, industry_index){
      labelTransition = d3.select(".year-label")
                          .transition()
                          .duration(1000)
                          .delay(1000)
                          .text("Year: 1970→2012")

        var line = d3.line()
                         .x(function(val, yearNum) { return xScale(data[selectedVars["x"]].industries[industry_index].values[yearNum]); })
                         .y(function(val, yearNum) { return yScale(data[selectedVars["y"]].industries[industry_index].values[yearNum]); });

            //.datum(data, function(data){console.log("IN:" + data[selectedVars["x"]].industries[industry_index].values);return data[selectedVars["x"]].industries[industry_index].values})
            console.log("pathTrans", d3.selectAll(".data-path").filter(function (d, i) { return i === industry_index;}))
            pathTransitions = d3.selectAll(".data-path")
                                .filter(function (d, i) { return i === industry_index;})
                                .transition()
                                .duration(500)
                                .delay(500)
                                .attr("d", line(data[selectedVars["x"]].industries[industry_index].values.slice(0, currentYear + 2)));


            yearsInBetween.forEach(function(year, year_index){
              pathTransitions.transition()
                              .duration(500)
                              .delay(500*year_index)
                              .attr("d", line(data[selectedVars["x"]].industries[industry_index].values.slice(0, year + 1)));
              // labelTransition.transition()
              //                 .duration(1000)
              //                 .delay(1000)
              //                 .text(1970 + year + 2)
            });

    });
    dotTransitions = d3.selectAll(".data-dot")
                        .attr("fill", "none");

};

dataP.then(function(data){
  console.log(data);
  setUp(data);
  setUpEventListeners(data);
  drawChart(data, currentYear);
});


//Next: Display images;
