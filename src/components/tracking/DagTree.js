import DagreGraph from 'dagre-d3-react';
import * as d3 from 'd3';

let dagreData = {
  nodes: [
    {
      id: '1',
      label: '<h3>Node 1</h3>',
      labelType: 'html',
    },
    {
      id: '2',
      label: '<h3>Node 2</h3>',
      labelType: 'html',
      config: {
        style: 'fill: #afa',
      },
    },
    {
      id: '3',
      label: '<h3>Node 3</h3>',
      labelType: 'html',
      config: {
        style: 'fill: #afa',
      },
    },
    {
      id: '4',
      label: '<h3>Node 4</h3>',
      labelType: 'html',
      config: {
        style: 'fill: #afa',
      },
    },
  ],
  links: [
    {
      source: '1',
      target: '2',
      label: 'TO',
      config: {
        arrowheadStyle: 'display: none',
        curve: d3.curveBasis,
      },
    },
    {
      source: '1',
      target: '3',
      label: 'TO',
      config: {
        arrowheadStyle: 'display: none',
        curve: d3.curveBasis,
      },
    },
    {
      source: '1',
      target: '4',
      label: 'TO',
      config: {
        arrowheadStyle: 'display: none',
        curve: d3.curveBasis,
      },
    },
  ],
};

const DagTree = () => {
  return (
    <>
      <DagreGraph
        nodes={dagreData.nodes}
        links={dagreData.links}
        options={{
          rankdir: 'RL',
          align: 'UR',
          ranker: 'tight-tree',
        }}
        width="500"
        height="500"
        animate={1000}
        shape="circle"
        fitBoundaries
        zoomable
        onNodeClick={e => console.log(e)}
        onRelationshipClick={e => console.log(e)}
      />
    </>
  );
};

export default DagTree;
