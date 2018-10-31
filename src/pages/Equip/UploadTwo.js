import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, List, Icon, Avatar, Tooltip, Badge } from 'antd';
import Ellipsis from '@/components/Ellipsis';

import styles from './Upload.less';

const IconText = ({ type, text, tip }) => (
  <Tooltip placement="top" title={`${tip}：${text}`}>
    <Icon type={type} style={{ marginRight: 8, fontSize: 14 }} />
    <Ellipsis style={{ display: 'inline' }} length={20}>
      {text}
    </Ellipsis>
  </Tooltip>
);

@connect(({ equip, loading }) => ({
  equipAnalysisInfo: equip.equipAnalysisInfo,
  loading: loading.models.equip,
}))
class UploadTwo extends PureComponent {
  componentDidMount() {
    //
    const { dispatch, stepVal } = this.props;
    dispatch({
      type: 'equip/reqCommon',
      service: 'equipAnalysis',
      payload: stepVal,
      callback: () => {
        console.log(stepVal);
      },
    });
  }

  onClickNext = () => {
    const { next } = this.props;
    const { stepVal } = this.props;
    if (next) next(stepVal);
  };

  onClickPrev = () => {
    const { prev } = this.props;

    if (prev) prev();
  };

  render() {
    const { loading, equipAnalysisInfo } = this.props;
    const { lstData, sucNum, errNum, total } = equipAnalysisInfo;
    return (
      <div className={styles.stepTwoCss}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={lstData}
          loading={loading}
          renderItem={item => {
            let actions = [];
            let typeName = '';
            let typeStatus = '';
            let equipColor = '';
            if (item.type === 0) {
              typeName = '固定设备';
              typeStatus = 'processing';
              equipColor = '#00a2ae';
              actions = [
                <IconText type="bank" text={item.factory} tip="厂家" />,
                <IconText type="sliders" text={item.xhNum} tip="型号" />,
                <IconText type="profile" text={item.bhNum} tip="编号" />,
                <IconText type="code" text={item.version} tip="软件版本" />,
                <IconText type="clock-circle" text={item.birthDate} tip="出厂时间" />,
              ];
            } else if (item.type === 1) {
              typeName = '辅助设备';
              typeStatus = 'warning';
              equipColor = '#ffbf00';
              actions = [
                <IconText type="bank" text={item.factory} tip="厂家" />,
                <IconText type="sliders" text={item.xhNum} tip="型号" />,
                <IconText type="profile" text={item.bhNum} tip="编号" />,
                <IconText type="calculator" text={item.version} tip="数量" />,
              ];
            }

            return (
              <List.Item
                key={item.name}
                actions={actions}
                extra={
                  item.delFlag === 0 ? (
                    <Badge status={typeStatus} text={typeName} />
                  ) : (
                    <div>
                      <Icon style={{ color: 'red' }} type="close-circle" />
                      {typeName}
                    </div>
                  )
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ background: item.delFlag === 0 ? equipColor : 'red' }}
                      size="small"
                      icon={item.icon}
                    />
                  }
                  title={item.name}
                  description={item.note}
                />
                {item.delFlag === 1 ? (
                  <span style={{ color: 'red' }}>异常信息： {item.description}</span>
                ) : null}
              </List.Item>
            );
          }}
          footer={
            lstData ? (
              <div>
                <b>
                  设备总数：
                  {total}
                </b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b>
                  可导入设备数：
                  {sucNum}
                </b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <b style={{ color: 'red' }}>
                  问题设备数：
                  {errNum}
                </b>
              </div>
            ) : null
          }
        />
        <div style={{ width: '100%', textAlign: 'center', padding: '50px 0' }}>
          <Button onClick={this.onClickPrev}>上一步</Button>
          <Button
            style={{ marginLeft: 18, width: 100 }}
            disabled={!lstData}
            type="primary"
            onClick={this.onClickNext}
          >
            确认导入
          </Button>
        </div>
      </div>
    );
  }
}

export default UploadTwo;
