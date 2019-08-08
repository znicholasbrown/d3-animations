function zoomToCountry(element, json, coi) {
  let width = $(element).innerWidth(),
    height = $(element).innerHeight();

  let svg = d3
    .select(element)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g");

  let projection = d3
    .geoMercator()
    .scale(350)
    .center([50, 1.25])
    .translate([width / 1.1, height / 2]);

  let path = d3.geoPath().projection(projection);

  let baseMap = svg.append("g");

  baseMap
    .selectAll("path")
    .data(
      topojson.feature(json, json.objects[Object.keys(json.objects)[0]])
        .features
    )
    .enter()
    .append("path")
    .transition(2000)
    .delay(50)
    .attr("d", path)
    .style("fill", "lightgray")
    .transition(2000)
    .delay(500)
    .style("stroke", d => {
      switch (d.properties.geounit) {
        case coi:
          zoomer(d);
          return "white";
        default:
          return "white";
      }
    })
    .style("fill", d => {
      switch (d.properties.geounit) {
        case coi:
          return "#8fc72c";
        default:
          return "lightgray";
      }
    });

  function zoomer(d) {
    let bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2;

    let scale = 0.7 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

    baseMap
      .transition(500)
      .delay(1500)
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  }
}
