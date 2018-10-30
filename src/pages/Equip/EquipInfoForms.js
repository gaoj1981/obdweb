import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Input, Row, Col, Menu, Dropdown, Divider, Icon } from 'antd';
import { deleteConfirm } from '@/utils/BizUtil';

const localVal = getLocale();

const searchForm = (FormItem, form, extraVals) => {
  console.log(extraVals);
  const { getFieldDecorator } = form;
  return (
    // 注意Col总步长14
    <Fragment>
      <Col md={14} sm={24}>
        <FormItem label="ID">{getFieldDecorator('id')(<Input placeholder="请输入ID" />)}</FormItem>
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
  const { handleEditVisible, handleDelete, moreBtnExc } = columnMethods;
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: <FormattedMessage id="form.action" defaultMessage="No translate" />,
      width: 188,
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => handleEditVisible(true, record.id)}>
            <FormattedMessage id="form.edit" defaultMessage="No translate" />
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              deleteConfirm('设备详情', record.id, handleDelete);
            }}
          >
            <FormattedMessage id="form.delete" defaultMessage="No translate" />
          </a>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => moreBtnExc(key, record)}>
                <Menu.Item key="setDefault">默认设置</Menu.Item>
              </Menu>
            }
          >
            <a>
              <FormattedMessage id="form.more" defaultMessage="No translate" /> <Icon type="down" />
            </a>
          </Dropdown>
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
