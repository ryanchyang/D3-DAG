import { Graph } from 'react-d3-graph';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

// graph payload (with minimalist structure)

const linksData = [
  {
    id: 0,
    source: 'Harry',
    target: 'Sally',
  },
  {
    id: 1,
    source: 'Harry',
    target: 'Alice',
  },
];

const initdata = {
  nodes: [
    {
      id: 'Harry',
      size: { height: 200, width: 1200 },
      x: 600,
      y: 300,
      address: '0xF16......20826',
    },
    { id: 'Sally', x: 100, y: 300, address: '0xF16......20826' },
    { id: 'Alice', x: 900, y: 300, address: '0xF16......20826' },
  ],
  links: [
    // {
    //   source: 'Harry',
    //   target: 'Sally',
    // },
    // {
    //   source: 'Harry',
    //   target: 'Alice',
    // },
  ],
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  initialZoom: 1,
  directed: true,
  width: 1200,
  height: 600,
  staticGraphWithDragAndDrop: true,
  node: {
    // backgroundColor: 'red',
    color: 'white',
    size: {
      height: 200,
      width: 1300,
    },
    labelProperty: 'address',
    labelPosition: 'center',
    highlightStrokeColor: 'blue',
    symbolType: 'square',
    // viewGenerator: () => {
    //   return (
    //     <div
    //       style={{
    //         position: 'absolute',
    //         backgroundColor: 'red',
    //         transform: 'scale(2)',
    //         width: '120px',
    //       }}
    //     >
    //       123
    //     </div>
    //   );
    // },
  },
  link: {
    color: 'lightgreen',
    type: 'STRAIGHT',
    highlightColor: 'lightblue',
  },
};

const Index = () => {
  const [data, setData] = useState(initdata);
  const onClickGraph = () => {
    console.log(`Clicked the graph background`);
  };

  const onClickNode = nodeId => {
    console.log(`Clicked node ${nodeId}`);
  };

  const onDoubleClickNode = nodeId => {
    console.log(`Double clicked node ${nodeId}`);
  };

  const onRightClickNode = (event, nodeId) => {
    console.log(`Right clicked node ${nodeId}`);
  };

  const onMouseOverNode = nodeId => {
    console.log(`Mouse over node ${nodeId}`);
  };

  const onMouseOutNode = nodeId => {
    console.log(`Mouse out node ${nodeId}`);
  };

  const onClickLink = (source, target) => {
    console.log(`Clicked link between ${source} and ${target}`);
  };

  const onRightClickLink = (event, source, target) => {
    console.log(`Right clicked link between ${source} and ${target}`);
  };

  const onMouseOverLink = (source, target) => {
    console.log(`Mouse over in link between ${source} and ${target}`);
  };

  const onMouseOutLink = (source, target) => {
    console.log(`Mouse out link between ${source} and ${target}`);
  };

  //   const onNodePositionChange = (source, target) => {
  //     console.log(d3.event);
  //     console.log(`Mouse out link between ${source} and ${target}`);
  //   };

  useEffect(() => {
    const nodes = document.querySelectorAll('.node');
    const svg = d3.select('#graph-id-graph-container-zoomable');
    // console.log(nodes[0].id);
    // console.log(nodes);
    // console.log(nodes[1]);

    let links = [];
    // 初始算出線的值
    linksData.forEach(link =>
      links.push(
        d3.linkHorizontal()({
          source: [
            d3.select(`#${link.source}`).attr('cx'),
            d3.select(`#${link.source}`).attr('cy'),
          ],
          target: [
            d3.select(`#${link.target}`).attr('cx'),
            d3.select(`#${link.target}`).attr('cy'),
          ],
        })
      )
    );

    // 每個節點榜定drag監聽
    nodes.forEach(node =>
      d3.select(node).call(
        d3
          .drag()
          //   .on('start', function () {
          //     d3.select(this).style('stroke', 'blue');
          //   })
          .on('drag', function (d, i) {
            console.log(this.id);
            d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
            d3.select(this).attr(
              'transform',
              `translate(${d3.event.x},${d3.event.y})`
            );
            //   links.splice(
            //     0,
            //     d3.linkHorizontal()({
            //       source: [d3.event.x, d3.event.y],
            //       target: [
            //         nodes[0].getAttribute('cx'),
            //         nodes[0].getAttribute('cy'),
            //       ],
            //     })
            //   );
            // 重劃線段
            linksData.forEach(link => {
              if (link.source === this.id) {
                const lined = d3.linkHorizontal()({
                  source: [d3.event.x, d3.event.y],
                  target: [
                    d3.select(`#${link.target}`).attr('cx'),
                    d3.select(`#${link.target}`).attr('cy'),
                  ],
                });
                d3.select(`.link_${link.id}`).attr('d', lined);
              }

              if (link.target === this.id) {
                const lined = d3.linkHorizontal()({
                  source: [
                    d3.select(`#${link.source}`).attr('cx'),
                    d3.select(`#${link.source}`).attr('cy'),
                  ],
                  target: [d3.event.x, d3.event.y],
                });
                d3.select(`.link_${link.id}`).attr('d', lined);
              }
            });
          })
        //   .on('end', function () {
        //     d3.select(this).style('stroke', '#b3a2c8');
        //   })
      )
    );

    // 初始畫線
    for (let i = 0; i < links.length; i++) {
      if (d3.select(`.link_${i}`)._groups[0][0]) return; // 有產生出線段就return
      svg
        .append('path')
        .lower()
        .attr('class', `link_${i}`)
        .attr('d', links[i])
        .attr('stroke', '#0071F5')
        .attr('stroke-width', '3px')
        .attr('fill', 'none');
    }
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      <div className="graph-area">
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={myConfig}
          onClickNode={onClickNode}
          onRightClickNode={onRightClickNode}
          onClickGraph={onClickGraph}
          onClickLink={onClickLink}
          onRightClickLink={onRightClickLink}
          onMouseOverNode={onMouseOverNode}
          onMouseOutNode={onMouseOutNode}
          onMouseOverLink={onMouseOverLink}
          onMouseOutLink={onMouseOutLink}
          //   onNodePositionChange={onNodePositionChange}
        />
      </div>
    </>
  );
};

export default Index;
