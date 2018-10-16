import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';

import BizConst from '@/common/BizConst';
import AddBizForm from '@/common/AddBizForm';
import EditBizForm from '@/common/EditBizForm';
import QueryBizForm from '@/common/QueryBizForm';
import { TableListBase } from '@/common/TableLists';
import { getAreaId } from '@/utils/BizUtil';
import { addForm, editForm, getColumns } from './BindUserForms';

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
    console.log(fields);
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
    console.log('query', formParam);
    //
    this.dispatchPageList();
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.dispatchPageList(0, { id: fieldsValue.id });
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

  moreBtnExc = key => {
    console.log(key);
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
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={14} sm={24}>
            <FormItem label="id">
              {getFieldDecorator('id')(
                <Input placeholder={formatMessage({ id: 'form.weight.placeholder' })} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={14}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.search" defaultMessage="No translate" />
              </Button>
              <Button style={{ margin: '0 8px' }} onClick={this.handleFormReset}>
                <FormattedMessage id="form.reset" defaultMessage="No translate" />
              </Button>
              <Button icon="search" onClick={() => this.handleQueryVisible(true)}>
                高级查询
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
    const { addVisible, editVisible, editWidth, queryVisible, queryHeight } = this.state;
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
        />
        <QueryBizForm {...queryMethods} queryVisible={queryVisible} queryHeight={queryHeight} />
      </div>
    );
  }
}

export default BindUser;
