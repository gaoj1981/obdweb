import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, Row, Col, Button, Card, message } from 'antd';
import { FormattedMessage } from 'umi/locale';

import BizConst from '@/common/BizConst';
import AddBizForm from '@/common/AddBizForm';
import EditBizForm from '@/common/EditBizForm';
import QueryBizForm from '@/common/QueryBizForm';
import { TableListBase } from '@/common/TableLists';
import { searchForm, addForm, editForm, getColumns, queryForm } from './CarInsurForms';
import { getAreaId } from '@/utils/BizUtil';

import styles from './CarInsur.less';

// 页面常量
const FormItem = Form.Item;

// 底层组件
@connect(({ car, loading }) => ({
  pageCarInsur: car.pageCarInsur,
  carInsurInfo: car.carInsurInfo,
  loading: loading.models.car,
}))
@Form.create()
class CarInsur extends PureComponent {
  state = {
    pageQuery: {},
    queryPage: 0,
    addVisible: false,
    editVisible: false,
    editWidth: 400,
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
    const formParam = { ...fields };
    //
    console.log('add', formParam);
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'addCarInsur',
      payload: formParam,
      callback: () => {
        this.dispatchPageList(0);
        message.success('添加成功');
        this.handleAddVisible();
      },
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'delCarInsur',
      payload: { id },
      callback: () => {
        this.dispatchPageList();
        message.success('删除成功');
      },
    });
  };

  handleEditVisible = (flag, id) => {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'car/reqCommon',
        service: 'getCarInsurInfo',
        payload: { id },
      });
    } else {
      dispatch({
        type: 'car/clearCarInsurInfo',
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
    const impNameArr = [];
    const { insurImgArr } = formParam;
    if (insurImgArr) {
      insurImgArr.forEach(item => {
        impNameArr.push(item.newName || item.name);
      });
    }
    formParam.insurImgs = impNameArr.join(',');
    //
    const { dispatch } = this.props;
    dispatch({
      type: 'car/reqCommon',
      service: 'editCarInsur',
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
      const { id, eidLike, areaIds } = fieldsValue;
      this.dispatchPageList(0, { id, eidLike, areaId: getAreaId(areaIds) });
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
      service: 'pageCarInsur',
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
    const { addVisible, editVisible, editWidth, queryVisible, queryHeight } = this.state;
    const { pageCarInsur, carInsurInfo, loading } = this.props;

    const columnMethods = {
      handleEditVisible: this.handleEditVisible,
      handleDelete: this.handleDelete,
      moreBtnExc: this.moreBtnExc,
    };
    const propsTableList = {
      ...pageCarInsur,
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
        <AddBizForm {...addMethods} addVisible={addVisible} />
        <EditBizForm
          {...editMethods}
          editVisible={editVisible}
          editWidth={editWidth}
          loading={loading}
          formValue={carInsurInfo}
        />
        <QueryBizForm {...queryMethods} queryVisible={queryVisible} queryHeight={queryHeight} />
      </div>
    );
  }
}

export default CarInsur;
