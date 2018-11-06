import React, { Fragment } from 'react';
import moment from 'moment';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { Input, Row, Col, Select, Radio, InputNumber, DatePicker } from 'antd';

import CarInputWidget from '../Car/CarInputWidget';
import { getEquipByType, renderForNull, disabledDateCurBefore } from '@/utils/BizUtil';

const localVal = getLocale();
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

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
  const eidParam = extraVals ? extraVals.eidParam : null;
  const formDisplay0 = extraVals ? extraVals.formDisplay0 : false;
  const formDisplay1 = extraVals ? extraVals.formDisplay1 : false;

  const onTypeChange = e => {
    const typeCurSel = e.target.value;
    const { handleFormDisplay } = extraVals;
    if (handleFormDisplay) handleFormDisplay(typeCurSel);
  };

  return (
    <Row gutter={6}>
      <Col span={14}>
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="车辆编号">
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
          })(<CarInputWidget disabled={!!eidParam} />)}
        </FormItem>
      </Col>
      <Col span={10}>
        <FormItem>
          {form.getFieldDecorator('type', {
            initialValue: '0',
            rules: [
              {
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.sel' }) : null,
              },
            ],
          })(
            <RadioGroup onChange={onTypeChange}>
              <Radio value="0">固定设备</Radio>
              <Radio value="1">辅助设备</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="设备名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
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
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="生产厂家">
          {getFieldDecorator('factory', {
            rules: [
              {
                required: true,
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
      {formDisplay0 ? (
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出厂日期">
            {form.getFieldDecorator('birthDate', {
              rules: [],
            })(<DatePicker placeholder="设备出厂日期" />)}
          </FormItem>
        </Col>
      ) : null}
      {formDisplay1 ? (
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="设备数量">
            {form.getFieldDecorator('countNum', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message:
                    localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.input' }) : null,
                },
              ],
            })(<InputNumber min={0} max={999999999} style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      ) : null}
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="设备型号">
          {getFieldDecorator('xhNum', {
            rules: [
              {
                max: 100,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 100 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="设备编号">
          {getFieldDecorator('bhNum', {
            rules: [
              {
                max: 100,
                message:
                  localVal === 'zh-CN'
                    ? formatMessage(
                        { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                        { length: 100 }
                      )
                    : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      {formDisplay0 ? (
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="软件版本">
            {getFieldDecorator('version', {
              rules: [
                {
                  max: 100,
                  message:
                    localVal === 'zh-CN'
                      ? formatMessage(
                          { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                          { length: 100 }
                        )
                      : null,
                },
              ],
            })(<Input />)}
          </FormItem>
        </Col>
      ) : null}
      <Col span={24}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="设备备注">
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
          })(<TextArea rows={1} />)}
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
      <Col span={12}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="车辆编号">
          {getFieldDecorator('eid', {
            initialValue: formValue.eid,
            rules: [
              {
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
          })(<Input disabled />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem>
          {form.getFieldDecorator('type', {
            initialValue: `${formValue.type}`,
            rules: [
              {
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.sel' }) : null,
              },
            ],
          })(
            <RadioGroup>
              <Radio value="0">固定设备</Radio>
              <Radio value="1">辅助设备</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem label="设备名称">
          {getFieldDecorator('name', {
            initialValue: formValue.name,
            rules: [
              {
                required: true,
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
      <Col span={12}>
        <FormItem label="生产厂家">
          {getFieldDecorator('factory', {
            initialValue: formValue.factory,
            rules: [
              {
                required: true,
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
      <Col span={12}>
        <FormItem label="设备型号">
          {getFieldDecorator('xhNum', {
            initialValue: formValue.xhNum,
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
      <Col span={12}>
        <FormItem label="设备编号">
          {getFieldDecorator('bhNum', {
            initialValue: formValue.bhNum,
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
      <Col span={8}>
        <FormItem label="出厂日期">
          {getFieldDecorator('birthDate', {
            initialValue: formValue.birthDate ? moment(formValue.birthDate, 'YYYY-MM-DD') : null,
            rules: [],
          })(
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={disabledDateCurBefore}
              format="YYYY年MM月DD日"
              placeholder="设备出厂日期"
            />
          )}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label="设备数量">
          {getFieldDecorator('countNum', {
            initialValue: formValue.countNum,
            rules: [],
          })(<InputNumber min={0} max={999999999} style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem label="排序号">
          {getFieldDecorator('orderNo', {
            initialValue: formValue.orderNo,
            rules: [],
          })(<InputNumber min={0} max={999999999} style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="设备版本">
          {getFieldDecorator('version', {
            initialValue: formValue.version,
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
        <FormItem label="备注说明">
          {getFieldDecorator('note', {
            initialValue: formValue.note,
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
          })(<TextArea rows={2} placeholder="该设备的备注说明" />)}
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
      render: val => renderForNull(val, '/'),
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
