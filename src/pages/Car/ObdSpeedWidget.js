// data-set 可以按需引入，除此之外不要引入别的包
import React from 'react';
import { Chart, Axis, Coord, Geom, Guide, Shape } from 'bizcharts';

const { Html, Arc } = Guide;

// 自定义Shape 部分
Shape.registerShape('point', 'pointer', {
  drawShape(cfg, group) {
    let point = cfg.points[0]; // 获取第一个标记点
    point = this.parsePoint(point);
    const center = this.parsePoint({
      // 获取极坐标系下画布中心点
      x: 0,
      y: 0,
    });
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 5,
        lineCap: 'round',
      },
    });
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 12,
        stroke: cfg.color,
        lineWidth: 4.5,
        fill: '#fff',
      },
    });
  },
});

const color = ['#0086FA', '#FFBF00', '#F5222D'];
const cols = {
  value: {
    min: 0,
    max: 240,
    tickInterval: 40,
    nice: false,
  },
};

class ObdSpeedWidget extends React.Component {
  constructor() {
    super();
    this.state = {
      lineWidth: 25,
    };
  }

  componentDidMount() {}

  render() {
    const { realVal } = this.props;
    let { val } = this.props;
    if (val > 240) {
      val = 241;
    }
    const { lineWidth } = this.state;
    const data = [{ value: val }];
    return (
      <Chart height={150} data={data} scale={cols} padding={[0, 0, 0, 0]} forceFit>
        <Coord
          type="polar"
          startAngle={(-9 / 8) * Math.PI}
          endAngle={(1 / 8) * Math.PI}
          radius={0.88}
        />
        <Axis
          name="value"
          zIndex={2}
          line={null}
          label={{
            offset: -15,
            textStyle: {
              fontSize: 14,
              fill: '#CBCBCB',
              textAlign: 'center',
              textBaseline: 'middle',
            },
          }}
          tickLine={{
            length: -24,
            stroke: '#fff',
            strokeOpacity: 1,
          }}
        />
        <Axis name="1" visible={false} />
        <Guide>
          <Arc
            zIndex={0}
            start={[0, 0.965]}
            end={[240, 0.965]}
            style={{
              // 底灰色
              stroke: 'rgba(0, 0, 0, 0.09)',
              lineWidth,
            }}
          />
          {val >= 80 && (
            <Arc
              zIndex={1}
              start={[0, 0.965]}
              end={[80, 0.965]}
              style={{
                // 底灰色
                stroke: color[0],
                lineWidth,
              }}
            />
          )}
          {val >= 80 && (
            <Arc
              zIndex={1}
              start={[80, 0.965]}
              end={[val, 0.965]}
              style={{
                // 底灰色
                stroke: color[1],
                lineWidth,
              }}
            />
          )}
          {val >= 160 &&
            val < 250 && (
              <Arc
                zIndex={1}
                start={[160, 0.965]}
                end={[val, 0.965]}
                style={{
                  // 底灰色
                  stroke: color[2],
                  lineWidth,
                }}
              />
            )}
          {val < 80 && (
            <Arc
              zIndex={1}
              start={[0, 0.965]}
              end={[val, 0.965]}
              style={{
                // 底灰色
                stroke: color[0],
                lineWidth,
              }}
            />
          )}
          <Html
            position={['50%', '95%']}
            html={() =>
              `<div style="width: 200px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.15em; color: rgba(0,0,0,0.85);margin: 0;">${realVal}</p><p style="font-size: 1.15em;color: rgba(0,0,0,0.43);margin: 0;">车辆速度（KM/H）</p></div>`
            }
          />
        </Guide>
        <Geom
          type="point"
          position="value*1"
          shape="pointer"
          color="#1890FF"
          active={false}
          style={{ stroke: '#fff', lineWidth: 1 }}
        />
      </Chart>
    );
  }
}

// CDN END
export default ObdSpeedWidget;
