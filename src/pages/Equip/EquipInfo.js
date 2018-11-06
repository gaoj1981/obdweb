import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva/index';
import { Form, Row, Col, Button, Card, message } from 'antd';
import { FormattedMessage } from 'umi/locale';

import BizConst from '@/common/BizConst';
import AddBizForm from '@/common/AddBizForm';
import EditBizForm from '@/common/EditBizForm';
import QueryBizForm from '@/common/QueryBizForm';
import TableWithSel from '@/common/TableWithSel';
import { searchForm, addForm, editForm, getColumns, queryForm } from './EquipInfoForms';

import styles from './EquipInfo.less';

// 页面常量
const FormItem = Form.Item;

// 底层组件
@connect(({ equip, loading }) => ({
  pageEquipInfo: equip.pageEquipInfo,
  equipInfo: equip.equipInfo,
  loading: loading.models.equip,
}))
@Form.create()
class EquipInfo extends PureComponent {
  state = {
    pageQuery: {},
    queryPage: 0,
    addVisible: false,
    editVisible: false,
    editWidth: 600,
    queryVisible: false,
    queryHeight: 99,
    selectedRows: [],
    eidParam: null,
    formDisplay0: true,
    formDisplay1: false,
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
      type: 'equip/reqCommon',
      service: 'addEquipInfo',
      payload: formParam,
      callback: () => {
        this.dispatchPageList();
        message.success('添加成功');
        this.handleAddVisible();
        this.setState({ formDisplay0: true, formDisplay1: false });
      },
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'equip/reqCommon',
      service: 'delEquipInfo',
      payload: { id },
      callback: () => {
        this.dispatchPageList();
        message.success('删除成功');
      },
    });
  };

  handleDeleteSel = () => {
    const { selectedRows } = this.state;
    if (selectedRows) {
      const idsArr = [];
      selectedRows.forEach(item => {
        idsArr.push(item.id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'equip/reqCommon',
        service: 'delEquipBatch',
        payload: { ids: idsArr.join(',') },
        callback: () => {
          this.dispatchPageList();
          message.success('删除成功');
          this.setState({ selectedRows: [] });
        },
      });
    }
  };

  handleEditVisible = (flag, id) => {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'equip/reqCommon',
        service: 'getEquipInfo',
        payload: { id },
      });
    } else {
      dispatch({
        type: 'equip/clearEquipInfo',
        payload: {},
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
      type: 'equip/reqCommon',
      service: 'editEquipInfo',
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
      this.dispatchPageList(0, fieldsValue);
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatchPageList(0, {});
  };

  handlePageChange = pagination => {
    let { current } = pagination;
    current -= 1;
    const { queryPage } = this.state;
    if (current !== queryPage) {
      this.dispatchPageList(current);
    }
    //
    this.setState({ selectedRows: [] });
  };

  handleQueryVisible = flag => {
    this.setState({
      queryVisible: !!flag,
    });
  };

  handleExcelImport = () => {
    router.push('/equip/upload');
  };

  handleQuery = fields => {
    const formParam = { ...fields };
    console.log('request', formParam);
    //
    const { id } = formParam;
    //
    this.dispatchPageList(0, { id });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleFormDisplay = type => {
    if (type === '0') {
      this.setState({ formDisplay0: true, formDisplay1: false });
    } else if (type === '1') {
      this.setState({ formDisplay1: true, formDisplay0: false });
    }
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
      type: 'equip/reqCommon',
      service: 'pageEquipInfo',
      payload: param,
      callback: response => {
        if (response.numberOfElements === 0 && response.totalElements > 0) {
          dispatch({
            type: 'equip/reqCommon',
            service: 'pageEquipInfo',
            payload: { query: pageQuery, page: 0, size: BizConst.pageSize },
          });
          this.setState({ queryPage: 0 });
        }
      },
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
              {!eidParam ? (
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  <FormattedMessage id="form.reset" defaultMessage="No translate" />
                </Button>
              ) : null}
              <Button
                style={{ marginLeft: 8 }}
                icon="file-excel"
                onClick={() => this.handleExcelImport()}
              >
                EXCEL导入
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
      selectedRows,
      eidParam,
      formDisplay0,
      formDisplay1,
    } = this.state;
    const { pageEquipInfo, equipInfo, loading } = this.props;

    const columnMethods = {
      handleEditVisible: this.handleEditVisible,
      handleDelete: this.handleDelete,
      moreBtnExc: this.moreBtnExc,
    };
    const propsTableList = {
      ...pageEquipInfo,
      loading,
      selectedRows,
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
            <TableWithSel
              {...propsTableList}
              onSelectRow={this.handleSelectRows}
              onChange={this.handlePageChange}
              onDelete={this.handleDeleteSel}
            />
          </div>
        </Card>
        <AddBizForm
          {...addMethods}
          addVisible={addVisible}
          extraVals={{
            eidParam,
            formDisplay0,
            formDisplay1,
            handleFormDisplay: this.handleFormDisplay,
          }}
        />
        <EditBizForm
          {...editMethods}
          editVisible={editVisible}
          editWidth={editWidth}
          loading={loading}
          formValue={equipInfo}
        />
        <QueryBizForm {...queryMethods} queryVisible={queryVisible} queryHeight={queryHeight} />
      </div>
    );
  }
}

export default EquipInfo;
