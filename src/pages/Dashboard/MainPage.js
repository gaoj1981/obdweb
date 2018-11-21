import React, { Fragment, PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, Avatar, Button, Divider } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CarBarWidget from '../Car/CarBarWidget';
import MiniArea from '@/components/Charts/MiniArea';

import styles from './MainPage.less';

const salesData = [];
const testPeople = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: testPeople[i],
  });
}

@connect(({ user, loading, equip, car, charts }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  licCountSum: equip.licCountSum,
  carCountSum: car.carCountSum,
  carProvGroup: charts.carProvGroup,
}))
class MainPage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    //
    dispatch({
      type: 'user/fetchCurrent',
    });
    //
    dispatch({
      type: 'equip/fetchLicCountSum',
    });
    //
    dispatch({
      type: 'car/fetchCarCountSum',
    });
    //
    dispatch({
      type: 'charts/reqCommon',
      service: 'chartCarProvGroup',
      payload: { groupType: 1 },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  btnGuideClick = type => {
    switch (type) {
      case 'car':
        router.push('/car/basic');
        break;
      case 'upload':
        router.push('/equip/upload');
        break;
      case 'obd':
        router.push('/car/obd');
        break;
      case 'insur':
        router.push('/car/insur');
        break;
      default:
        break;
    }
  };

  render() {
    const { currentUser, currentUserLoading, licCountSum, carCountSum, carProvGroup } = this.props;

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
          <p>{carCountSum || 0}</p>
        </div>
        {currentUser && currentUser.role !== 'user' ? (
          <Fragment>
            <div className={styles.statItem}>
              <p>{formatMessage({ id: 'biz.lic.count.sum', defaultMessage: 'No Translate' })}</p>
              <p>
                {licCountSum ? licCountSum[0] : 0}
                <span> / {licCountSum ? licCountSum[1] : 0}</span>
              </p>
            </div>
            <div className={styles.statItem}>
              <p>{formatMessage({ id: 'biz.car.count.record', defaultMessage: 'No Translate' })}</p>
              <p>0</p>
            </div>
          </Fragment>
        ) : null}
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              className={styles.activeCard}
              title={formatMessage({ id: 'biz.dashboard.guide', defaultMessage: 'No Translate' })}
            >
              <Row gutter={6}>
                <Col span={6}>
                  <Button icon="car" type="primary" ghost onClick={() => this.btnGuideClick('car')}>
                    <FormattedMessage id="biz.car.list" defaultMessage="NoTrans" />
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    icon="upload"
                    type="primary"
                    ghost
                    onClick={() => this.btnGuideClick('upload')}
                  >
                    <FormattedMessage id="biz.equip.upload" defaultMessage="NoTrans" />
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    icon="video-camera"
                    type="primary"
                    ghost
                    onClick={() => this.btnGuideClick('obd')}
                  >
                    <FormattedMessage id="biz.obd.monitor" defaultMessage="NoTrans" />
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    icon="insurance"
                    type="primary"
                    ghost
                    onClick={() => this.btnGuideClick('insur')}
                  >
                    <FormattedMessage id="biz.car.insur" defaultMessage="NoTrans" />
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              bordered={false}
              className={styles.activeCard}
              title={formatMessage({ id: 'biz.dashboard.dynamic', defaultMessage: 'No Translate' })}
            >
              <Row gutter={6}>
                <Col span={5}>
                  <Button type="dashed">
                    <FormattedMessage id="component.noticeIcon.empty" defaultMessage="NoTrans" />
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card
              className={styles.projectList}
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              title={formatMessage({
                id: 'biz.chart.list',
                defaultMessage: 'No Translate',
              })}
              bordered={false}
              extra={
                <Link to="/dashboard">
                  {formatMessage({
                    id: 'biz.dashboard.project.all',
                    defaultMessage: 'No Translate',
                  })}
                </Link>
              }
            >
              <Row>
                <Col span={24}>
                  <CarBarWidget
                    height={400}
                    padding={0}
                    title="区域车辆对比（单位：辆）"
                    data={carProvGroup}
                  />
                </Col>
              </Row>
              <Divider dashed />
              <MiniArea
                title="车载设备检测趋势（单位：人）"
                line
                color="#cceafe"
                height={145}
                data={salesData}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default MainPage;
