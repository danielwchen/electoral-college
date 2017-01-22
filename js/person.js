// // DRAW WOMAN IMAGE
// var image = vis.svg.selectAll(".image")
//     .data(vis.grid(vis.people));
//
// // enter
// image.enter()
//     .append("image")
//     .attr("class", "image")
//
// // update
// image
//     .attr("width", vis.grid.nodeSize()[0])
//     .attr("height", vis.grid.nodeSize()[1])
//     .attr("transform", function(d) {
//         return "translate(" + (d.x) + "," + d.y + ")";
//     })
//     .attr("xlink:href", "images/woman-outline.slate.png");
//
// // exit
// image.exit()
//     .transition()
//     .remove();