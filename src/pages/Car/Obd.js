import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Divider, Slider, Alert } from 'antd';
import { Map, Marker } from 'react-amap';
import ObdGaugeWidget from './ObdGaugeWidget';
import ObdSpeedWidget from './ObdSpeedWidget';
import WaterWave from '@/components/Charts/WaterWave';

import styles from './Obd.less';

// 共通常量
const FormItem = Form.Item;
const styleA = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  padding: '5px 10px',
  border: '1px solid #d3d3d3',
  backgroundColor: 'rgba(255,255,255,0.8)',
};

@connect(({ car, loading }) => ({
  obdInfo: car.obdInfo,
  loading: loading.models.car,
}))
@Form.create()
class Obd extends PureComponent {
  state = {
    center: { longitude: 116.46, latitude: 39.92 },
    zoom: 3,
  };

  componentDidMount() {}

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/clearObdInfo',
      payload: {},
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { dispatch } = this.props;
      dispatch({
        type: 'car/reqCommon',
        service: 'getObdInfo',
        payload: fieldsValue,
        callback: () => {
          const { obdInfo } = this.props;
          if (obdInfo.lng && obdInfo.lat) {
            this.setState({ center: { longitude: obdInfo.lng, latitude: obdInfo.lat }, zoom: 15 });
          } else {
            this.setState({ center: { longitude: 116.46, latitude: 39.92 }, zoom: 3 });
          }
        },
      });
    });
  };

  render() {
    const { center, zoom } = this.state;
    const {
      form: { getFieldDecorator },
      obdInfo,
    } = this.props;

    const marks = {
      0: '-20°C',
      100: {
        style: {
          color: '#f50',
        },
        label: <strong>100°C</strong>,
      },
    };

    return (
      <div className={styles.testCss}>
        <h2>
          <FormattedMessage id="menu.car.obd" />
        </h2>
        <Form onSubmit={this.handleSearch} layout="vertical">
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('eid', { rule: [{ required: true }] })(
                  <Input placeholder="请输入准确的车辆编号" />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button type="primary" icon="search" htmlType="submit">
                查询
              </Button>
            </Col>
            <Col span={12}>&nbsp;</Col>
          </Row>
        </Form>
        {obdInfo && obdInfo.faulContext ? (
          <Alert
            style={{ marginBottom: 18 }}
            message={`本车存在故障。故障内容描述：${obdInfo.faulContext}`}
            type="error"
          />
        ) : null}
        <Row gutter={16} style={{ backgroundColor: '#FFF', padding: 8 }}>
          <Col span={6} style={{ textAlign: 'center' }}>
            <WaterWave height={161} title="剩余油量" percent={obdInfo.remainingGasValue || 0} />
          </Col>
          <Col span={6}>
            <ObdSpeedWidget
              val={Math.floor(obdInfo.vehicleSpeed)}
              realVal={obdInfo.vehicleSpeed || 0}
            />
          </Col>
          <Col span={6}>
            <ObdGaugeWidget
              title="汽车仪表总里程（KM）"
              height={166}
              percent={Math.floor((obdInfo.dashboardTotalMileage / 300000) * 100)}
              realVal={obdInfo.dashboardTotalMileage || 0}
            />
          </Col>
          <Col span={6}>
            <Slider
              className={styles.sliderMargin}
              style={{ marginTop: 10 }}
              marks={marks}
              value={obdInfo.environmentTemperature || 0}
              tipFormatter={val => `车辆环境温度${val}°C`}
            />
            <Slider
              className={styles.sliderMargin}
              marks={marks}
              value={obdInfo.airDoorTemperature || 0}
              tipFormatter={val => `进气口温度${val}°C`}
            />
            <Slider
              className={styles.sliderMargin}
              marks={marks}
              value={obdInfo.coolWaterTemperature || 0}
              tipFormatter={val => `冷却液温度${val}°C`}
            />
          </Col>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <div style={{ width: '100%', height: '400px' }}>
              <Map amapkey="2ec66eeb79bec886849c43b34e26323c" center={center} zoom={zoom}>
                <Marker position={center} />
                <div className="customLayer" style={styleA}>
                  <h4>
                    当前经度：
                    {obdInfo && obdInfo.lng ? center.longitude : '暂无'}
                  </h4>
                  <h4>
                    当前纬度：
                    {obdInfo && obdInfo.lat ? center.latitude : '暂无'}
                  </h4>
                </div>
              </Map>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Obd;
