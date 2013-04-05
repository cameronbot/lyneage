function buildTree(data, root) {
  'use strict';
  console.log("data",data);
  var tree = {},
    i = 0,
    j = 0,
    spouseObjects = [],
    spouseIds = [],
    childObjects = [],
    childIds = [];

  // clone object
  tree = clone(data[root]);

  console.log("tree", tree);

  if(tree.spouses && tree.spouses.length) {
    console.log (" spouses for ", tree.name);
    appendSpouses(data, tree, tree.spouses);
  } else {
    console.log(" no spouses for ", tree.name)
    appendChildren(data, tree, tree.children);
  }

  return tree;
}

function appendSpouses(data, node, ids) {
  if(!ids) return;
  console.log("append spouses to", node.name, ids);

  var spouseObjects = [],
      i = 0;

  for(i = 0; i < ids.length; i++) {

    spouseObjects.push(clone(data[ids[i]]));

    // intersection of root's children and this spouses children
    childIds = spouseObjects[i].children.filter(function(n) {
      if(node.children.indexOf(n) == -1)
        return false;
      return true;
    });
    console.log("filtered children", childIds);

    appendChildren(data, spouseObjects[i], childIds)

    spouseObjects[i].spouses = undefined;
  }

  node.children = undefined;
  node.spouses = spouseObjects;
}

function appendChildren(data, node, ids) {
  if(!ids) {
    node.children = undefined;
    return undefined;
  }
  console.log("append children to", node.name, ids);

  var childObjects = [],
      j = 0;

  for(j = 0; j < ids.length; j++) {
    childObjects.push(clone(data[ids[j]]));
    appendSpouses(data, childObjects[j], childObjects[j].spouses);
  }

  node.children = childObjects;
}

function parseNames(selection, data) {
  var $selection = $(selection);

  $selection.each(function() {
    $(this).text(data[$(this).data('pid')].name);
  });
}


