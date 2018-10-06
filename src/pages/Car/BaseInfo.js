import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Row, Col, Form, Input, Cascader, Card, Modal, Button, Table, message } from 'antd';
import { AREA_DATA } from '../../common/AreaJson';
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
        defaultMessage: 'Not translated into English',
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
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class BaseInfo extends PureComponent {
  state = {
    modalVisible: false,
  };

  componentDidMount() {}

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
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
              {getFieldDecorator('eid')(<Input placeholder="请输入" />)}
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
    const { modalVisible } = this.state;

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
              columns={this.columns}
              dataSource={[]}
              loading={false}
              size="small"
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </div>
    );
  }
}

export default BaseInfo;
