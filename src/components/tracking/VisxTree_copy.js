import { useState, useEffect } from 'react';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { LinkHorizontal } from '@visx/shape';
import { Zoom } from '@visx/zoom';
import { Drag, raise } from '@visx/drag';
import * as d3Dag from 'd3-dag';
import data from './Data2';

const peach = '#fd9b93';
const pink = '#fe6e9e';
const blue = '#03c0dc';
const green = '#26deb0';
const lightpurple = '#374469';
const background = '#272b4d';
const margin = { top: 10, left: 80, right: 80, bottom: 10 };
const nodeWidth = 60;
const nodeHeight = 20;

const initialTransform = {
  scaleX: 1.27,
  scaleY: 1.27,
  translateX: -211.62,
  translateY: 162.59,
  skewX: 0,
  skewY: 0,
};

const VisxTree = props => {
  const { width, height } = props;
  const [dag, setDag] = useState(null);

  const linkHandler = (link, dx) => {
    console.log(link, dx);
    return link;
  };

  useEffect(() => {
    const dag = d3Dag.dagStratify()(data);
    console.log(dag);
    const nodeRadius = 22; //need to change based on the nodeWidth value
    const layout = d3Dag
      .sugiyama() // base layout
      .layering(d3Dag.layeringLongestPath())
      .decross(d3Dag.decrossOpt()) // minimize number of crossings
      .nodeSize(node => [(node ? 3 : 0.25) * nodeRadius, 5 * nodeRadius]); // set node size instead of constraining to fit
    layout(dag);
    // const { width, height } = layout(dag as any);
    setDag(dag);
    // setLayoutHeight(height);
    // setLayoutWidth(width);
  }, []);

  return (
    <div className="graph-area">
      <Zoom>
        {zoom => (
          <div style={{ position: 'relative' }}>
            <svg
              width={width}
              height={height}
              style={{
                cursor: zoom.isDragging ? 'grabbing' : 'initial',
                //   touchAction: 'none',
              }}
              ref={zoom.containerRef}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 -5 10 10"
                  refX="15"
                  refY="-.5"
                  markerWidth="4"
                  markerHeight="4"
                  orient="auto"
                  fill="#fff"
                >
                  <path d="M0,-5L10,0L0,5" />
                </marker>
              </defs>
              <LinearGradient id="lg" from={peach} to={pink} />
              <rect width={width} height={height} rx={14} fill={background} />
              <Group
                top={margin.top}
                left={margin.left}
                transform={zoom.toString()} // 元素可以縮放
              >
                {/* 產生線段 */}
                {dag
                  ? dag.links().map((link, i) => {
                      return (
                        <Drag
                          key={`draglink-${i}`}
                          // width={width}
                          // height={height}
                          x={link.points[0].x}
                          y={link.points[0].y}
                          onDragStart={() => {
                            // svg follows the painter model
                            // so we need to move the data item
                            // to end of the array for it to be drawn
                            // "on top of" the other data items
                            //   setDraggingItems(raise(draggingItems, i));
                          }}
                        >
                          {({
                            dragStart,
                            dragEnd,
                            dragMove,
                            isDragging,
                            x,
                            y,
                            dx,
                            dy,
                          }) => (
                            <LinkHorizontal
                              key={`link-${i}`}
                              data={linkHandler(link, dx)}
                              stroke={lightpurple}
                              strokeWidth="1"
                              fill="none"
                              x={node => node.y - nodeWidth / 2 + 1}
                              markerEnd="url(#arrow)"
                              onMouseMove={e => {
                                //   console.log(e);
                                zoom.dragEnd(e);
                                dragMove(e);
                              }}
                              onMouseUp={dragEnd}
                              onMouseDown={e => {
                                zoom.dragEnd(e);
                                dragStart(e);
                              }}
                              onTouchStart={dragStart}
                              onTouchMove={dragMove}
                              onTouchEnd={dragEnd}
                            />
                          )}
                        </Drag>
                      );
                    })
                  : null}
                {/* 產生節點 */}
                {dag
                  ? dag.descendants().map((node, i) => (
                      <Drag
                        key={`drag-${node.data.id}`}
                        // width={width}
                        // height={height}
                        x={node.x}
                        y={node.y}
                        onDragStart={() => {
                          // svg follows the painter model
                          // so we need to move the data item
                          // to end of the array for it to be drawn
                          // "on top of" the other data items
                          //   setDraggingItems(raise(draggingItems, i));
                        }}
                      >
                        {({
                          dragStart,
                          dragEnd,
                          dragMove,
                          isDragging,
                          x,
                          y,
                          dx,
                          dy,
                        }) => (
                          <Group
                            key={node.data.id}
                            top={node.x}
                            left={node.y}
                            style={{ cursor: 'pointer' }}
                            onClick={() => alert(`Clicked : ${node.data.id}`)}
                            transform={`translate(${dx + node.y}, ${
                              dy + node.x
                            })`}
                            onMouseEnter={() => {
                              console.log(node);
                            }}
                            onMouseMove={e => {
                              //   console.log(e);
                              zoom.dragEnd(e);
                              dragMove(e);
                            }}
                            onMouseUp={dragEnd}
                            onMouseDown={e => {
                              zoom.dragEnd(e);
                              dragStart(e);
                            }}
                            onTouchStart={dragStart}
                            onTouchMove={dragMove}
                            onTouchEnd={dragEnd}
                          >
                            <rect
                              height={nodeHeight}
                              width={nodeWidth}
                              y={-nodeHeight / 2}
                              x={-nodeWidth / 2}
                              fill={background}
                              opacity={1}
                              stroke={blue}
                              strokeWidth={1}
                            />
                            <text
                              dy=".33em"
                              fontSize={9}
                              fontFamily="Arial"
                              textAnchor="middle"
                              fill={green}
                              style={{ pointerEvents: 'none' }}
                            >
                              {node.data.id}
                            </text>
                          </Group>
                        )}
                      </Drag>
                    ))
                  : null}
              </Group>
            </svg>
          </div>
        )}
      </Zoom>
    </div>
  );
};

export default VisxTree;
