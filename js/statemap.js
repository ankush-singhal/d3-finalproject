var margin2 = {top: 20, right: 160, bottom: 25, left: 30};

var width2 = 1200 - margin2.left - margin2.right,
    height2 = 700 - margin2.top - margin2.bottom;

var svg2 = d3.select("div#vis3")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g");
  
function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
		return  "<table>"+
			"<tr><td>State Name:"+"<b>"+n+"</b>"+"</td></tr>"+
			"<tr><td>Number of PERM Applications:"+"<b>"+(d.Count)+"</b>"+"</td></tr>"+
			"</table>";
	}
var Data ={};
d3.csv("/CS498FinalTermProject-PERMAnalysis/data/perm-state.csv", function(data){
data.forEach(function(d) {
	Data[d.State]= {
	Count :  +d.Count,
	color : color(d.Count)};  
  });
uStates.draw("div#vis3 svg g",Data, tooltipHtml);
});
var color = d3.scaleThreshold()
     .domain([5000,15000,25000,50000,75000,100000])
	 .range(d3.schemeBlues[9]);
//Adding legend for our Choropleth
var ext_color_domain = [5000,15000,25000,50000,75000,100000]
var legend_labels = ["< 500", "500 - 1k", "1k - 5k", "5k - 15k", "15k - 25k","25k - 50k"]
  var legend2 = svg2.selectAll("g.legend")
  .data(ext_color_domain)
  .enter().append("g")
  .attr("class", "legend");
  var ls_w = 20, ls_h = 20;
  legend2.append("rect")
  .attr("x", 870)
  .attr("y", function(d, i){ return 450 - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.9)
  .style("stroke", "black")
  .style("stroke-width", 1);
  legend2.append("text")
  .attr("x", 880)
  .attr("y", function(d, i){ return 430 - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; });
  
  legend2.append("text")
  .attr("x", 880)
  .attr("y", function(d, i){ return 450 - (10*ls_h) - ls_h - 4;})
  .text("Number of PERM Application");
