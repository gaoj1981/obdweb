import React, { Fragment, PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Row, Col, Card } from 'antd';
import Result from '@/components/Result';
import { getAreaArr, getAreaName } from '@/utils/BizUtil';

import styles from './Upload.less';

@connect(({ equip, loading }) => ({
  equipImportInfo: equip.equipImportInfo,
  loading: loading.models.equip,
}))
class UploadThree extends PureComponent {
  componentDidMount() {
    //
    const { dispatch, stepVal } = this.props;
    dispatch({
      type: 'equip/reqCommon',
      service: 'equipImport',
      payload: stepVal,
      callback: () => {
        console.log(stepVal);
      },
    });
  }

  componentWillUnmount() {
    console.log('unmount three');
    const { dispatch } = this.props;
    dispatch({
      type: 'equip/clearEquipImport',
    });
    dispatch({
      type: 'equip/clearEquipAnalysis',
    });
  }

  viewInfo = () => {
    const { stepVal } = this.props;
    router.push(`/equip/list/${stepVal.eid}`);
  };

  render() {
    const { stepVal, equipImportInfo, goStepOne, loading } = this.props;
    const { areaId } = stepVal;
    const areaArr = getAreaArr(areaId);
    const extra = (
      <Fragment>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '500',
            marginBottom: 20,
          }}
        >
          所属区县：
          {equipImportInfo
            ? `${getAreaName(areaArr[0])} ${getAreaName(areaArr[1])} ${getAreaName(areaId)}`
            : null}
        </div>
        <Row style={{ marginBottom: 16 }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            车辆编号：
            {equipImportInfo ? stepVal.eid : null}
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            成功导入设备数： {equipImportInfo ? stepVal.total : 0}
          </Col>
        </Row>
      </Fragment>
    );

    const actions = (
      <Fragment>
        <Button type="primary" onClick={goStepOne}>
          {equipImportInfo ? '继续导入' : '重新导入'}
        </Button>
        <Button onClick={this.viewInfo}>查看设备</Button>
      </Fragment>
    );

    return (
      <div className={styles.stepThreeCss}>
        <Card bordered={false} loading={loading}>
          {equipImportInfo ? (
            <Result
              type="success"
              title="导入成功"
              description={`文件（${stepVal.originalName}）中的设备数据导入完成。详情如下：`}
              extra={extra}
              actions={actions}
              style={{ marginTop: 48, marginBottom: 16 }}
            />
          ) : (
            <Result
              type="error"
              title="导入失败"
              description={`文件（${stepVal.originalName}）中的设备数据导入异常。请尝试重新导入！`}
              extra={extra}
              actions={actions}
              style={{ marginTop: 48, marginBottom: 16 }}
            />
          )}
        </Card>
      </div>
    );
  }
}

export default UploadThree;
