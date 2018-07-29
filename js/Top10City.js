var margin1 = {top: 20, right: 160, bottom: 35, left: 100};

var svg1 = d3.select("div#vis1")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 500")
  .classed("svg-content", true);

 var width1 = 960 - margin1.left - margin1.right;
 var height1 = 500 - margin1.top - margin1.bottom;
  
var g1 = svg1.append("g")
  .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var tooltip1 = d3.select("div#vis1").append("div").attr("class", "tooltip")

var x1 = d3.scaleBand()
    .rangeRound([0, width1])
    .padding(0.08);

var y1 = d3.scaleLinear()
    .range([height1, 0]);

var z = d3.scaleOrdinal()
    .range(["#9bc7e4", "#8ed07f", "#f7ae54"]);

var keys;

d3.csv("/CS498FinalTermProject-PERMAnalysis/data/top10cities.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}, function(error, data) {
    if (error) throw error;

    keys = data.columns.slice(1);
    data.sort(function(a, b) { return b.total - a.total; });	
    x1.domain(data.map(function(d) { return d.city; }));
    y1.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    z.domain(keys);

    var stackData = d3.stack().keys(keys)(data);
    stackData.forEach(element => {
        var keyIdx = keys.findIndex(e => e === element.key);
        element.forEach(e2 => { e2.keyIdx = keyIdx; });
    });

    g1.append("g")
    .selectAll("g")
    .data(stackData)
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
        .attr("x", function(d) { return x1(d.data.city); })
        .attr("y", function(d) { return y1(d[1]); })
        .attr("height", function(d) { return y1(d[0]) - y1(d[1]); })
        .attr("width", x1.bandwidth())
        .attr("stroke", "black")	
	.on("mouseover", function() { tooltip1.style("display", null); })
  	.on("mousemove", function(d) {
		tooltip1
		.style("left", d3.event.pageX - 50 + "px")
         	.style("top", d3.event.pageY - 250 + "px")
	  	.style("display", "inline-block")
		.html("City Name: <b>"+d.data.city+"</b>"+ "<br>" + "Number of Employees: " +"<b>"+(d[1]-d[0]));    			
		})
	.on("mouseout", function(d){ tooltip1.style("display", "none");});
	
	g1.append("g")
   	.selectAll("g")
    	.data(stackData)
   	.enter().append("g")
   	.attr("fill", function(d) { return z(d.key); })
	.selectAll("text")
        .data(function(d) { return d; })
    	.enter().append("text")
	.attr("class","label")
    	.attr("x", function(d) { return x1(d.data.city)+ 10; })
    	.attr("y",function(d) { return y1(d[1]); })
    	.text(function(d){return (d[1] - d[0]) ;})
	.attr("fill", "#000")
	.attr("font-weight", "bold");
	//x-axis
	 g1.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + 445 + ")")
			.call(d3.axisBottom(x1))
			.selectAll("text")
			.append("text")			
			.attr("x", 300)
			.attr("y", 0)
			.attr("dx", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "center")
			.attr("fill", "black")
			.text("City Name");
	//y-axis
	  g1.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y1).ticks(null, "s"))
			.append("text")
			.attr("transform", "rotate(-90)")	
     			.attr("y", -50)
			.attr("x",0 - (height1 / 4))
        		.attr("dy", "0.71em")
        		.attr("text-anchor", "center")
			.attr("fill", "black")
			/*.attr("x", 2)
			.attr("y", y1(y1.ticks().pop()) + 0.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")*/
			.text("No. of Employees - (K)");
	
	
	var legend1 = svg1.selectAll(".legend")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "end")      
		.enter().append("g")
		.data(keys.slice().reverse())		
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend1.append("rect")
		.attr("x", width1 - 270)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z)
		.attr("stroke", "black");

	legend1.append("text")
		.attr("x", width1 - 245)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; });
	
    rect = g1.selectAll("rect");
    label = g1.selectAll(".label");
});

d3.selectAll("input")
    .on("change", changed);

function changed() {
    if (this.value === "stacked") transitionStep1();
    else if (this.value === "grouped") transitionStep2();
}

function transitionStep1() {
    rect.transition()
    .attr("y", function(d) { return y1(d[1]); })
    .attr("x", function(d) { return x1(d.data.city); })
    .attr("width", x1.bandwidth());
   
     label.transition()
    .attr("x", function(d) { return x1(d.data.city)+ 10; })
    .attr("y",function(d) { return y1(d[1]); });
}

function transitionStep2() {
	
   rect.transition()
    .attr("x", function(d, i) { return x1(d.data.city) + x1.bandwidth() / (keys.length+1) * d.keyIdx; })
    .attr("width", x1.bandwidth() / (keys.length+1))
    .attr("y", function(d) { return y1(d[1] - d[0]); });
	
  label.transition()
    .attr("x", function(d, i) { return x1(d.data.city) + x1.bandwidth() / (keys.length+1) * d.keyIdx; })     
    .attr("y", function(d) { return y1(d[1] - d[0]); });
}
