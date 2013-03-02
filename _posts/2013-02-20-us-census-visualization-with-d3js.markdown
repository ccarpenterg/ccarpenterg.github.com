---
layout: post
title: "US Census Visualization with D3.js"
description: "William the Conqueror ordered the compilation of the Domesday Book in 1086, the first census of England"
category: 
javascripts: ['d3']
extra-css:
  - /css/KY-counties20.css
tags: [D3.js, visualization]
---

+-- {#KY-population}
This is a Population Map of Kentucky Counties created using [D3.js][1], a Census 2010 Shapefile and [GDAL][2] (for geospatial data processing),
inspired by the [American Community Survey Handbook][3].
=--

It's really easy to create a map using D3.js. You just need a [GeoJSON][4] file and you're done. Having said that you have to have a minimum skillset
to process the data and a bit of experience on map projections:

{% highlight javascript %}
var projection = d3.geo.mercator()
    .scale(29100)
    .translate([7310, 3500]);

var path = d3.geo.path()
    .projection(projection);

svg.append("g")
    .attr("id", "counties")
    .selectAll("path")
    .data(counties.features)
    .enter().append("path")
    .attr("d", path);
{% endhighlight %}

###Census Geospatial Data and GeoJSON

D3.js uses the GeoJSON format to display maps. GeoJSON supports a variety of geographic data structures like 
Points, LineStrings and Polygons, and aditional properties like strings and numbers.

The Census Bureau has made available all the Geospatial data through the [TIGER Shapefiles][5]. And all you need to create a map is in these Shapefiles.
Each zipped shapefile has the following files:

- .shp the feature geometry
- .shx the index of the feature geometry
- .dbf the tabular attribute information
- .prj the coordinate system information

And in order to use the Census geographic data with D3.js you have to convert it to GeoJSON first.

###Tools of the Trade

####Data Processing

When you're dealing with Geospatial data you need a tool to explore it and convert it to other formats. GDAL is shipped with two great tools
to do this job: ``ogrinfo`` and ``ogr2ogr``. 

[ogrinfo][6] is very useful to explore Shapefiles:

    ogrinfo -so gz_2010_us_050_00_20m.shp gz_2010_us_050_00_20m

    Layer name: gz_2010_us_050_00_20m
    Geometry: Polygon
    Feature Count: 3221
    Extent: (-179.147340, 17.884813) - (179.778470, 71.352561)
    Layer SRS WKT:
    GEOGCS["GCS_North_American_1983",
	DATUM["North_American_Datum_1983",
	    SPHEROID["GRS_1980",6378137,298.257222101]],
	PRIMEM["Greenwich",0],
	UNIT["Degree",0.017453292519943295]]
    GEO_ID: String (60.0)
    STATE: String (2.0)
    COUNTY: String (3.0)
    NAME: String (90.0)
    LSAD: String (7.0)
    CENSUSAREA: Real (31.15)

So in that Geospatial file we have the boundaries of 3221 counties. But in this case we just need a map of Kentucky:

    ogrinfo -so gz_2010_us_050_00_20m.shp gz_2010_us_050_00_20m -where 'STATE="21"'

GDAL also supports SQL language:

    ogrinfo -al gz_2010_us_050_00_20m.shp /
    -sql 'SELECT * FROM gz_2010_us_050_00_20m where STATE="21"'

Since we now know what we want and how to get it we're ready to generate our GeoJSON file using [ogr2ogr][7]:

    ogr2ogr -f geoJSON KY-counties.json -where 'STATE="21"' gz_2010_us_050_00_20m.shp

###Visualization

Well now we have to visualize the data on the map so I've chosen the Choropleth map visualization to represent the population for each county.
When it comes to styles D3.js is quite straightforward. First define the classes styles:

{% highlight css %}
.tier-1 { fill:rgb(229, 245, 224); }
.tier-2 { fill:rgb(161, 217, 155); }
.tier-3 { fill:rgb(49, 163, 84); }
{% endhighlight %}

Then assign the right class to each node:

{% highlight javascript %}
svg.append("g")
    .attr("id", "counties")
    .selectAll("path")
    .data(counties.features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", function (d) {}); // return the right class
{% endhighlight %}

###Further Reading

- Census Bureau Data Visualization Gallery (without D3.js): [http://www.census.gov/dataviz/][8]
- Unemployment rates in US (2008): [http://bl.ocks.org/mbostock/4060606][9]
- US Airports Interactive Map: [http://mbostock.github.com/d3/talk/20111116/airports.html][10]

<script src="/d3/KY-counties20.js">
</script>

[1]: http://d3js.org
[2]: http://www.gdal.org
[3]: http://www.census.gov/acs/www/Downloads/handbooks/ACSGeneralHandbook.pdf
[4]: http://www.geojson.org
[5]: http://www.census.gov/geo/maps-data/data/tiger.html
[6]: http://www.gdal.org/ogrinfo.html
[7]: http://www.gdal.org/ogr2ogr.html
[8]: http://www.census.gov/dataviz/
[9]: http://bl.ocks.org/mbostock/4060606
[10]: http://mbostock.github.com/d3/talk/20111116/airports.html
