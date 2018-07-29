var margin = {top: 20, right: 50, bottom: 45, left: 250};

var svg = d3.select("div#vis2")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 480")
  .classed("svg-content", true);

var width = 960 - margin.left - margin.right;
var   height = 480 - margin.top - margin.bottom;

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("div#vis2").append("div").attr("class", "tooltip");

var x = d3.scaleBand()
    .rangeRound([0, width])
	 .padding(0.08);

var y = d3.scaleLinear()
    .range([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#9bc7e4", "#8ed07f", "#f7ae54"]);

var keys;

d3.csv("/d3-finalproject/data/top10employers.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.employer; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

var stackData1 = d3.stack().keys(keys)(data);
    stackData1.forEach(element => {
        var keyIdx = keys.findIndex(e => e === element.key);
        element.forEach(e2 => { e2.keyIdx = keyIdx; });
    });

  g.append("g")
	.selectAll("g")
	.data(stackData1)
	.enter().append("g")
	.attr("fill", function(d) { return z(d.key); })
	.selectAll("rect")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("x", function(d) { return x(d.data.employer); })
	.attr("y", function(d) { return y(d[1]); })
	.attr("height", function(d) { return y(d[0]) - y(d[1]); })
	.attr("width", x.bandwidth())
	.attr("stroke", "black")
	.on("mouseover", function() { tooltip.style("display", null); })
 	
  	.on("mousemove", function(d) {

	
		tooltip
		.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 120 + "px")
	  	.style("display", "inline-block")
		.html("Employer Name: <b>"+d.data.employer+"</b>"+ "<br>" + "Number of Employees: " +"<b>"+(d[1]-d[0]));    			
		})
		.on("mouseout", function(d) { tooltip.style("display", "none"); });

	g.append("g")
   	.selectAll("g")

    	.data(stackData1)
   	.enter().append("g")
   	.attr("fill", function(d) { return z(d.key); })
	.selectAll("text")
        .data(function(d) { return d; })
    	.enter().append("text")
	.attr("class","label")
    	.attr("x", function(d) { return x(d.data.employer)+ 10; })
    	.attr("y",function(d) { return y(d[1]); })
    	.text(function(d){return (d[1] - d[0]) ;})
	.attr("fill", "#000")
	.attr("font-weight", "bold");

  g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
	        .call(wrap,x.bandwidth());

  g.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(y).ticks(null, "s"))
		.append("text")
		.attr("transform", "rotate(-90)")	
     			.attr("y", -50)
			.attr("x",0 - (height / 4))
        		.attr("dy", "0.71em")
        		.attr("text-anchor", "center")
			.attr("fill", "black")
		.text("No. of Employees - (K)");


  var legend = svg.selectAll(".legend")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")
		.enter().append("g")
		.data(keys.slice().reverse())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
		.attr("x", width - 470)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z)
		.attr("stroke", "black");

  legend.append("text")
		.attr("x", width - 445)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; });

	rect2 = g.selectAll("rect");
    label2 = g.selectAll(".label");
});

d3.selectAll("input[name=mode1]")
    .on("change", changed);

function changed() {
    if (this.value === "stacked") transitionStep11();
    else if (this.value === "grouped") transitionStep22();
}

function transitionStep11() {
    rect2.transition()
    .attr("y", function(d) { return y(d[1]); })
    .attr("x", function(d) { return x(d.data.employer); })
    .attr("width", x.bandwidth());
   
     label2.transition()
    .attr("x", function(d) { return x(d.data.employer)+ 10; })
    .attr("y",function(d) { return y(d[1]); });
}

function transitionStep22() {
	
   rect2.transition()
    .attr("x", function(d, i) { return x(d.data.employer) + x.bandwidth() / (keys.length+1) * d.keyIdx; })
    .attr("width", x.bandwidth() / (keys.length+1))
    .attr("y", function(d) { return y(d[1] - d[0]); });
	
  label2.transition()
    .attr("x", function(d, i) { return x(d.data.employer) + x.bandwidth() / (keys.length+1) * d.keyIdx; })     
    .attr("y", function(d) { return y(d[1] - d[0]); });

}
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
