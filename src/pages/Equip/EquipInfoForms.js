import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Input, Row, Col, Select } from 'antd';

import { getEquipByType } from '@/utils/BizUtil';

const localVal = getLocale();
const { Option } = Select;

const searchForm = (FormItem, form, extraVals) => {
  console.log(extraVals);
  const { getFieldDecorator } = form;
  const eidParam = extraVals ? extraVals.eidParam : null;
  return (
    // 注意Col总步长14
    <Fragment>
      <Col md={8} sm={24}>
        <FormItem label="车辆编号">
          {getFieldDecorator('eidLike', { initialValue: eidParam })(
            <Input placeholder="请输入车辆编号" disabled={!!eidParam} />
          )}
        </FormItem>
      </Col>
      <Col md={6} sm={24}>
        <FormItem label="设备类型">
          {getFieldDecorator('type')(
            <Select allowClear>
              <Option value="0">固定设备</Option>
              <Option value="1">辅助设备</Option>
            </Select>
          )}
        </FormItem>
      </Col>
    </Fragment>
  );
};

const addForm = (FormItem, form, extraVals) => {
  const { getFieldDecorator } = form;
  console.log(extraVals);
  return (
    <Row>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="ID">
          {getFieldDecorator('id', {
            rules: [
              {
                required: true,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage({
                        id: 'biz.common.require.input',
                        defaultMessage: 'No Translate',
                      })
                    : null,
              },
              {
                max: 20,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 20 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
    </Row>
  );
};

const editForm = (FormItem, form, formValue, extraVals) => {
  if (!formValue) return null;
  const { getFieldDecorator } = form;
  console.log(extraVals);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="ID">
          {getFieldDecorator('id', {
            initialValue: formValue.id,
            rules: [
              {
                required: true,
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.input' }) : null,
              },
              {
                max: 20,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 20 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      <FormItem style={{ display: 'none' }}>
        {getFieldDecorator('id', {
          initialValue: formValue.id,
          rules: [],
        })(<Input type="hidden" />)}
      </FormItem>
    </Row>
  );
};

const getColumns = columnMethods => {
  const { handleEditVisible } = columnMethods;
  return [
    {
      title: '所属车辆',
      dataIndex: 'eid',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '厂家',
      dataIndex: 'factory',
    },
    {
      title: '型号',
      dataIndex: 'xhNum',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      render: val => getEquipByType(val),
    },
    {
      title: <FormattedMessage id="form.action" defaultMessage="No translate" />,
      width: 88,
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => handleEditVisible(true, record.id)}>
            <FormattedMessage id="form.edit" defaultMessage="No translate" />
          </a>
        </Fragment>
      ),
    },
  ];
};

const queryForm = (FormItem, form) => {
  const { getFieldDecorator } = form;
  return (
    // 注意Col总步长占总屏宽21:24
    <Row gutter={16}>
      <Col span={24}>
        <FormItem label="ID" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('id', {})(<Input />)}
        </FormItem>
      </Col>
    </Row>
  );
};

export { searchForm, addForm, editForm, getColumns, queryForm };
