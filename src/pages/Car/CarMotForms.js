import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import moment from 'moment';
import { Input, Row, Col, Menu, Dropdown, Divider, DatePicker, Icon } from 'antd';
import { deleteConfirm } from '@/utils/BizUtil';

const localVal = getLocale();
const { MonthPicker } = DatePicker;

const searchForm = (FormItem, form, extraVals) => {
  const { getFieldDecorator } = form;
  const eidParam = extraVals ? extraVals.eidParam : null;
  return (
    // 注意Col总步长14
    <Fragment>
      <Col md={7} sm={24}>
        <FormItem label="车辆编号">
          {getFieldDecorator('eidLike', { initialValue: eidParam })(
            <Input placeholder="请输入车辆编号" disabled={!!eidParam} />
          )}
        </FormItem>
      </Col>
      <Col md={7} sm={24}>
        <FormItem label="ID">{getFieldDecorator('id')(<Input placeholder="请输入ID" />)}</FormItem>
      </Col>
    </Fragment>
  );
};

const addForm = (FormItem, form, extraVals) => {
  const { getFieldDecorator } = form;
  const eidParam = extraVals ? extraVals.eidParam : null;
  return (
    <Row gutter={16}>
      <Col span={24}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="车辆编号">
          {getFieldDecorator('eid', {
            initialValue: eidParam,
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
          })(<Input disabled={!!eidParam} />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="年检截止">
          {getFieldDecorator('expDate', {
            rules: [
              {
                type: 'object',
                required: true,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage({
                        id: 'biz.common.require.input',
                        defaultMessage: 'No Translate',
                      })
                    : null,
              },
            ],
          })(<MonthPicker format="YYYY年MM月" placeholder="年检有效截止期" />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="年检日期">
          {getFieldDecorator('motDate', {
            initialValue: moment(),
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
            ],
          })(<DatePicker />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="经办单位">
          {getFieldDecorator('dealLtd', {
            rules: [
              {
                max: 50,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 50 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem label="年检资料上传">
          {getFieldDecorator('motImgs', {
            rules: [],
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
              deleteConfirm('车辆年检', record.id, handleDelete);
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
