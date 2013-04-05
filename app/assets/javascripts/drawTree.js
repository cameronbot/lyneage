function drawTree(treeData) {
  console.log("drawTree", treeData);
  // Clear old svg canvas
  d3.select("svg").remove();

  // Create a svg canvas
  var vis = d3.select("body").append("svg:svg")
    .attr("width", 400)
    .attr("height", 300)
    .append("svg:g")
    .attr("transform", "translate(40, 0)"); // shift everything to the right

  // Create a tree "canvas"
  var tree = d3.layout.tree()
    .size([300, 300 ])
    .children(function(d) {
      if(d.spouses && d.spouses.length) {
        if( Object.prototype.toString.call( d.spouses ) === '[object Array]' ) {
          console.log("array of spouses", d.spouses);
          return d.spouses;
        } else {
          console.log("not array of spouses", d.spouses);
          return [d.spouses];
        }
      } else {
        return d.children;
      }
    })
    // not sure what this function does,
    // but you have to check for a.depth > 0 otherwise divide by 0 error
    // on trees with only a single generation
    .separation(function(a, b) {
      if(a.depth > 0) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
      } else {
        return 2;
      }
    });

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });


  // Preparing the data for the tree layout, convert data into an array of nodes
  var nodes = tree.nodes(treeData);
  // Create an array with all the links
  var links = tree.links(nodes);

  console.log(treeData)
  console.log(nodes)
  console.log(links)

  var link = vis.selectAll("pathlink")
    .data(links)
    .enter().append("svg:path")
    .attr("class", function(d) {
        if(!!d.source.spouses && !!!d.target.spouses) {
          return "link spouse";
        } else {
          return "link child";
        }
    })
    .attr("d", diagonal)
    .attr("stroke-dasharray", function(d) {

      if(!!d.source.spouses && !!!d.target.spouses) {
        return "3,3";
      } else {
        return "10,0";
      }
    })

  var node = vis.selectAll("g.node")
    .data(nodes)
    .enter().append("svg:g")
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  // Add the dot at every node
  node.append("svg:circle")
    .attr("r", 3.5)
    .attr("class", function(d) {
      var classes = "";
      classes += (d.sex ? d.sex + " " : "");
      d3.select(this.parentNode).classed("spoused", !!d.spouse ).classed("stepped", !!d.step);
      return classes;
    });

  // place the name atribute left or right depending if children
  node.append("svg:text")
    .attr("dx", function(d) { return 0; /*return d.spouses ? -8 : 8;*/ })
    .attr("dy", 3)
    .attr("text-anchor", function(d) { return "start"; /*d.spouses ? "end" : "start";*/ })
  .attr("transform", function(d) { return "rotate(-45)translate(8,-4)"; /*return d.x < 180 ? "rotate(-45)translate(8,-4)" : "rotate(135)translate(-8,4)"; */ })
    .text(function(d) { return d.name; })

}
