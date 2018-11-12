import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Modal, Table, Tooltip } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { getAreaName } from '@/utils/BizUtil';
import { getPagination } from '../../common/TableLists';

// 底层组件
@connect(({ car, loading }) => ({
  carPageList: car.carPageList,
  loading: loading.models.car,
}))
class CarInfoWidget extends PureComponent {
  columns = [
    {
      title: <FormattedMessage id="biz.car.eid" defaultMessage="No translate" />,
      dataIndex: 'eid',
      render: val => (
        <Ellipsis length={15} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: <FormattedMessage id="biz.car.name" defaultMessage="No translate" />,
      dataIndex: 'carName',
      render: val => (
        <Ellipsis length={8} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: <FormattedMessage id="biz.car.areaid" defaultMessage="No translate" />,
      dataIndex: 'areaId',
      render: (text, record) => (
        <Tooltip
          placement="top"
          title={`${getAreaName(record.provId)}${getAreaName(record.cityId)}`}
        >
          {getAreaName(text)}
        </Tooltip>
      ),
    },
    {
      title: <FormattedMessage id="biz.car.platenum" defaultMessage="No translate" />,
      dataIndex: 'plateNum',
      render: val => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: <FormattedMessage id="biz.obd.device.number" defaultMessage="No translate" />,
      dataIndex: 'deviceNumber',
      render: val => (
        <Ellipsis length={15} tooltip>
          {val}
        </Ellipsis>
      ),
    },
  ];

  componentDidMount() {
    this.dispatchCarPage(0);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/clearCarPage',
      payload: {},
    });
  }

  handleTableChange = pagination => {
    const { current } = pagination;
    this.dispatchCarPage(current ? current - 1 : 0);
  };

  dispatchCarPage(curPage) {
    const { dispatch, values } = this.props;
    const param = { query: { buserId: values.id }, page: curPage, size: 8 };
    dispatch({
      type: 'car/reqCommon',
      service: 'queryCarList',
      payload: param,
    });
  }

  render() {
    const {
      handleCarModalVisible,
      carPageList: { content, totalElements, size, number },
      loading,
    } = this.props;

    return (
      <Modal
        width={800}
        destroyOnClose
        title="车辆一览"
        visible
        onCancel={() => handleCarModalVisible()}
        footer={null}
      >
        <Table
          columns={this.columns}
          dataSource={content || []}
          pagination={getPagination({ totalElements, size, number })}
          onChange={this.handleTableChange}
          size="small"
          loading={loading}
        />
      </Modal>
    );
  }
}

export default CarInfoWidget;
