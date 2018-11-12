import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import { Row, Col, Input, Button, Form, Divider, Slider, Alert, Icon } from 'antd';
import { Map, Marker } from 'react-amap';
import { getAreaArr, getAreaName } from '@/utils/BizUtil';
import ObdGaugeWidget from './ObdGaugeWidget';
import ObdSpeedWidget from './ObdSpeedWidget';
import WaterWave from '@/components/Charts/WaterWave';
import WsStomp from '@/common/WsStomp';

import styles from './Obd.less';

// 共通常量
const FormItem = Form.Item;
const localVal = getLocale();
const styleA = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  padding: '5px 10px',
  border: '1px solid #d3d3d3',
  backgroundColor: 'rgba(255,255,255,0.8)',
};
// Stomp
const { Stomp } = WsStomp;
let stompClient;
let subscribeHook;

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

  componentDidMount() {
    // 建立连接对象（还未发起连接）
    const socket = new WebSocket(`ws://${window.location.host}/stomp`);
    // 获取 STOMP 子协议的客户端对象
    stompClient = Stomp.over(socket);
    // 向服务器发起websocket连接并发送CONNECT帧
    stompClient.connect(
      {},
      frame => {
        // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
        console.log(`已连接【${frame}】`);
      },
      error => {
        // 连接失败时（服务器响应 ERROR 帧）的回调方法
        console.log(`连接失败【${error}】`);
      }
    );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/clearObdInfo',
      payload: {},
    });
    stompClient.disconnect();
  }

  handleSearch = e => {
    if (subscribeHook) {
      subscribeHook.unsubscribe();
    }
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
          if (stompClient && stompClient.connected) {
            this.subscribe(`/queue/obd.data.${obdInfo.eid}`);
          }
        },
      });
    });
  };

  subscribe = destination => {
    if (subscribeHook) {
      subscribeHook.unsubscribe();
    }
    subscribeHook = stompClient.subscribe(destination, response => {
      console.log('message:', response.body);
      const posiObj = JSON.parse(response.body);
      this.setState({ center: { longitude: posiObj.lng, latitude: posiObj.lat }, zoom: 15 });
      const { dispatch } = this.props;
      dispatch({
        type: 'car/clearObdInfo',
        payload: posiObj,
      });
    });
  };

  render() {
    const { center, zoom } = this.state;
    const {
      form: { getFieldDecorator },
      loading,
      obdInfo,
    } = this.props;

    let areaArr = [0, 0, 0];
    if (obdInfo) {
      areaArr = getAreaArr(obdInfo.areaId);
    }

    const marks = {
      0: '-20°C',
      100: {
        style: {
          color: '#f50',
        },
        label: <strong>100°C</strong>,
      },
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={styles.testCss}>
        <Form onSubmit={this.handleSearch}>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="车辆编号">
                {getFieldDecorator('eid', {
                  rules: [
                    {
                      required: true,
                      message:
                        localVal === 'zh-CN'
                          ? formatMessage({
                              id: 'biz.common.require.input',
                              defaultMessage: 'No Translate',
                            })
                          : null,
                    },
                    {
                      max: 20,
                      message:
                        localVal === 'zh-CN'
                          ? formatMessage(
                              { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                              { length: 20 }
                            )
                          : null,
                    },
                  ],
                })(<Input placeholder="请输入准确的车辆编号" />)}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem wrapperCol={{ span: 23, offset: 1 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  <FormattedMessage id="form.search" defaultMessage="No translate" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        {obdInfo && obdInfo.eid ? (
          <Alert
            style={{ marginBottom: 18 }}
            message={
              <div>
                <h3>当前车辆信息：</h3>
                <Icon type="car" theme="twoTone" />
                &nbsp;
                {obdInfo.carName}（{obdInfo.eid}）
                <Divider type="vertical" style={{ margin: '0 14px' }} />
                <Icon type="pushpin" theme="twoTone" twoToneColor="#52c41a" />
                &nbsp;
                {getAreaName(areaArr[0])}
                {getAreaName(areaArr[1])}
                {getAreaName(obdInfo.areaId)}
              </div>
            }
            type="info"
            showIcon
          />
        ) : null}
        {obdInfo && obdInfo.faulContext ? (
          <Alert
            style={{ marginBottom: 18 }}
            message={`本车存在故障。故障内容描述：${obdInfo.faulContext}`}
            type="error"
            showIcon
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
