HTMLWidgets.widget({

  name: 'd3tree',

  type: 'output',

  initialize: function(el, width, height) {

    return {

    }

  },

  renderValue: function(el, x, instance) {

    var valueField = x.options.value ? x.options.value : "size";

    // thanks Mike Bostock for all the code on which
    //    this is based
    var margin = {top: 20, right: 0, bottom: 0, left: 0},
        width = 960,
        height = 500 - margin.top - margin.bottom,
        formatNumber = d3.format(",d"),
        transitioning;

    var xscale = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);

    var yscale = d3.scale.linear()
        .domain([0, height])
        .range([0, height]);

    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        .sort(function(a, b) { return a[valueField] - b[valueField]; })
        .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
        .round(false)
        .value(function(d) {
            return d[valueField];
        });

    var svg = d3.select(el).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .style("margin-left", -margin.left + "px")
        .style("margin.right", -margin.right + "px")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

    var grandparent = svg.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -margin.top)
        .attr("width", width)
        .attr("height", margin.top);

    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - margin.top)
        .attr("dy", ".75em");


    draw( x.data, valueField );

    function draw(root, valueField) {
      initialize(root);
      accumulate(root);
      layout(root);
      display(root);

      function initialize(root) {
        root.x = root.y = 0;
        root.dx = width;
        root.dy = height;
        root.depth = 0;
      }

      // Aggregate the values for internal nodes. This is normally done by the
      // treemap layout, but not here because of our custom implementation.
      // We also take a snapshot of the original children (_children) to avoid
      // the children being overwritten when when layout is computed.
      function accumulate(d) {

        if( Array.isArray(d.children) ) {
            return (d._children = d.children)
              ? d[valueField] = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
              : d[valueField];
      } else {
        return d[valueField];
      }

      }

      // Compute the treemap layout recursively such that each group of siblings
      // uses the same size (1×1) rather than the dimensions of the parent cell.
      // This optimizes the layout for the current zoom state. Note that a wrapper
      // object is created for the parent node for each group of siblings so that
      // the parent’s dimensions are not discarded as we recurse. Since each group
      // of sibling was laid out in 1×1, we must rescale to fit using absolute
      // coordinates. This lets us use a viewport to zoom.
      function layout(d) {
        if (d._children) {
          treemap.nodes({_children: d._children});
          d._children.forEach(function(c) {
            c.x = d.x + c.x * d.dx;
            c.y = d.y + c.y * d.dy;
            c.dx *= d.dx;
            c.dy *= d.dy;
            c.parent = d;
            layout(c);
          });
        }
      }

      function display(d) {
        grandparent
            .datum(d.parent)
            .on("click", transition)
          .select("text")
            .text(name(d));

        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");

        var g = g1.selectAll("g")
            .data(d._children)
          .enter().append("g");

        g.filter(function(d) { return d._children; })
            .classed("children", true)
            .on("click", transition);

        g.selectAll(".child")
            .data(function(d) { return d._children || [d]; })
          .enter().append("rect")
            .attr("class", "child")
            .call(rect);

        g.append("rect")
            .attr("class", "parent")
            .call(rect)
          .append("title")
            .text(function(d) { return formatNumber(d[valueField]); });

        g.append("text")
            .attr("dy", ".75em")
            .text(function(d) { return d.name; })
            .call(text);

        function transition(d) {
          if (transitioning || !d) return;
          transitioning = true;

          var g2 = display(d),
              t1 = g1.transition().duration(750),
              t2 = g2.transition().duration(750);

          // Update the domain only after entering new elements.
          xscale.domain([d.x, d.x + d.dx]);
          yscale.domain([d.y, d.y + d.dy]);

          // Enable anti-aliasing during the transition.
          svg.style("shape-rendering", null);

          // Draw child nodes on top of parent nodes.
          svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

          // Fade-in entering text.
          g2.selectAll("text").style("fill-opacity", 0);

          // Transition to the new view.
          t1.selectAll("text").call(text).style("fill-opacity", 0);
          t2.selectAll("text").call(text).style("fill-opacity", 1);
          t1.selectAll("rect").call(rect);
          t2.selectAll("rect").call(rect);

          // Remove the old node when the transition is finished.
          t1.remove().each("end", function() {
            svg.style("shape-rendering", "crispEdges");
            transitioning = false;
          });
        }

        return g;
      }

      function text(text) {
        text.attr("x", function(d) { return xscale(d.x) + 6; })
            .attr("y", function(d) { return yscale(d.y) + 6; });
      }

      function rect(rect) {
        rect.attr("x", function(d) { return xscale(d.x); })
            .attr("y", function(d) { return yscale(d.y); })
            .attr("width", function(d) { return xscale(d.x + d.dx) - xscale(d.x); })
            .attr("height", function(d) { return yscale(d.y + d.dy) - yscale(d.y); });
      }

      function name(d) {
        return d.parent
            ? name(d.parent) + "." + d.name
            : d.name;

      }

    }

  },

  resize: function(el, width, height, instance) {

  }

});
