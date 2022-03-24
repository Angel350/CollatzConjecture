class node {
    constructor(value, parent) {
        this.Value = value;
        this.Parent = parent;
    }
}

function containsNode(number, list) {

    list
        .sort(function (first, second) {
            return second.Value - first.Value;
        });
    for (let index = 0; index < list.length; index++) {
        if (list[index].Value == number) {
            return true;
        }
    }
    return false;
}

function calculateNodes(limit) {
    //collatz Conjecture
    let nodesList = [];

    for (let i = 1; i < limit; i++) {

        let index = i;
        while (index > 1 && !containsNode(index, nodesList)) {
            let tempNode = new node(index, 0);
            if (index % 2 == 0) {
                index /= 2;
            } else {
                index = index * 3 + 1
            }
            tempNode.Parent = index;
            nodesList.push(tempNode);
        }

    }
    console.log(nodesList);
    nodesList.push(new node(1, ""));
    return nodesList;
}
let nodesList = calculateNodes(32);

const canvas = d3.select('#canvas');

const svg = canvas.append('svg');
svg.attr('id', 'main-svg');

var dataStructure = d3
    .stratify()
    .id(function (d) {
        return d.Value;
    })
    .parentId(function (d) {
        return d.Parent;
    })(nodesList);

const treeStructure = d3
    .tree()
    .size([100, 200]);

const information = treeStructure(dataStructure);

const circles = svg
    .append("g")
    .selectAll("circle")
    .data(information.descendants());

circles
    .enter()
    .append('circle')
    .attr('cx', function (d) {
        console.log(d)
        return d.x * 10;
    })
    .attr('cy', function (d) {
        return d.y * 10;
    })
    .attr('r', 5)
    .style('fill', '#555');

const connections = svg.append("g").selectAll('path')
    .data(information.links());

connections.enter().append("path")
    .attr('d',
        function (d) {

            return "M " + d.source.x * 10 + " " + d.source.y * 10 + " C " + d.source.x * 10 + " " + (d.source.y + d.target.y) / 2 * 10 + "," + d.target.x * 10 + " " + (d.source.y + d.target.y) / 2 * 10 + "," + d.target.x * 10 + " " + d.target.y * 10;
        }
    )
