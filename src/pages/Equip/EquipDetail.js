import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Table } from 'antd';

import { renderForNull } from '@/utils/BizUtil';

import styles from './EquipDetail.less';

// 底层组件
@connect(({ equip, loading }) => ({
  equipDetail: equip.equipDetail,
  loading: loading.models.equip,
}))
class EquipDetail extends PureComponent {
  columns = [
    {
      title: '设备名称',
      align: 'center',
      width: '14%',
      dataIndex: 'name',
    },
    {
      title: '厂家',
      align: 'center',
      width: '13%',
      dataIndex: 'factory',
    },
    {
      title: '型号',
      align: 'center',
      width: '13%',
      dataIndex: 'xhNum',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '编号',
      align: 'center',
      width: '13%',
      dataIndex: 'bhNum',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '软件版本',
      align: 'center',
      width: '17%',
      dataIndex: 'version',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '出厂时间',
      align: 'center',
      width: '12%',
      dataIndex: 'birthDate',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '备注',
      align: 'center',
      width: '18%',
      dataIndex: 'note',
      render: val => renderForNull(val, '/'),
    },
  ];

  columnsAssist = [
    {
      title: '设备名称',
      align: 'center',
      width: '14%',
      dataIndex: 'name',
    },
    {
      title: '厂家',
      align: 'center',
      width: '13%',
      dataIndex: 'factory',
    },
    {
      title: '型号',
      align: 'center',
      width: '13%',
      dataIndex: 'xhNum',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '编号',
      align: 'center',
      width: '13%',
      dataIndex: 'bhNum',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '数量',
      align: 'center',
      width: '17%',
      dataIndex: 'countNum',
      render: val => renderForNull(val, '/'),
    },
    {
      title: '备注',
      align: 'center',
      width: '30%',
      dataIndex: 'note',
      render: val => renderForNull(val, '/'),
    },
  ];

  componentDidMount() {
    //
    const {
      dispatch,
      match: {
        params: { eidParam },
      },
    } = this.props;
    dispatch({
      type: 'equip/reqCommon',
      service: 'getEquipDetail',
      payload: { eid: eidParam },
    });
  }

  render() {
    const {
      equipDetail: { name, lstFixed, lstAssist },
    } = this.props;

    return (
      <div className={styles.testCss}>
        <Table
          columns={this.columns}
          dataSource={lstFixed}
          bordered
          pagination={false}
          title={() => (
            <h3>
              （{name}
              ）车辆信息表
            </h3>
          )}
        />
        <Table
          columns={this.columnsAssist}
          dataSource={lstAssist}
          bordered
          pagination={false}
          title={() => <h3>配料表</h3>}
        />
      </div>
    );
  }
}

export default EquipDetail;
