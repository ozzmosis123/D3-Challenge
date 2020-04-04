// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();


// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
    xText.attr(
        "transform",
        "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"
    );
}
xTextRefresh();

///////////
// X Axis
///////////

// Poverty
xText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty (%)");

//  Age

xText
    .append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("age (median)")


// Income

xText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("income")



///////////
// Y Axis
///////////

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

function yTextRefresh() {
    yText.attr(
        "transform",
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();


// 1. Obesity
yText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obesity");


// 2. Smokes
yText
    .append("text")
    .attr("x", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Obesity");


// 3. Lacks Healthcare
yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Healthcare");



    // importing the CSV File
    d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
});


// This is the start of the main function that visualizes evertything
function visualize(theData) {
    var curX = "poverty";
    var curY = "obesity";

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // This function allows us to set up tooltip rules (see d3-tip.js).
    var toolTip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([40, -60])
      .html(function(d) {
    // x key
    var theX;
    // Grab the state name.
    var theState = "<div>" + d.state + "</div>";
    // Snatch the y value's key and value.
    var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
    // If the x key is poverty
    if (curX === "poverty") {
      // Grab the x key and a version of the value formatted to show percentage
      theX = "<div>" + curX + ": " + d[curX] + "%</div>";
    }
    else {
      // Otherwise
      // Grab the x key and a version of the value formatted to include commas after every third digit.
      theX = "<div>" +
        curX +
        ": " +
        parseFloat(d[curX]).toLocaleString("en") +
        "</div>";
    }
    // Display what we capture.
    return theState + theX + theY;
  });
    
    // Call the toolTip function.
    svg.call(toolTip);

    
    function xMinMax() {
        // min will grab the smallest datum from the selected column.
        xMin = d3.min(theData, function(d) {
          return parseFloat(d[curX]) * 0.90;
        });
        // .max will grab the largest datum from the selected column.
        xMax = d3.max(theData, function(d) {
          return parseFloat(d[curX]) * 1.10;
        });
      }
      
      // b. change the min and max for y
    function yMinMax() {
        // min will grab the smallest datum from the selected column.
        yMin = d3.min(theData, function(d) {
          return parseFloat(d[curY]) * 0.90;
        });
        // .max will grab the largest datum from the selected column.
        yMax = d3.max(theData, function(d) {
          return parseFloat(d[curY]) * 1.10;
        });
      }
      
      // c. change the classes (and appearance) of label text when clicked.
    function labelChange(axis, clickedText) {
        // Switch the currently active to inactive.
        d3
          .selectAll(".aText")
          .filter("." + axis)
          .filter(".active")
          .classed("active", false)
          .classed("inactive", true);
        // Switch the text just clicked to active.
        clickedText.classed("inactive", false).classed("active", true);
      }
      xMinMax();
      yMinMax();

    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelArea, width - margin]);
    
    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelArea, margin]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    function tickCount() {
      if (width <= 500) {
          xAxis.ticks(5);
          yAxis.ticks(5);
      } else {
          xAxis.ticks(10);
          yAxis.ticks(10);
      }
  }
  tickCount();
  
  svg
      .append("g")
      .call(xAxis)
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
      .append("g")
      .call(yAxis)
      .attr("class", "yAxis")
      .attr("transform", "translate(" + (margin + labelArea) + ", 0)");
  
  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    // Append the circles for each row of data
    theCircles
      .append("circles")
      .attr("cx", function(d) {
        console.log(d[curX])
        console.log(xScale(d[curX]))
        return xScale(d[curX])
        
      })
      .attr("cy", function(d) {
        return yScale(d[curY])
      })
      .attr("r", circRadius)
      .attr("class", function(d) {
        return "stateCircle " + d.abbr
      })

      // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });
    
    
    // Grab the state abbreviations from our data and place them in the center of our dots.
    theCircles
      .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
      .text(function(d) {
        return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
}






