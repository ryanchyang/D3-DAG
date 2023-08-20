import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
// import { LinkHorizontal, LinkComponent } from '@visx/shape';
import { Zoom } from '@visx/zoom'
import { Drag } from '@visx/drag'
import * as d3Dag from 'd3-dag'
import * as d3 from 'd3'
// import data from './Data2';
import shortenAddress from 'public/util/shortenAddress'

const peach = '#fd9b93'
const pink = '#fe6e9e'
const blue = '#0071F5'
const margin = { top: 10, left: 80, right: 80, bottom: 10 }
const nodeWidth = 320
const nodeHeight = 53

// const initialTransform = {
//   scaleX: 1,
//   scaleY: 1,
//   translateX: -15,
//   translateY: 275,
//   skewX: 0,
//   skewY: 0,
// };

const VisxTree = props => {
  const { width, height, currentGraphData } = props
  const [dag, setDag] = useState(null)
  const { t, i18n } = useTranslation()

  ///////// handler 開始 /////////////

  const getInitTransformMatrix = (dag, width, height) => {
    const rootNode = dag.descendants().filter(node => node.data.id === '0')[0]
    return {
      scaleX: 1,
      scaleY: 1,
      translateX: width / 2 - rootNode.y,
      translateY: height / 2 - rootNode.x,
      skewX: 0,
      skewY: 0,
    }
  }

  const generateLinkPath = (sourcePosition, targetPosition) => {
    const lined = d3.linkHorizontal()({
      source: [sourcePosition[0] + nodeWidth / 2 + 1, sourcePosition[1]],
      target: [targetPosition[0] - nodeWidth / 2 + 1, targetPosition[1]],
    })
    return lined
  }

  const lineChangeHandler = () => {
    const links = document.querySelectorAll('.visx-link')

    links.forEach(link => {
      //   const targetId = link.id.split('-')[2];
      const source = d3.select(`#node-${link.id.split('-')[1]}`)
      const target = d3.select(`#node-${link.id.split('-')[2]}`)

      const lined = generateLinkPath(
        [+source.attr('x'), +source.attr('y')],
        [+target.attr('x'), +target.attr('y')]
      )

      d3.select(`#${link.id}`).attr('d', lined)
    })
  }
  ///////// handler 結束 /////////////

  ///////// components 開始 /////////////

  function CustomLink({ link }) {
    return (
      <path
        className="visx visx-link visx-link-horizontal-diagonal" // visx link 必填
        id={`link-${link.source.data.id}-${link.target.data.id}`}
        d={generateLinkPath(
          [link.source.y, link.source.x],
          [link.target.y, link.target.x]
        )} // 寫顛倒
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrow)"
      />
    )
  }
  ///////// components 結束 /////////////

  useEffect(() => {
    console.log(currentGraphData)
    const dag = d3Dag.dagStratify()(currentGraphData)
    console.log(dag)
    const nodeRadius = 22 //need to change based on the nodeWidth value
    const layout = d3Dag
      .sugiyama() // base layout
      .layering(d3Dag.layeringLongestPath())
      .decross(d3Dag.decrossOpt()) // minimize number of crossings
      .nodeSize(node => [(node ? 5 : 0.25) * nodeRadius, 20 * nodeRadius]) // set node size instead of constraining to fit
    layout(dag)
    // const { width, height } = layout(dag as any);
    setDag(dag)
    // setLayoutHeight(height);
    // setLayoutWidth(width);
  }, [currentGraphData])

  //   useEffect(() => {
  //     if (!dag || !d3.select('.node-0')) return;
  //     console.log(d3.select('.node-0').attr('x'));
  //   }, [d3.select('.node-0')]);

  return (
    <>
      {dag && width && height ? (
        <Zoom
          width={width}
          height={height}
          // scaleXMin={1 / 2}
          scaleXMax={4}
          // scaleYMin={1 / 2}
          scaleYMax={4}
          initialTransformMatrix={getInitTransformMatrix(dag, width, height)}
        >
          {zoom => (
            <div style={{ position: 'relative', zIndex: 3 }}>
              <svg
                width={width}
                height={height}
                style={{
                  cursor: zoom.isDragging ? 'grabbing' : 'initial',
                  touchAction: 'none',
                  transform: 'translate()',
                }}
                ref={zoom.containerRef}
              >
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 -5 10 10"
                    refX="10"
                    refY="0"
                    markerWidth="6"
                    markerHeight="4"
                    orient="auto"
                    className="marker"
                  >
                    <path d="M0,-5L10,0L0,5" />
                  </marker>
                </defs>
                <LinearGradient id="lg" from={peach} to={pink} />
                {/* <rect width={width} height={height} rx={14} fill="transparent" /> */}
                <Group
                  top={margin.top}
                  left={margin.left}
                  transform={zoom.toString()} // 元素可以縮放
                >
                  {/* 產生線段 */}
                  {dag.links().map((link, i) => {
                    return <CustomLink key={`link-${i}`} link={link} />
                  })}
                  {/* 產生節點 */}
                  {dag.descendants().map((node, i) => (
                    <Drag
                      key={`drag-${node.data.id}`}
                      width={width}
                      height={height}
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
                          id={`node-${node.data.id}`}
                          top={node.x}
                          left={node.y}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            navigator.clipboard.writeText(node.data.address)
                            message.success({
                              content: t('msg_success'),
                            })
                            // alert(`Clicked : ${node.data.id}`);
                          }}
                          transform={`translate(${dx + node.y}, ${
                            dy + node.x
                          })`}
                          x={dx + node.y}
                          y={dy + node.x}
                          onMouseEnter={() => {
                            // console.log(node);
                          }}
                          onMouseMove={e => {
                            if (!isDragging) return
                            lineChangeHandler()
                            zoom.dragEnd(e)
                            dragMove(e)
                          }}
                          onMouseUp={dragEnd}
                          onMouseDown={e => {
                            zoom.dragEnd(e)
                            dragStart(e)
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
                            className="node-rect"
                            fill={'white'}
                            opacity={1}
                            stroke={'none'}
                            strokeWidth={1}
                            rx={10}
                          />
                          <Group
                            width={100}
                            height={34}
                            className={
                              node
                                ? `mark-${node?.data?.mark?.toLowerCase()}`
                                : ''
                            }
                            top={-nodeHeight / 2 + 10}
                            left={-nodeWidth / 2 + 10}
                          >
                            <rect width={100} height={34} rx={5} />
                            <text
                              x="0"
                              y="0"
                              dy=".33em"
                              fontFamily="Oduda-Bold"
                              fontSize="25"
                              fill="white"
                              style={{
                                transform: 'translate(50px , 17px )',
                              }}
                              textAnchor="middle"
                            >
                              {+node.data.id + 1}
                            </text>
                          </Group>
                          <text
                            dy=".33em"
                            // fontSize={20}
                            // fontFamily={`'NotoSans-Bold', 'NotoSansSC-Bold'`}
                            textAnchor="middle"
                            className="node-address"
                            style={{
                              pointerEvents: 'none',
                              transform: 'translateX(30px)',
                            }}
                          >
                            {node.data.address}
                          </text>
                          {/* copy icon */}
                          <Group
                            top={-nodeHeight / 2 + 12}
                            left={nodeWidth / 2 - 40}
                          >
                            <svg
                              viewBox="64 64 896 896"
                              focusable="false"
                              data-icon="copy"
                              width="22"
                              height="25"
                              className="node-copy"
                              aria-hidden="true"
                            >
                              <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
                            </svg>
                          </Group>
                        </Group>
                      )}
                    </Drag>
                  ))}
                </Group>
              </svg>
            </div>
          )}
        </Zoom>
      ) : null}
    </>
  )
}

export default VisxTree
