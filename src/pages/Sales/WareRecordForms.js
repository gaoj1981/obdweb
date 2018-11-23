import React, { Fragment } from 'react';
import moment from 'moment';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Input, Row, Col, Divider, Tooltip, Select, DatePicker } from 'antd';
import { deleteConfirm, getAreaName, getExcByType, getExcByRes, elliStr } from '@/utils/BizUtil';
import CarInputWidget from '../Car/CarInputWidget';

const localVal = getLocale();
const { Option } = Select;
const { TextArea } = Input;

const searchForm = (FormItem, form) => {
  const { getFieldDecorator } = form;
  return (
    // 注意Col总步长14
    <Fragment>
      <Col md={8} sm={24}>
        <FormItem label="编号">
          {getFieldDecorator('eidLike')(<Input placeholder="请输入车辆/设备编号" />)}
        </FormItem>
      </Col>
      <Col md={6} sm={24}>
        <FormItem label="维修类型">
          {getFieldDecorator('excType')(
            <Select style={{ width: '100%' }} allowClear>
              <Option value={1}>维修</Option>
              <Option value={2}>保养</Option>
              <Option value={3}>更换</Option>
            </Select>
          )}
        </FormItem>
      </Col>
    </Fragment>
  );
};

const addForm = (FormItem, form) => {
  const { getFieldDecorator } = form;
  return (
    <Row gutter={16}>
      <Col span={24}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="车辆编号">
          {getFieldDecorator('eid', {
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
          })(<CarInputWidget />)}
        </FormItem>
      </Col>
      <Col span={10}>
        <FormItem label="维修日期">
          {getFieldDecorator('excDateMoment', {
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
          })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </FormItem>
      </Col>
      <Col span={7}>
        <FormItem label="维修对象">
          {getFieldDecorator('excRes', {
            initialValue: 1,
            rules: [],
          })(
            <Select style={{ width: '100%' }}>
              <Option value={1}>设备</Option>
              <Option value={2}>车辆</Option>
            </Select>
          )}
        </FormItem>
      </Col>
      <Col span={7}>
        <FormItem label="维修类型">
          {getFieldDecorator('excType', {
            initialValue: 1,
            rules: [],
          })(
            <Select style={{ width: '100%' }}>
              <Option value={1}>维修</Option>
              <Option value={2}>保养</Option>
              <Option value={3}>更换</Option>
            </Select>
          )}
        </FormItem>
      </Col>
      <Col span={10}>
        <FormItem label="操作人姓名">
          {getFieldDecorator('excUser', {
            rules: [
              {
                max: 15,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 15 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      <Col span={14}>
        <FormItem label="操作人电话">
          {getFieldDecorator('excTel', {
            rules: [
              {
                max: 15,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 15 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem label="备注">
          {getFieldDecorator('note', {
            rules: [
              {
                max: 500,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 500 }
                      )
                    : null,
              },
            ],
          })(<TextArea rows={3} />)}
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
  const { handleEditVisible, handleDelete } = columnMethods;
  return [
    {
      title: '编号',
      dataIndex: 'eid',
    },
    {
      title: <FormattedMessage id="biz.car.areaid" defaultMessage="No translate" />,
      dataIndex: 'areaId',
      render: (text, record) => (
        <Tooltip
          placement="top"
          title={`${getAreaName(record.provId)}${getAreaName(record.cityId)}`}
        >
          {getAreaName(text)}
        </Tooltip>
      ),
    },
    {
      title: '维修对象',
      dataIndex: 'excRes',
      render: val => getExcByRes(val),
    },
    {
      title: '维修类型',
      dataIndex: 'excType',
      render: val => getExcByType(val),
    },
    {
      title: '操作人',
      dataIndex: 'excUser',
      render: val => elliStr(val, 5),
    },
    {
      title: '操作人电话',
      dataIndex: 'excTel',
    },
    {
      title: <FormattedMessage id="form.action" defaultMessage="No translate" />,
      width: 108,
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => handleEditVisible(true, record.id)}>
            <FormattedMessage id="form.edit" defaultMessage="No translate" />
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              deleteConfirm('维修记录', record.id, handleDelete);
            }}
          >
            <FormattedMessage id="form.delete" defaultMessage="No translate" />
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
