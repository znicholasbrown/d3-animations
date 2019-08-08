function rasterOnMap(element, json, colors, intro, duration) {
  colors === undefined
    ? (colors = [
        "#F1F8E9",
        "#DCEDC8",
        "#C5E1A5",
        "#AED581",
        "#9CCC65",
        "#8BC34A",
        "#7CB342",
        "#689F38",
        "#558B2F",
        "#33691E"
      ])
    : (colors = colors);
  intro !== undefined ? (intro = intro) : (intro = 0);
  duration !== undefined ? (duration = duration) : (duration = 0);
  let width = $(element).innerWidth(),
    height = $(element).innerHeight();

  let features = topojson.feature(
    json,
    json.objects[Object.keys(json.objects)[0]]
  ).features;

  mapboxgl.accessToken =
    "pk.eyJ1Ijoiem5pY2hvbGFzYnJvd24iLCJhIjoiY2o5enRqNTE0OG5tbDJxcGFjb2FrMHdsbCJ9.2Qtt9ub_mkuW-KOh1HcVXQ";
  let map = new mapboxgl.Map({
    container: "root",
    style: "mapbox://styles/mapbox/dark-v9",
    interactive: false
  });

  map.on("load", () => {
    let bounds = new mapboxgl.LngLatBounds();
    let geojson = topojson.feature(
      json,
      json.objects[Object.keys(json.objects)[0]]
    );

    geojson.features.forEach(feature => {
      try {
        bounds.extend(feature.geometry.coordinates[0]);
      } catch (err) {}
    });

    map.fitBounds(bounds);
    map.addLayer({
      id: "features",
      type: "fill",
      source: {
        type: "geojson",
        data: geojson
      },
      paint: {
        "fill-color": "transparent"
      }
    });

    map.fitBounds(bounds, { duration: intro });

    let container = map.getCanvasContainer();
    let svg = d3.select(container).append("svg");

    let valueProp = Object.keys(features[0]["properties"])[1];
    let min = 0,
      max = 0;

    features.map((d, i) => {
      let prop = d.properties[valueProp];

      if (prop > max) {
        max = prop;
      }
      if (prop < min) {
        min = prop;
      }
    });

    let color = d3
      .scaleQuantile()
      .domain([min, max])
      .range(colors);

    setTimeout(() => {
      let transform = d3.geoTransform({ point: projectPoint });
      let path = d3.geoPath().projection(transform);
      function projectPoint(lon, lat) {
        let point = map.project(new mapboxgl.LngLat(lon, lat));
        this.stream.point(point.x, point.y);
      }

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      }

      let baseMap = svg.append("g");
      baseMap
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill-opacity", 0)
        .style("fill", d => {
          let quantiles = color.quantiles(d.properties[valueProp]);

          return d.properties[valueProp] < quantiles[0]
            ? "transparent"
            : color(d.properties[valueProp]);
        })
        .transition()
        .delay((d, i) => {
          return (
            duration * Math.floor(Math.random() * 100) * (1 / features.length)
          );
        })
        .style("fill-opacity", 0.45)
        .style("stroke", "transparent")
        .style("stroke-width", 0);
    }, intro);
  });
}
