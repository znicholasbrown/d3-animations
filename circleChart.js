function circleChart(element, arr, options) {
  options !== undefined ? (options = options) : (options = {});
  let settings = {
    //sets default values
    duration:
      options.duration !== undefined ? options.duration : arr.length * 500,
    colorArray:
      options.colorArray !== undefined
        ? options.colorArray
        : [
            "#C0392B",
            "#9B59B6",
            "#2980B9",
            "#1ABC9C",
            "#27AE60",
            "#F1C40F",
            "#E67E22",
            "#E74C3C",
            "#8E44AD",
            "#3498DB",
            "#16A085",
            "#D35400"
          ],
    hoverColor:
      options.hoverColor !== undefined ? options.hoverColor : "#8fc72c",
    thickness: options.thickness !== undefined ? options.thickness : 1
  };

  let width = $(element).innerWidth(),
    height = $(element).innerHeight(),
    radius = Math.min(width, height) / 2;

  let total = 0;

  if (typeof arr[0] === "object" && arr[0].constructor === Object) {
    for (let i = 0, len = arr.length; i < len; ++i) {
      total += arr[i][settings.value];
    }
  } else {
    for (let i = 0, len = arr.length; i < len; ++i) {
      total += arr[i];
    }
  }

  let color = d3.scaleOrdinal().range(settings.colorArray);

  let svg = d3
    .select(element)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let pie = d3
    .pie()
    .sort(null)
    .value(d => {
      let v = typeof d === "number" ? d : d[settings.value];
      return v;
    });

  let arc = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(radius * (1 - settings.thickness));

  let category = svg
    .selectAll(".arc")
    .data(pie(arr))
    .enter()
    .append("g")
    .attr("class", "arc-container");

  category
    .append("path")
    .attr("stroke", "transparent")
    .attr("stroke-width", 7.5)
    .attr("class", "arc")
    .style("fill", d => {
      let f =
        typeof d.data === "number"
          ? color(d.data)
          : color(d.data[settings.label]);
      return f;
    });

  category
    .select(".arc")
    .transition()
    .delay((d, i) => {
      return settings.duration * i * (1 / arr.length);
    })
    .duration((d, i) => {
      return settings.duration * (1 / arr.length);
    })
    .attrTween("d", d => {
      let i = d3.interpolate(d.startAngle, d.endAngle);
      return function(t) {
        d.endAngle = i(t);
        return arc(d);
      };
    });
}
