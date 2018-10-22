import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, Row, Col, Button, Card, message } from 'antd';
import { FormattedMessage } from 'umi/locale';

import BizConst from '@/common/BizConst';
import AddBizForm from '@/common/AddBizForm';
import EditBizForm from '@/common/EditBizForm';
import QueryBizForm from '@/common/QueryBizForm';
import { TableListBase } from '@/common/TableLists';
import { searchForm, addForm, editForm, getColumns, queryForm } from './CarMotForms';

import styles from './CarMot.less';

// 页面常量
const FormItem = Form.Item;

// 底层组件
@connect(({ car, loading }) => ({
  pageCarMot: car.pageCarMot,
  carMot: car.carMot,
  loading: loading.models.car,
}))
@Form.create()
class CarMot extends PureComponent {
  state = {
    pageQuery: {},
    queryPage: 0,
    addVisible: false,
    editVisible: false,
    editWidth: 666,
    queryVisible: false,
    queryHeight: 99,
    eidParam: null,
  };

  componentDidMount() {
    const {
      match: {
        params: { eidParam },
      },
    } = this.props;
    this.dispatchPageList(0, { eidLike: eidParam });
    this.setState({ eidParam });
  }

  handleAddVisible = flag => {
    this.setState({
      addVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const formParam = { ...fields };
    //
    console.log('add', formParam);
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'addCarMot',
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
      service: 'delCarMot',
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
        service: 'getCarMot',
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
    console.log('edit', formParam);
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'editCarMot',
      payload: formParam,
      callback: () => {
        this.dispatchPageList();
        message.success('修改成功');
        this.handleEditVisible();
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { id } = fieldsValue;
      this.dispatchPageList(0, { id });
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

  handleQueryVisible = flag => {
    this.setState({
      queryVisible: !!flag,
    });
  };

  handleQuery = fields => {
    const formParam = { ...fields };
    console.log('request', formParam);
    //
    const { id } = formParam;
    //
    this.dispatchPageList(0, { id });
  };

  moreBtnExc = (key, record) => {
    console.log(key, record);
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
      service: 'pageCarMot',
      payload: param,
    });
    this.setState({ pageQuery, queryPage });
  }

  renderSimpleForm() {
    const {
      form,
      match: {
        params: { eidParam },
      },
    } = this.props;
    const extraVals = { eidParam };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {searchForm(FormItem, form, extraVals)}
          <Col md={6} sm={14}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.search" defaultMessage="No translate" />
              </Button>
              <Button style={{ margin: '0 8px' }} onClick={this.handleFormReset}>
                <FormattedMessage id="form.reset" defaultMessage="No translate" />
              </Button>
              {!eidParam ? (
                <Button icon="search" onClick={() => this.handleQueryVisible(true)}>
                  <FormattedMessage id="form.search.advanced" defaultMessage="No Trans" />
                </Button>
              ) : null}
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
    const { addVisible, editVisible, editWidth, queryVisible, queryHeight, eidParam } = this.state;
    const { pageCarMot, carMot, loading } = this.props;

    const columnMethods = {
      handleEditVisible: this.handleEditVisible,
      handleDelete: this.handleDelete,
      moreBtnExc: this.moreBtnExc,
    };
    const propsTableList = {
      ...pageCarMot,
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

    return (
      <div className={styles.testCss}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <TableListBase {...propsTableList} onChange={this.handlePageChange} />
          </div>
        </Card>
        <AddBizForm {...addMethods} addVisible={addVisible} extraVals={{ eidParam }} />
        <EditBizForm
          {...editMethods}
          editVisible={editVisible}
          editWidth={editWidth}
          loading={loading}
          formValue={carMot}
        />
        <QueryBizForm {...queryMethods} queryVisible={queryVisible} queryHeight={queryHeight} />
      </div>
    );
  }
}

export default CarMot;
