import React from 'react';
import { Chart, Axis, Coord, Geom, Guide, View } from 'bizcharts';
import autoHeight from '@/components/Charts/autoHeight';

const { Html } = Guide;

// 构造数据
const data1 = [];
data1[0] = { type: 0, value: 10 };
data1[1] = { type: 1, value: 10 };
data1[2] = { type: 2, value: 10 };
data1[3] = { type: 3, value: 10 };
data1[4] = { type: 4, value: 10 };
data1[5] = { type: 5, value: 10 };
data1[6] = { type: 6, value: 10 };
data1[7] = { type: 7, value: 10 };
data1[8] = { type: 8, value: 10 };
data1[9] = { type: 9, value: 10 };
data1[10] = { type: 10, value: 10 };
data1[11] = { type: 11, value: 10 };
data1[12] = { type: 12, value: 10 };
data1[13] = { type: 13, value: 10 };
data1[14] = { type: 14, value: 10 };
data1[15] = { type: 15, value: 10 };
data1[16] = { type: 16, value: 10 };
data1[17] = { type: 17, value: 10 };
data1[18] = { type: 18, value: 10 };
data1[19] = { type: 19, value: 10 };
data1[20] = { type: 20, value: 10 };
data1[21] = { type: 21, value: 10 };
data1[22] = { type: 22, value: 10 };
data1[23] = { type: 23, value: 10 };
data1[24] = { type: 24, value: 10 };
data1[25] = { type: 25, value: 10 };
data1[26] = { type: 26, value: 10 };
data1[27] = { type: 27, value: 10 };
data1[28] = { type: 28, value: 10 };
data1[29] = { type: 29, value: 10 };
data1[30] = { type: 30, value: 10 };
data1[31] = { type: 31, value: 10 };
data1[32] = { type: 32, value: 10 };
data1[33] = { type: 33, value: 10 };
data1[34] = { type: 34, value: 10 };
data1[35] = { type: 35, value: 10 };
data1[36] = { type: 36, value: 10 };
data1[37] = { type: 37, value: 10 };
data1[38] = { type: 38, value: 10 };
data1[39] = { type: 39, value: 10 };
data1[40] = { type: 40, value: 10 };
data1[41] = { type: 41, value: 10 };
data1[42] = { type: 42, value: 10 };
data1[43] = { type: 43, value: 10 };
data1[44] = { type: 44, value: 10 };
data1[45] = { type: 45, value: 10 };
data1[46] = { type: 46, value: 10 };
data1[47] = { type: 47, value: 10 };
data1[48] = { type: 48, value: 10 };
data1[49] = { type: 49, value: 10 };
// for (let i = 0; i < 50; i += 1) {
//   const item = {};
//   item.type = `${i}`;
//   item.value = 10;
//   data1.push(item);
// }

const data3 = [];
data3[0] = { type: 0, value: 10 };
data3[1] = { type: 1, value: 10 };
data3[2] = { type: 2, value: 10 };
data3[3] = { type: 3, value: 10 };
data3[4] = { type: 4, value: 10 };
data3[5] = { type: 5, value: 10 };
data3[6] = { type: 6, value: 10 };
data3[7] = { type: 7, value: 10 };
data3[8] = { type: 8, value: 10 };
data3[9] = { type: 9, value: 10 };
data3[10] = { type: 10, value: 10 };
data3[11] = { type: 11, value: 10 };
data3[12] = { type: 12, value: 10 };
data3[13] = { type: 13, value: 10 };
data3[14] = { type: 14, value: 10 };
data3[15] = { type: 15, value: 10 };
data3[16] = { type: 16, value: 10 };
data3[17] = { type: 17, value: 10 };
data3[18] = { type: 18, value: 10 };
data3[19] = { type: 19, value: 10 };
data3[20] = { type: 20, value: 10 };
data3[21] = { type: 21, value: 10 };
data3[22] = { type: 22, value: 10 };
data3[23] = { type: 23, value: 10 };
data3[24] = { type: 24, value: 10 };
// for (let i = 0; i < 25; i += 1) {
//   const item = {};
//   item.type = `${i}`;
//   item.value = 10;
//   data3.push(item);
// }

const data0 = [];
data0[0] = { type: 0, value: 0 };
data0[1] = { type: 1, value: 0 };
data0[2] = { type: 2, value: 0 };
data0[3] = { type: 3, value: 0 };
data0[4] = { type: 4, value: 0 };
data0[5] = { type: 5, value: 0 };
data0[6] = { type: 6, value: 0 };
data0[7] = { type: 7, value: 0 };
data0[8] = { type: 8, value: 0 };
data0[9] = { type: 9, value: 0 };
data0[10] = { type: 10, value: 0 };
data0[11] = { type: 11, value: 0 };
data0[12] = { type: 12, value: 0 };
data0[13] = { type: 13, value: 0 };
data0[14] = { type: 14, value: 0 };
data0[15] = { type: 15, value: 0 };
data0[16] = { type: 16, value: 0 };
data0[17] = { type: 17, value: 0 };
data0[18] = { type: 18, value: 0 };
data0[19] = { type: 19, value: 0 };
data0[20] = { type: 20, value: 0 };
data0[21] = { type: 21, value: 0 };
data0[22] = { type: 22, value: 0 };
data0[23] = { type: 23, value: 0 };
data0[24] = { type: 24, value: 0 };

const cols = {
  type: {
    range: [0, 1],
  },
  value: {
    sync: true,
  },
};

const colsView2 = {
  type: {
    tickCount: 3,
  },
};

@autoHeight()
class ChartsElectric extends React.Component {
  render() {
    const { title, height, realVal } = this.props;
    let intVal = Math.round(realVal);
    if (!intVal) intVal = 0;
    // const data2 = data0;
    // data0[intVal] = { type: intVal, value: 14 };

    return (
      <Chart height={height} data={intVal} scale={cols} padding={[-25, -30, 16, -30]} forceFit>
        <View data={data1}>
          <Coord
            type="polar"
            startAngle={(-9 / 8) * Math.PI}
            endAngle={(1 / 8) * Math.PI}
            radius={0.8}
            innerRadius={0.75}
          />
          <Geom type="interval" position="type*value" color="#F0F2F5" size={6} />
        </View>
        <View data={data3} scale={colsView2}>
          <Coord
            type="polar"
            startAngle={(-9 / 8) * Math.PI}
            endAngle={(1 / 8) * Math.PI}
            radius={0.55}
            innerRadius={0.95}
          />
          <Geom type="interval" position="type*value" color="#F50" size={6} />
          <Axis
            name="type"
            grid={null}
            line={null}
            tickLine={null}
            label={{
              offset: -10,
              textStyle: {
                fontSize: 14,
                fill: '#CBCBCB',
                textAlign: 'center',
              },
              formatter: val => {
                if (val === '49') {
                  return 50;
                }
                return val;
              },
            }}
          />
          <Axis name="value" visible={false} />
        </View>
        <View data={data0}>
          <Coord
            type="polar"
            startAngle={(-9 / 8) * Math.PI}
            endAngle={(1 / 8) * Math.PI}
            radius={0.8}
            innerRadius={0.75}
          />
          <Geom type="point" position="0.5*140" color={['value', '#108ee9']} opacity={1} size={6} />
          <Guide>
            <Html
              position={['50%', '95%']}
              html={() => `
                <div style="width: 300px;text-align: center;font-size: 12px!important;">
                  <p style="font-size: 16px;color: rgba(0,0,0,0.85);margin: 0;">
                    ${realVal}
                  </p>
                  <p style="font-size: 14px; color: rgba(0,0,0,0.43);margin: 0;">${title}</p>
                </div>`}
            />
          </Guide>
        </View>
      </Chart>
    );
  }
}

// CDN END
export default ChartsElectric;
