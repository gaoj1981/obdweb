import React, { PureComponent } from 'react';
import { Form, Button, Drawer } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
// 兼容Modal&&Drawer滚动条闪动
let isViewed = false;

@Form.create()
class EditBizForm extends PureComponent {
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
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  render() {
    const { visible } = this.state;
    const { editVisible, editWidth, form, formValue, handleEditVisible, bizForm } = this.props;

    // 兼容Modal&&Drawer滚动条闪动
    let realVisible = true;
    let realWidth = 0;
    if (!visible) {
      realVisible = editVisible;
      if (isViewed) {
        realWidth = editWidth || 400;
      }
      isViewed = true;
    }
    // 兼容End

    return (
      <Drawer
        title={`${formatMessage({
          id: 'form.edit',
          defaultMessage: 'No Translate',
        })}`}
        placement="right"
        width={realWidth}
        closable={false}
        destroyOnClose
        onClose={() => handleEditVisible()}
        visible={realVisible}
      >
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: -15,
            display: editVisible ? 'block' : 'none',
          }}
        >
          <Button
            icon="double-right"
            type="default"
            style={{ height: 50, width: 18, padding: 0, border: 0, color: '#40a9ff' }}
            onClick={() => handleEditVisible()}
          />
        </div>
        <Form layout="vertical">{bizForm ? bizForm(FormItem, form, formValue) : null}</Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={() => handleEditVisible()}
          >
            <FormattedMessage id="form.cancel" defaultMessage="No translate" />
          </Button>
          <Button type="primary" onClick={() => this.handleSubmit()}>
            <FormattedMessage id="form.submit" defaultMessage="No translate" />
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default EditBizForm;
