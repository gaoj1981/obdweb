import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Divider, Slider, Alert } from 'antd';
import ObdGaugeWidget from './ObdGaugeWidget';
import ObdMileageWidget from './ObdMileageWidget';
import ObdSpeedWidget from './ObdSpeedWidget';
import WaterWave from '@/components/Charts/WaterWave';

import styles from './Obd.less';

// 共通常量
const FormItem = Form.Item;

@connect(({ car, loading }) => ({
  obdInfo: car.obdInfo,
  loading: loading.models.car,
}))
@Form.create()
class BaseInfo extends PureComponent {
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
      });
    });
  };

  render() {
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

    const chartData = [];
    for (let i = 0; i < 20; i += 1) {
      chartData.push({
        x: new Date().getTime() + 1000 * 60 * 30 * i,
        y1: Math.floor(Math.random() * 100) + 1000,
        y2: Math.floor(Math.random() * 100) + 10,
      });
    }

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
            <ObdMileageWidget
              val={Math.floor(obdInfo.dashboardTotalMileage / 10000)}
              realVal={Math.round(obdInfo.dashboardTotalMileage) / 10000 || 0}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default BaseInfo;
