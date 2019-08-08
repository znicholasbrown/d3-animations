function visualizeCityRoads(element, json, coi) {
  let width = $(element).innerWidth(),
    height = $(element).innerHeight();

  let svg = d3
    .select(element)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g");

  let projection = d3.geoMercator().fitSize([width, height], json);

  let path = d3.geoPath().projection(projection);

  let baseMap = svg.append("g");

  baseMap
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .filter(d => {
      return (
        d.properties.tags.highway !== undefined &&
        d.geometry.type == "LineString"
      );
    })
    .attr("d", path)
    .style("fill", "transparent")

    .style("stroke", "black")
    .style("stroke-width", 0.2)
    .attr("stroke-dasharray", d => {
      return path.measure(d);
    })
    .attr("stroke-dashoffset", d => {
      return path.measure(d);
    })
    .transition((d, i) => {
      return 1 / path.measure(d);
    })
    .delay((d, i) => {
      return i * 10;
    })
    .attr("stroke-dashoffset", d => {
      return 0;
    });

  let bounds = baseMap.node().getBBox(),
    x = bounds.x,
    y = bounds.y,
    dx = bounds.width,
    dy = bounds.height;

  let scale = 0.8 / Math.max(dx / width, dy / height),
    translate = [dx / 2 - scale * x, dy / 2 - scale * y];

  baseMap.attr(
    "transform",
    "translate(" + translate + ") scale(" + scale + ")"
  );
}
