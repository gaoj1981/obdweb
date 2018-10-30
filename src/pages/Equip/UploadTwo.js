import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Button, List, Icon, Avatar, Tooltip } from 'antd';

import styles from './Upload.less';

const IconText = ({ type, text, tip }) => (
  <Tooltip placement="top" title={`${tip}：${text}`}>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </Tooltip>
);

const listData = [];
for (let i = 0; i < 23; i += 1) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: '',
  });
}

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
    return (
      <div className={styles.stepTwoCss}>
        <FormattedMessage id="menu.equip.listview" />

        <List
          itemLayout="vertical"
          size="large"
          dataSource={listData}
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={[
                <IconText type="star-o" text="瑞光康泰" tip="厂家" />,
                <IconText type="like-o" text="TDL-200型" tip="型号" />,
                <IconText type="message" text="J40G022N-608-69BZA" tip="编号" />,
                <IconText type="message" text="WIN10专业版操作系统" tip="软件版本" />,
                <IconText type="message" text="2" tip="出厂时间" />,
              ]}
              extra={<Icon type="check" />}
            >
              <List.Item.Meta avatar={<Avatar src={item.avatar} />} title={item.title} />
              {item.content}
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
