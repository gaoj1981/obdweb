import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Cascader,
  Card,
  Button,
  Divider,
  Dropdown,
  Menu,
  Badge,
  Icon,
  Tooltip,
  message,
} from 'antd';
import { AREA_DATA } from '@/common/AreaJson';
import Ellipsis from '@/components/Ellipsis';
import { getAreaId, getStatus4FuelType, deleteConfirm, getAreaName } from '@/utils/BizUtil';
import { TableListBase } from '@/common/TableLists';
import CreateCarForm from './CreateCarForm';
import ModifyCarForm from './ModifyCarForm';
import styles from './BaseInfo.less';

// 共通常量
const FormItem = Form.Item;

@connect(({ user, car, loading }) => ({
  currentUser: user.currentUser,
  carPageList: car.carPageList,
  carInfo: car.carInfo,
  loading: loading.models.car,
}))
@Form.create()
class BaseInfo extends PureComponent {
  state = {
    modalVisible: false,
    drawerVisible: false,
    drawerWidth: 666,
    pageQuery: {},
    queryPage: 0,
  };

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
      title: <FormattedMessage id="biz.obd.device.number" defaultMessage="No translate" />,
      dataIndex: 'deviceNumber',
      render: val => (
        <Ellipsis length={15} tooltip>
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
      title: <FormattedMessage id="biz.car.carmodel" defaultMessage="No translate" />,
      dataIndex: 'carModel',
      render: val => (
        <Ellipsis length={8} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: <FormattedMessage id="biz.car.fueltype" defaultMessage="No translate" />,
      dataIndex: 'fuelType',
      render(val) {
        return val ? <Badge status={getStatus4FuelType(val)} text={val} /> : val;
      },
    },
    {
      title: <FormattedMessage id="form.action" defaultMessage="No translate" />,
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDrawerVisible(true, record.id)}>
            <FormattedMessage id="form.edit" defaultMessage="No translate" />
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              deleteConfirm('车辆', record.id, this.handleDelete);
            }}
          >
            <FormattedMessage id="form.delete" defaultMessage="No translate" />
          </a>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              /* eslint-disable */
              this.props.currentUser && this.props.currentUser.userid === '2' ? (
                <Menu onClick={({ key }) => this.moreBtnExc(key, record)}>
                  <Menu.Item key="record">维修保养</Menu.Item>
                  <Menu.Item key="insur">车辆保险</Menu.Item>
                  <Menu.Item key="mot">车辆年检</Menu.Item>
                  <Menu.Item key="equip">设备详情</Menu.Item>
                </Menu>
              ) : (
                <Menu onClick={({ key }) => this.moreBtnExc(key, record)}>
                  <Menu.Item key="insur">车辆保险</Menu.Item>
                  <Menu.Item key="mot">车辆年检</Menu.Item>
                </Menu>
              )
            }
          >
            <a>
              <FormattedMessage id="form.more" defaultMessage="No translate" /> <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.dispatchPageList();
  }

  handleDelete = id => {
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'delCar',
      payload: { id },
      callback: () => {
        this.dispatchPageList();
        message.success('删除成功');
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { areaIds } = fieldsValue;
      this.dispatchPageList(0, { eidLike: fieldsValue.eidLike, areaId: getAreaId(areaIds) });
    });
  };

  handleTableChange = pagination => {
    let { current } = pagination;
    current -= 1;
    const { queryPage } = this.state;
    if (current !== queryPage) {
      this.dispatchPageList(current);
    }
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatchPageList(0, {});
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { areaIds } = fields;
    const areaId = getAreaId(areaIds);
    const formParam = { ...fields };
    formParam.areaId = areaId;
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'addCar',
      payload: formParam,
      callback: () => {
        this.dispatchPageList(0);
        message.success('添加成功');
      },
    });
    this.handleModalVisible();
  };

  handleDrawerVisible = (flag, id) => {
    if (flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'car/reqCommon',
        service: 'getCarInfo',
        payload: { id },
      });
    }
    this.setState({
      drawerVisible: !!flag,
    });
  };

  handleEdit = fields => {
    const { areaIds } = fields;
    const areaId = getAreaId(areaIds);
    const formParam = { ...fields };
    formParam.areaId = areaId;
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'editCar',
      payload: formParam,
      callback: () => {
        this.dispatchPageList();
        message.success('修改成功');
        this.clearCarInfo();
      },
    });
    this.handleDrawerVisible();
  };

  moreBtnExc = (key, record) => {
    switch (key) {
      case 'equip':
        router.push(`/device/${record.eid}`);
        break;
      case 'mot':
        router.push(`/car/mot/${record.eid}`);
        break;
      case 'insur':
        break;
      default:
        break;
    }
  };

  clearCarInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/clearCarInfo',
      payload: {},
    });
  }

  dispatchPageList(page, queryParam) {
    const { dispatch } = this.props;
    const { pageQuery, queryPage } = this.state;
    const queryVal = queryParam || pageQuery;
    let curPg = 0;
    if (page >= 0) {
      curPg = page;
    } else {
      curPg = queryPage || 0;
    }
    const param = { query: queryVal, page: curPg, size: 15 };
    dispatch({
      type: 'car/reqCommon',
      service: 'queryCarList',
      payload: param,
    });
    this.setState({ pageQuery: queryVal, queryPage: curPg });
  }

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
              {getFieldDecorator('areaIds')(
                <Cascader placeholder="请选择" options={AREA_DATA.areaIds} allowClear />
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={20}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.search" defaultMessage="No translate" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="form.reset" defaultMessage="No translate" />
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
    const { carPageList, carInfo, loading } = this.props;
    const { modalVisible, drawerVisible, drawerWidth } = this.state;

    const propsTableList = {
      ...carPageList,
      loading,
      columns: this.columns,
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const editMethods = {
      handleEdit: this.handleEdit,
      handleDrawerVisible: this.handleDrawerVisible,
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <TableListBase {...propsTableList} onChange={this.handleTableChange} />
          </div>
        </Card>
        <CreateCarForm {...parentMethods} modalVisible={modalVisible} />
        <ModifyCarForm
          {...editMethods}
          drawerVisible={drawerVisible}
          drawerWidth={drawerWidth}
          loading={loading}
          formValue={carInfo}
        />
      </div>
    );
  }
}

export default BaseInfo;
