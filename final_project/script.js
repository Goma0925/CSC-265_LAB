dataP = d3.json("data/industry_data.json");

//Global GraphSettings---------------------------------------------------
svgScreen = {
  width: 700,
  height: 500,
}

svgMargin = {
  top: 30,
  bottom:30,
  left: 100,
  right: 40
}

var currentYear = 0;

var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear();
var colors = d3.scaleOrdinal(d3.schemeAccent)

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
    if (d.dataType === xVar){indices["x"] = i;}
    if (d.dataType === yVar){indices["y"] = i;}
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
                      .attr("height", svgScreen.height - svgMargin.bottom - svgMargin.top)
                      .attr("stroke-width", 2)
                      .attr("stroke", "black")
                      .attr("fill", "white")
                      .classed("graph-bg", true);
                      var d1 = [10,5,20,30];
  //Event listeners
};

var setUpEventListeners = function(data){
  d3.select("#start-animation")
    .on("click", function(){
      updateChart(data, 1);
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
}
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

  dots = svg.append("g")
            .attr("class", "data-points")
            .selectAll("rect")
            .data(data[selectedVars["x"]].industries)
            .enter()
            .append("circle")
            .attr("cx", function(industryObj, i){return xScale(industryObj.values[year])})
            .attr("cy", function(industryObj, i){return yScale(data[selectedVars["y"]].industries[i].values[year])})
            .attr("r", 5);
  pathGroup = svg.append("g")
          .attr("class", "dot-traces")

 industry_list.forEach(function(industry_name, industry_index){
   var line = d3.line()
                    .x(function(val, year) { return xScale(data[selectedVars["x"]].industries[industry_index].values[year]); })
                    .y(function(val, year) { return yScale(data[selectedVars["y"]].industries[industry_index].values[year]); });

console.log("" + data[selectedVars["x"]].industries[industry_index].values.slice(0, currentYear))
   pathGroup.append("path")
       .datum(data, function(d){data[selectedVars["x"]].industries[industry_index].values.slice(0, currentYear)})
       .attr("fill", colors(industry_name))
       .attr("fill", "none")
       .attr("stroke", colors(industry_name))
       .attr("stroke-linejoin", "round")
       .attr("stroke-linecap", "round")
       .attr("stroke-width", 3)
       .attr("class","path-" + industry_name)
       .attr("d", line);

 });
};

var updateChart = function(data, targetYear){
  yearsInBetween = getValueArrBetween(currentYear, targetYear);

  yearsInBetween.forEach(function(year){
      dots = d3.select("data-points")
                .selectAll("circle")
                .data(data)
  });
};

dataP.then(function(data){
  console.log(data);
  setUp(data);
  setUpEventListeners(data);
  drawChart(data, currentYear);
});


//Next: Display images;
