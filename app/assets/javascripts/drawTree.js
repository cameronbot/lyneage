function drawTree(treeData) {
  console.log("drawTree", treeData);
  // Clear old svg canvas
  d3.select("svg").remove();

  var margin = {top: 0, right: 320, bottom: 0, left: 0};
  var width = $("body").width() - 100,
      height = 500,
      treePadY = 60;
  // Create a svg canvas
  var vis = d3.select("body").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("style", "left:50%;margin-left: -" + width/2 + "px")
    .append("svg:g")
      //.attr("viewBox", [-800,0,200,200].join(" "))
      .attr("preserveAspectRatio", "xMidYMin meet")
      .attr("transform", "translate("+width+",40)rotate(90)"); // shift everything to the right

  // Create a tree "canvas"
  var tree = d3.layout.tree()
    .size([width, height-treePadY*2])
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
    .separation(function(a, b) {
      //return a.parent === b.parent ? 1 : 2;
      return 1;
    });
    // not sure what this function does,
    // but you have to check for a.depth > 0 otherwise divide by 0 error
    // on trees with only a single generation

    // .separation(function(a, b) {
    //   if(a.depth > 0) {
    //     return (a.parent == b.parent ? 1 : 2) / a.depth;
    //   } else {
    //     return 2;
    //   }
    // });

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });


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
    })
    .on("mouseover", function(d) {
      var circle = d3.select(this);
      circle.transition().duration(200).attr("r", 6);
    })
    .on("click", function(d) {
      var node = d3.select(this.parentNode);
      var circle = d3.select(this);
      var left = d3.event.pageX,
          top = d3.event.pageY;


      actionMenu
        .style("display", "block")
        .style('position', 'absolute')
        .style('left', left + "px")
        .style('top', top + "px")
        .html("<strong>" + d.name + "</strong>");

      console.log(node);



      d3.event.preventDefault();
      //$('body').append($('<div style="position:absolute;top:0;left:0"></div>').html('<input type="text" /> more info about ' + node.select("text").text()));
      // vis.append("foreignObject")
      //        .attr("transform", "rotate(-90)")
      //        .attr("width", 240)
      //        .attr("height", 120)
      //        .append("xhtml:div")
      //        .style("font", "14px 'Helvetica Neue'")
      //        .style("background", "#eee")
      //        .html('<input type="text" /> more info about ' + node.select("text").text())
    });;

  // place the name atribute left or right depending if children
  node.append("svg:text")
    .attr("dx", function(d) { return 0; /*return d.spouses ? -8 : 8;*/ })
    .attr("dy", 3)
    .attr("text-anchor", function(d) { return "start"; /*d.spouses ? "end" : "start";*/ })
    .attr("transform", function(d) { return "rotate(-45)translate(8,-4)"; /*return d.x < 180 ? "rotate(-45)translate(8,-4)" : "rotate(135)translate(-8,4)"; */ })
    .text(function(d) { return d.name; })

  //centerTree("body");

  function centerTree(selector) {
    // selector points to the enclosing g element
    var innerSVG = $(selector + " svg")[0];
    var bbox = innerSVG.getBBox();

    innerSVG.setAttribute("viewBox", [bbox.x, bbox.y-treePadY, bbox.width, bbox.height+treePadY].join(" "));
  }

  function elbow(d, i) {
    return "M" + d.source.y + "," + d.source.x
       + "H" + d.target.y + "V" + d.target.x
       + (d.target.children ? "" : "h" + margin.right);
  }

  var actionMenu = d3.select("body").append("div")
    .attr("class", "actionMenu")
    .style("display", "none");
}
