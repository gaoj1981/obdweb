import React, { PureComponent } from 'react';
import { Form, Button, Drawer, Row, Col, Divider } from 'antd';
import { FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;

@Form.create()
class QueryBizForm extends PureComponent {
  handleSubmit = () => {
    const { form, handleQuery } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleQuery(fieldsValue);
    });
  };

  render() {
    const { queryVisible, queryHeight, form, handleQueryVisible, bizForm } = this.props;

    return (
      <Drawer
        title=""
        placement="top"
        height={queryHeight}
        closable={false}
        destroyOnClose
        onClose={() => handleQueryVisible()}
        visible={queryVisible}
        style={{ padding: 0, background: '#f9f9f9' }}
      >
        <Row gutter={16} style={{ height: queryHeight, padding: '8px 0' }}>
          <Col span={20}>{bizForm ? bizForm(FormItem, form) : null}</Col>
          <Col span={4}>
            <Divider
              type="vertical"
              style={{ position: 'absolute', top: 10, right: 140, height: queryHeight - 30 }}
            />
            <Button
              icon="search"
              onClick={() => this.handleSubmit()}
              style={{ position: 'absolute', top: 10, right: 20 }}
            >
              <FormattedMessage id="form.search.advanced" defaultMessage="高级查询" />
            </Button>
            <Button
              type="dashed"
              icon="rollback"
              onClick={() => this.handleSubmit()}
              style={{ position: 'absolute', top: queryHeight - 50, right: 20 }}
            >
              <FormattedMessage id="form.reset.clear" defaultMessage="清除重置" />
            </Button>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default QueryBizForm;
