import React from 'react';
import { Form, Modal } from 'antd';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

const AddBizForm = Form.create()(props => {
  const { addVisible, form, handleAdd, handleAddVisible, bizForm, extraVals } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
      okText={formatMessage({
        id: 'form.submit',
        defaultMessage: 'No translate',
      })}
      cancelText={formatMessage({
        id: 'form.cancel',
        defaultMessage: 'No translate',
      })}
      visible={addVisible}
      onOk={okHandle}
      onCancel={() => handleAddVisible()}
    >
      {bizForm ? bizForm(FormItem, form, extraVals) : null}
    </Modal>
  );
});

export default AddBizForm;
