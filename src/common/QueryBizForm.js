import React, { PureComponent } from 'react';
import { Form, Button, Drawer, Row, Col, Divider } from 'antd';
import { FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
// 兼容Modal&&Drawer滚动条闪动
let isViewed = false;

@Form.create()
class QueryBizForm extends PureComponent {
  state = {
    visible: true, // 兼容Modal&&Drawer滚动条闪动
  };

  componentWillReceiveProps(nextProps) {
    // 兼容Modal&&Drawer滚动条闪动
    if (!isViewed) {
      if (!nextProps.loading) {
        this.setState({ visible: false });
      }
    }
  }

  componentWillUnmount() {
    // 兼容Modal&&Drawer滚动条闪动
    isViewed = false;
  }

  handleSubmit = () => {
    const { form, handleQuery } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleQuery(fieldsValue);
    });
  };

  render() {
    const { visible } = this.state;
    const { queryVisible, queryHeight, form, handleQueryVisible, bizForm } = this.props;

    // 兼容Modal&&Drawer滚动条闪动
    let realVisible = true;
    let realHeight = 0;
    if (!visible) {
      realVisible = queryVisible;
      if (isViewed) {
        realHeight = queryHeight || 400;
      }
      isViewed = true;
    }
    // 兼容End

    return (
      <Drawer
        title=""
        placement="top"
        height={realHeight}
        closable={false}
        destroyOnClose
        onClose={() => handleQueryVisible()}
        visible={realVisible}
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
              <FormattedMessage id="form.search.advanced" defaultMessage="NoTrans" />
            </Button>
            <Button
              type="dashed"
              icon="rollback"
              onClick={() => this.handleSubmit()}
              style={{ position: 'absolute', top: queryHeight - 50, right: 20 }}
            >
              <FormattedMessage id="form.reset.clear" defaultMessage="NoTrans" />
            </Button>
          </Col>
        </Row>
      </Drawer>
    );
  }
}

export default QueryBizForm;
