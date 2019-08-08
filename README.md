# d3Animations

### zoomToCountry(element, topojson, country)  
Zooms, centers, and colors a particular country from a list of countries. The first argument passed is the element to attach the map to, the second is the JSON object with all of the countries, and the third argument is a string representing the country of interest (must match the geounit string).



### visualizeCityRoads(element, geojson)  
Draws roads of a particular area of interest given a geojson input (can download from openstreetmap).


### circleChart(element, values, [options])  
Draws an animated circle chart based on an array of values. The chart can be customized by passing in an object with the following values:  
- label *string*: the field responsible for labels (required if an object is passed instead of an array of values)  
- values *string*: the field responsible for values (required if an object is passed instead of an array of values)
- duration *integer*: total duration of the animation. default: `500ms` per value in values
- colorArray *array*: array of custom color values. default: `["#C0392B", "#9B59B6", "#2980B9", "#1ABC9C", "#27AE60", "#F1C40F", "#E67E22", "#E74C3C", "#8E44AD", "#3498DB", "#16A085", "#D35400"]`
- thickness *integer*: value between 0 and 1 where 1 is a full circle

### rasterOnMap(element, topojson[, colors, basemap, intro, duration])  
Animates a raster on top of a chosen basemap.   
- colors *array*: array of colors for raster representation.  default: Greens
- basemap *string*: one of the following mapbox basemaps: streets-v9, satellite-v9, outdoors-v9, light-v9, dark-v9, satellite-streets-v9. default: `dark-v9`
- intro *integer*: duration of the zoom to area of interest. default: 0
- duration *integer*: duration of the raster tile appearance. default: 0