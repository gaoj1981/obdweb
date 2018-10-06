import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Cascader,
  Card,
  Modal,
  Button,
  Table,
  Divider,
  Dropdown,
  Menu,
  Badge,
  Icon,
  message,
} from 'antd';
import { AREA_DATA } from '@/common/AreaJson';
import { getAreaId, getStatus4FuelType, deleteConfirm, getAreaName } from '@/utils/BizUtil';
import styles from './BaseInfo.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({
        id: 'form.biz.title.add',
        defaultMessage: 'No translate',
      })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label={formatMessage({ id: 'biz.car.eid', defaultMessage: 'No Translate' })}
      >
        {form.getFieldDecorator('desc', {
          rules: [
            {
              required: true,
              message: formatMessage(
                { id: 'biz.car.eid.length', defaultMessage: 'No Translate' },
                { length: 15 }
              ),
              min: 15,
            },
          ],
        })(<Input />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ car, loading }) => ({
  carPageList: car.carPageList,
  loading: loading.models.car,
}))
@Form.create()
class BaseInfo extends PureComponent {
  state = {
    modalVisible: false,
  };

  columns = [
    {
      title: <FormattedMessage id="biz.car.eid" defaultMessage="No translate" />,
      dataIndex: 'eid',
    },
    {
      title: <FormattedMessage id="biz.obd.device.number" defaultMessage="No translate" />,
      dataIndex: 'deviceNumber',
    },
    {
      title: <FormattedMessage id="biz.car.areaid" defaultMessage="No translate" />,
      dataIndex: 'areaId',
      render: val => getAreaName(val),
    },
    {
      title: <FormattedMessage id="biz.car.platenum" defaultMessage="No translate" />,
      dataIndex: 'plateNum',
    },
    {
      title: <FormattedMessage id="biz.car.enginepower" defaultMessage="No translate" />,
      dataIndex: 'enginePower',
    },
    {
      title: <FormattedMessage id="biz.car.carmodel" defaultMessage="No translate" />,
      dataIndex: 'carModel',
    },
    {
      title: <FormattedMessage id="biz.car.fueltype" defaultMessage="No translate" />,
      dataIndex: 'fuelType',
      render(val) {
        return <Badge status={getStatus4FuelType(val)} text={val} />;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              deleteConfirm('车辆', record.id, this.handleDelete);
            }}
          >
            删除
          </a>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this.moreBtnExc(key)}>
                <Menu.Item key="record">维修保养</Menu.Item>
                <Menu.Item key="buser">销售售后</Menu.Item>
                <Menu.Item key="insur">车辆保险</Menu.Item>
                <Menu.Item key="mot">车辆年检</Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/fetchPageCar',
      payload: { paging: 1 },
    });
  }

  handleDelete = id => {
    console.log('delete', id);
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { areaId } = fieldsValue;
      dispatch({
        type: 'car/fetchPageCar',
        payload: { eidLike: fieldsValue.eidLike, areaId: getAreaId(areaId), paging: 1 },
      });
    });
  };

  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'car/fetchPageCar',
      payload: { paging: 1 },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    console.log(fields);
    message.success('添加成功');
    this.handleModalVisible();
  };

  moreBtnExc = key => {
    console.log(key);
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="车辆编号">
              {getFieldDecorator('eidLike')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="所在区域">
              {getFieldDecorator('areaId')(
                <Cascader placeholder="请选择" options={AREA_DATA.areaIds} allowClear />
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={20}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
          <Col md={2} sm={4}>
            <Button
              type="primary"
              shape="circle"
              icon="plus"
              onClick={() => this.handleModalVisible(true)}
            />
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      carPageList: { content, totalElements, number, size },
      loading,
    } = this.props;
    const { modalVisible } = this.state;

    // 分页
    const pagination = { current: number + 1, pageSize: size, total: totalElements };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              rowKey="id"
              loading={loading}
              columns={this.columns}
              dataSource={content || []}
              size="small"
              pagination={pagination}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default BaseInfo;
