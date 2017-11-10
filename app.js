var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("ownerSmoker.csv", function(err, ownerSmoker) {
  if (err) throw err;

  ownerSmoker.forEach(function(data) {
    data.percSmoke = +data.percSmoke;
    data.percOwn = +data.percOwn;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([8, d3.max(ownerSmoker, function(data) {
    return +data.percSmoke;
  })]);
  yLinearScale.domain([35, d3.max(ownerSmoker, function(data) {
    return +data.percOwn * 1.05;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var stateName = data.stateName;
      var percSmoke = +data.percSmoke;
      var percOwn = +data.percOwn;
      return (stateName + "<br> Smoker: " + percSmoke + "<br> Owner Occupied Units: " + percOwn);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(ownerSmoker)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.percSmoke);
        return xLinearScale(data.percSmoke);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.percOwn);
      })
      .attr("r", "11")
      .attr("fill", "lightcoral")
      .on("click", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);  
      });
      
      chart.selectAll("text")
      .data(ownerSmoker)
      .enter().append("text")
      .attr("class", "text")
      .attr("x", function(data, index) {
        return xLinearScale(data.percSmoke);
      })
      .attr("y", function(data, index) {
        return yLinearScale(data.percOwn);
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "11")
      .text(function(data, index) {
        return data.state});




  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Owner Occupied Homes (%)");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Cigarette Smokers (%)");
});


