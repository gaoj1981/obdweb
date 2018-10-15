import React from 'react';
import { connect } from 'dva';
import { Button, Input, Icon, Popover, List, Tag, Avatar, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';

import styles from './BuserSelWidget.less';

const { Search } = Input;

@connect(({ car, loading }) => ({
  buserPageList: car.pageBindUser,
  bindUserInfo: car.bindUser,
  baseLoading: loading.models.car,
}))
class BuserSelWidget extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || '';
    this.state = {
      bindUser: null,
      uid: value,
      scrollData: [],
      hasMore: false,
      curPg: 0,
      searVal: '',
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value, baseLoading } = nextProps;
      this.setState({ uid: value });
      const { bindUser } = this.state;
      if (!bindUser && value && !baseLoading) {
        const { dispatch } = this.props;
        const param = { id: value };
        dispatch({
          type: 'car/reqCommon',
          service: 'getBindUser',
          payload: param,
          callback: () => {
            const { bindUserInfo } = this.props;
            this.setState({ bindUser: bindUserInfo });
          },
        });
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/clearBindUser',
      payload: {},
    });
    this.setState({ uid: null, scrollData: [], hasMore: false, curPg: 0, searVal: '' });
  }

  onVisiblePopover = () => {
    const { scrollData } = this.state;
    if (!scrollData || scrollData.length === 0) {
      this.dispatchList(null, 0);
    }
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  remove = () => {
    this.setState({ bindUser: null, uid: null });
    this.triggerChange(null);
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  handleInfiniteOnLoad = () => {
    const { searVal } = this.state;
    let { curPg } = this.state;
    const { buserPageList, baseLoading } = this.props;
    const { totalPages } = buserPageList;
    if (!curPg) curPg = 0;
    if (totalPages >= curPg + 1 && !baseLoading) {
      this.dispatchList(searVal, curPg);
    } else {
      console.log('无更多相应人员信息');
    }
  };

  onSearchPopover = value => {
    this.dispatchList(value, 0);
  };

  dispatchList = (searVal, curPg) => {
    const pgSize = 10;
    const { dispatch, utype } = this.props;
    const param = { page: curPg, query: { orUnameTel: searVal, utype }, size: pgSize };
    dispatch({
      type: 'car/reqCommon',
      service: 'pageBindUser',
      payload: param,
      callback: () => {
        let page = curPg;
        let { scrollData } = this.state;
        const { buserPageList } = this.props;
        if (page === 0) {
          scrollData = buserPageList.content;
        } else {
          scrollData = scrollData.concat(buserPageList.content);
        }
        let hasMore = true;
        if (buserPageList.length < pgSize) {
          hasMore = false;
        } else {
          page += 1;
        }
        this.setState({ hasMore, scrollData, curPg: page, searVal });
      },
    });
  };

  hidePopover(item) {
    this.triggerChange(item.id);
    this.setState({
      visible: false,
      scrollData: [],
      curPg: 0,
      bindUser: item,
      uid: item.id,
    });
  }

  render() {
    const { hasMore, scrollData, curPg, uid, visible, bindUser } = this.state;
    const { baseLoading } = this.props;

    const popoContent = (
      <div className="introCss">
        <Search
          placeholder="手机号/姓名"
          onSearch={this.onSearchPopover}
          enterButton
          style={{ marginBottom: 10 }}
          size="small"
        />
        <div className={styles.introScrollDiv}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={curPg}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={hasMore}
            useWindow={false}
            threshold={50}
          >
            <List
              size="small"
              dataSource={scrollData}
              loading={baseLoading}
              renderItem={item => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={<Avatar icon="user" style={{ backgroundColor: '#ffbf00' }} />}
                    title={
                      <div>
                        <Ellipsis tooltip={item.uname} style={{ display: 'inline' }} length={8}>
                          {item.uname}
                        </Ellipsis>
                        <a
                          onClick={this.hidePopover.bind(this, item)}
                          style={{ float: 'right', marginRight: 10 }}
                        >
                          {item.id === uid ? '' : '选择'}
                        </a>
                      </div>
                    }
                    description={
                      <div>
                        <Icon type="phone" style={{ color: '#ffbf00' }} />
                        {item.tel}
                        <Divider type="vertical" />
                        {item.urTel}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </div>
    );

    let selMsg = null;
    if (bindUser && Object.keys(bindUser).length > 0) {
      selMsg = (
        <Tag color="#f39c12" closable afterClose={this.remove} style={{ marginLeft: 3 }}>
          <Ellipsis tooltip={bindUser.uname} style={{ display: 'inline' }} length={4}>
            {bindUser.uname}
          </Ellipsis>
          &nbsp;
          <Icon type="phone" /> {bindUser.tel}
          <span className="ant-divider" />
        </Tag>
      );
    }

    return (
      <div>
        <Popover
          placement="rightBottom"
          content={popoContent}
          trigger="click"
          autoAdjustOverflow
          arrowPointAtCenter
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button
            type="dashed"
            icon={uid ? 'retweet' : 'plus'}
            size="small"
            onClick={this.onVisiblePopover}
          />
        </Popover>
        {selMsg}
      </div>
    );
  }
}

export default BuserSelWidget;
