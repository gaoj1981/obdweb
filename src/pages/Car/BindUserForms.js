import React, { Fragment } from 'react';
import { Input } from 'antd';

const addForm = (FormItem, form) => {
  console.log('构造添加项Form');
  return (
    <Fragment>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="areaId">
        {form.getFieldDecorator('areaId', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
    </Fragment>
  );
};

const editForm = (FormItem, form, formValue) => {
  console.log('构造编辑项Form');
  return (
    <Fragment>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="areaId">
        {form.getFieldDecorator('areaId', {
          initialValue: formValue.areaId,
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
    </Fragment>
  );
};

export { addForm, editForm };
