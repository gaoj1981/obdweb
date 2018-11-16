import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Input, Row, Col, Divider, Form, Cascader, Tooltip } from 'antd';
import { deleteConfirm, getAreaName } from '@/utils/BizUtil';
import { AREA_DATA } from '@/common/AreaJson';

const localVal = getLocale();

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
        <Form.Item label="所在区域">
          {getFieldDecorator('areaIds')(
            <Cascader placeholder="请选择" options={AREA_DATA.areaIds} allowClear />
          )}
        </Form.Item>
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
  const { handleEditVisible, handleDelete } = columnMethods;
  return [
    {
      title: '车辆编号',
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
      title: '保单号',
      dataIndex: 'insurNum',
    },
    {
      title: '生效日期',
      dataIndex: 'effectDate',
    },
    {
      title: '失效效期',
      dataIndex: 'expDate',
    },
    {
      title: <FormattedMessage id="form.action" defaultMessage="No translate" />,
      width: 98,
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
