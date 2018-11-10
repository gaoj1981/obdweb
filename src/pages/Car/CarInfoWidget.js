import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Modal, Table, Tooltip } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import BizConst from '@/common/BizConst';
import { getAreaName } from '@/utils/BizUtil';

// 底层组件
@connect(({ car, loading }) => ({
  carInfo: car.carInfo,
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
    const { dispatch, values } = this.props;
    console.log(values.id);
    const param = { query: {}, page: 0, size: BizConst.size };
    dispatch({
      type: 'car/reqCommon',
      service: 'queryCarList',
      payload: param,
    });
  }

  render() {
    const { handleCarModalVisible, loading } = this.props;

    return (
      <Modal
        width={800}
        destroyOnClose
        title="车辆一览"
        visible
        onCancel={() => handleCarModalVisible()}
        onOk={() => handleCarModalVisible()}
      >
        <Table columns={this.columns} dataSource={[]} size="small" loading={loading} />
      </Modal>
    );
  }
}

export default CarInfoWidget;
