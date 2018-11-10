import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Button, Card, Col, Form, Row, message } from 'antd';

import BizConst from '@/common/BizConst';
import AddBizForm from '@/common/AddBizForm';
import EditBizForm from '@/common/EditBizForm';
import QueryBizForm from '@/common/QueryBizForm';
import { TableListBase } from '@/common/TableLists';
import { getAreaId } from '@/utils/BizUtil';
import { searchForm, addForm, editForm, getColumns, queryForm } from './BindUserForms';
import BindUserStepDefault from './BindUserStepDefault';
import CarInfoWidget from './CarInfoWidget';

import styles from './BindUser.less';

// 页面常量
const FormItem = Form.Item;

// 底层组件
@connect(({ car, loading }) => ({
  pageBindUser: car.pageBindUser,
  bindUser: car.bindUser,
  loading: loading.models.car,
}))
@Form.create()
class BindUser extends PureComponent {
  state = {
    addVisible: false,
    editVisible: false,
    editWidth: 666,
    pageQuery: {},
    queryPage: 0,
    queryVisible: false,
    queryHeight: 99,
    updateModalVisible: false,
    stepFormValues: {},
    carModalVisible: false,
    carModalValues: {},
  };

  componentDidMount() {
    this.dispatchPageList(0, {});
  }

  handleAddVisible = flag => {
    this.setState({
      addVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const formParam = { ...fields };
    //
    const { areaIds } = fields;
    const areaId = getAreaId(areaIds);
    formParam.areaId = areaId;
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'addBindUser',
      payload: formParam,
      callback: () => {
        this.dispatchPageList(0, {});
        message.success('添加成功');
        this.handleAddVisible();
      },
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'delBindUser',
      payload: { id },
      callback: () => {
        this.dispatchPageList();
        message.success('删除成功');
      },
    });
  };

  handleEditVisible = (flag, id) => {
    if (flag) {
      const { dispatch } = this.props;
      dispatch({
        type: 'car/reqCommon',
        service: 'getBindUser',
        payload: { id },
      });
    }
    this.setState({
      editVisible: !!flag,
    });
  };

  handleEdit = fields => {
    const formParam = { ...fields };
    //
    const { areaIds } = fields;
    const areaId = getAreaId(areaIds);
    formParam.areaId = areaId;
    if (formParam.isDefault) {
      formParam.isDefault = 1;
    } else {
      formParam.isDefault = 0;
    }
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'editBindUser',
      payload: formParam,
      callback: () => {
        this.dispatchPageList();
        message.success('修改成功');
        this.handleEditVisible();
      },
    });
  };

  handleQueryVisible = flag => {
    this.setState({
      queryVisible: !!flag,
    });
  };

  handleQuery = fields => {
    const formParam = { ...fields };
    // console.log(formParam.times[0].format('YYYY-MM-DD HH:mm:ss'));
    if (formParam.areaIds) {
      const areaId = getAreaId(formParam.areaIds);
      formParam.areaId = areaId;
    }
    if (formParam.timeSel && formParam.times && formParam.times.length === 2) {
      formParam.timeStart = formParam.times[0].format('YYYY-MM-DD');
      formParam.timeEnd = formParam.times[1].format('YYYY-MM-DD');
    } else {
      formParam.timeSel = null;
      formParam.timeStart = null;
      formParam.timeEnd = null;
    }
    if (formParam.isDefaultSel && formParam.isDefaultSel.length === 1) {
      [formParam.isDefault] = formParam.isDefaultSel;
    }
    const {
      areaId,
      orUnameTel,
      isDefault,
      sexSel,
      timeSel,
      timeStart,
      timeEnd,
      utypeSel,
    } = formParam;
    //
    this.dispatchPageList(0, {
      areaId,
      orUnameTel,
      isDefault,
      sexSel,
      timeSel,
      timeStart,
      timeEnd,
      utypeSel,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { orUnameTel, areaIds } = fieldsValue;
      this.dispatchPageList(0, { orUnameTel, areaId: getAreaId(areaIds) });
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatchPageList(0, {});
  };

  handlePageChange = pagination => {
    this.dispatchPageList(pagination.current - 1);
  };

  moreBtnExc = (key, record) => {
    if (key === 'setDefault') {
      this.handleStepModalVisible(true, record);
    } else if (key === 'forCar') {
      this.handleCarModalVisible(true, record);
    }
  };

  handleStepModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleStep = fields => {
    const formParam = { ...fields };
    //
    if (formParam.isDefault) {
      formParam.isDefault = 1;
    } else {
      formParam.isDefault = 0;
    }
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'editBindUserDefault',
      payload: {
        id: formParam.id,
        isDefault: formParam.isDefault,
        isCoverAll: formParam.isCoverAll,
      },
      callback: () => {
        this.dispatchPageList();
        message.success('设置成功');
        this.handleStepModalVisible();
      },
    });
  };

  handleCarModalVisible = (flag, record) => {
    this.setState({
      carModalVisible: !!flag,
      carModalValues: record || {},
    });
  };

  dispatchPageList(page, queryParam) {
    const { dispatch } = this.props;
    let { pageQuery, queryPage } = this.state;
    if (queryParam) {
      pageQuery = queryParam;
    }
    if (page || page === 0) {
      queryPage = page;
    }
    const param = { query: pageQuery, page: queryPage, size: BizConst.pageSize };
    dispatch({
      type: 'car/reqCommon',
      service: 'pageBindUser',
      payload: param,
    });
    this.setState({ pageQuery, queryPage });
  }

  renderSimpleForm() {
    const { form } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {searchForm(FormItem, form)}
          <Col md={6} sm={14}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.search" defaultMessage="No translate" />
              </Button>
              <Button style={{ margin: '0 8px' }} onClick={this.handleFormReset}>
                <FormattedMessage id="form.reset" defaultMessage="No translate" />
              </Button>
              <Button icon="search" onClick={() => this.handleQueryVisible(true)}>
                <FormattedMessage id="form.search.advanced" defaultMessage="No Trans" />
              </Button>
            </span>
          </Col>
          <Col md={4} sm={4} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              shape="circle"
              icon="plus"
              onClick={() => this.handleAddVisible(true)}
            />
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      addVisible,
      editVisible,
      editWidth,
      queryVisible,
      queryHeight,
      updateModalVisible,
      stepFormValues,
      carModalVisible,
      carModalValues,
    } = this.state;
    const { pageBindUser, bindUser, loading } = this.props;

    const columnMethods = {
      handleEditVisible: this.handleEditVisible,
      handleDelete: this.handleDelete,
      moreBtnExc: this.moreBtnExc,
    };
    const propsTableList = {
      ...pageBindUser,
      loading,
      columns: getColumns(columnMethods),
    };

    const addMethods = {
      handleAdd: this.handleAdd,
      handleAddVisible: this.handleAddVisible,
      bizForm: addForm,
    };

    const editMethods = {
      handleEdit: this.handleEdit,
      handleEditVisible: this.handleEditVisible,
      bizForm: editForm,
    };

    const queryMethods = {
      handleQuery: this.handleQuery,
      handleQueryVisible: this.handleQueryVisible,
      bizForm: queryForm,
    };

    const stepMethods = {
      handleStepModalVisible: this.handleStepModalVisible,
      handleStep: this.handleStep,
    };

    const CarInfoMethods = {
      handleCarModalVisible: this.handleCarModalVisible,
    };

    return (
      <div className={styles.testCss}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <TableListBase {...propsTableList} onChange={this.handlePageChange} />
          </div>
        </Card>
        <AddBizForm {...addMethods} addVisible={addVisible} />
        <EditBizForm
          {...editMethods}
          editVisible={editVisible}
          editWidth={editWidth}
          loading={loading}
          formValue={bindUser}
          layout="vertical"
        />
        <QueryBizForm {...queryMethods} queryVisible={queryVisible} queryHeight={queryHeight} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <BindUserStepDefault
            {...stepMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {carModalVisible ? <CarInfoWidget {...CarInfoMethods} values={carModalValues} /> : null}
      </div>
    );
  }
}

export default BindUser;
