---
layout: post
title: "Calendar Layout: Visualising Market Data"
description: ""
category: 
extra-css:
  - /css/colorbrewer.css
  - /css/euro.css
tags: [D3.js, Visualization]
---

+-- {#datavis}
This is a Calendar Layout of the **Euro-US Dollar Rate's Daily Change** built with [D3.js][1]. The daily change is visualized as colored cells. 
Values range between -4% and 4% (dark red and dark green cells). And yellow cells for values around zero.
=--

The Calendar visualization is very useful when the user wants to spot changes on a specific day. This is an advantage compared to
Line Charts since it's hard to visualize more than 30 days on the x-axis in a Line Chart.

###The Calendar Visualization

The Calendar is a matrix-like visualization. It uses weeks as columns and days as rows. So for example, the element at (3, 10) 
represents a Tuesday on the 10th week of a specific year.

In order to draw every day you create a cell (a SVG rectangle) at each position (*x*, *y*), where *x* is given by the week and *y* is given by the
day:

{% highlight javascript %}

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), 
                        new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })

{% endhighlight %}

###Further Reading

- [Dow Jones historical data][2]
- [U.S. Commercial Flights][3]
- [Visualising domestic airline traffic with SAS][4]

<script src="/javascripts/d3.js">
</script>
<script src="/d3/euro.js">
</script>

[1]: http://d3js.org
[2]: http://bl.ocks.org/mbostock/4063318
[3]: http://mbostock.github.com/d3/talk/20111018/calendar.html
[4]: http://stat-computing.org/dataexpo/2009/posters/wicklin-allison.pdf
