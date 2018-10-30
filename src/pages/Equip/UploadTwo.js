import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, List, Icon, Avatar, Tooltip } from 'antd';

import styles from './Upload.less';

const IconText = ({ type, text, tip }) => (
  <Tooltip placement="top" title={`${tip}：${text}`}>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
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

    if (next) next();
  };

  onClickPrev = () => {
    const { prev } = this.props;

    if (prev) prev();
  };

  render() {
    const { loading, equipAnalysisInfo } = this.props;
    return (
      <div className={styles.stepTwoCss}>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={equipAnalysisInfo}
          loading={loading}
          renderItem={item => (
            <List.Item
              key={item.name}
              actions={[
                <IconText type="bank" text={item.factory} tip="厂家" />,
                <IconText type="sliders" text={item.xhNum} tip="型号" />,
                <IconText type="profile" text={item.bhNum} tip="编号" />,
                <IconText type="code" text={item.version} tip="软件版本" />,
                <IconText type="clock-circle" text={item.birthDate} tip="出厂时间" />,
              ]}
              extra={<Icon type="check" />}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: '#f56a00' }}
                    size="small"
                    icon="robot"
                    alt="固定信息"
                  />
                }
                title={item.name}
              />
              {item.note}
            </List.Item>
          )}
        />

        <Button type="primary" onClick={this.onClickNext} style={{ width: 200, marginTop: 30 }}>
          下一步
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={this.onClickPrev}>
          上一步
        </Button>
      </div>
    );
  }
}

export default UploadTwo;
