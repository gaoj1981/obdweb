import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Card } from 'antd';

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
            <Col span={12}>
              <Button type="primary" icon="search">
                查询
              </Button>
            </Col>
          </Row>
        </Form>
        <Row gutter={16}>
          <Col span={11}>
            {obdInfo ? (
              <Card title={`${obdInfo.name || ''}（${obdInfo.eid}）`} style={{ width: '100%' }}>
                <Row gutter={16}>
                  <Col span={10} className={styles.textRight}>
                    汽车仪表总里程（KM）：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.dashboardTotalMileage || ''}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    车辆速度（KM/H）：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.vehicleSpeed}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    发动机转速：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.engineTurnSpeed}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    剩余油量：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.remainingGasValue}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    经度：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.lng}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    纬度：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.lat}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    故障灯状态：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.faultLightStatus || '/'}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    故障灯个数（个）：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.faultLigthNumber || 0}
                  </Col>

                  <Col span={10} className={styles.textRight}>
                    故障内容描述：
                  </Col>
                  <Col span={14} className={styles.textLeft}>
                    {obdInfo.faulContext || '/'}
                  </Col>
                </Row>
              </Card>
            ) : (
              '该车辆无对应的OBD信息'
            )}
          </Col>
          <Col span={13}>map</Col>
        </Row>
      </div>
    );
  }
}

export default BaseInfo;
