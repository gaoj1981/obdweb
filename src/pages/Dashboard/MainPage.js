import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './MainPage.less';

@connect(({ user, loading, equip }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  licCountSum: equip.licCountSum,
}))
class MainPage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'equip/fetchLicCountSum',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const {
      activities: { list },
    } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar} />}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  render() {
    const { currentUser, currentUserLoading, licCountSum } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              <FormattedMessage id="biz.dashboard.hello.prefix" />
              {currentUser.name}，<FormattedMessage id="biz.dashboard.hello.suffix" />
            </div>
            <div>
              {currentUser.title} |{currentUser.group}
            </div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>{formatMessage({ id: 'biz.car.count.total', defaultMessage: 'No Translate' })}</p>
          <p>56</p>
        </div>
        <div className={styles.statItem}>
          <p>{formatMessage({ id: 'biz.car.count.total', defaultMessage: 'No Translate' })}</p>
          <p>
            {licCountSum[0]}
            <span> / {licCountSum[1]}</span>
          </p>
        </div>
        <div className={styles.statItem}>
          <p>{formatMessage({ id: 'biz.car.count.record', defaultMessage: 'No Translate' })}</p>
          <p>2,223</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title={formatMessage({
                id: 'biz.dashboard.project.coding',
                defaultMessage: 'No Translate',
              })}
              bordered={false}
              extra={
                <Link to="/">
                  {formatMessage({
                    id: 'biz.dashboard.project.all',
                    defaultMessage: 'No Translate',
                  })}
                </Link>
              }
              bodyStyle={{ padding: 0 }}
            />
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              className={styles.activeCard}
              title={formatMessage({ id: 'biz.dashboard.guide', defaultMessage: 'No Translate' })}
            />
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title={formatMessage({ id: 'biz.dashboard.dynamic', defaultMessage: 'No Translate' })}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            />
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title={formatMessage({ id: 'biz.car', defaultMessage: 'No Translate' })}
            />
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default MainPage;
