import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
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
  message,
} from 'antd';
import { AREA_DATA } from '@/common/AreaJson';
import { getAreaId } from '@/utils/BizUtil';
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
  loading: loading.models.rule,
}))
@Form.create()
class BaseInfo extends PureComponent {
  state = {
    modalVisible: false,
  };

  columns = [
    {
      title: 'eid',
      dataIndex: 'eid',
    },
    {
      title: '描述',
      dataIndex: 'deviceNumber',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {}

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
    const { form } = this.props;
    form.resetFields();
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
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
              dataSource={content}
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
