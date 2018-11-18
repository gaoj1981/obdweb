import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import moment from 'moment';
import { Input, Row, Col, Divider, Form, Cascader, Tooltip, Radio, DatePicker, Select } from 'antd';
import BizConst from '@/common/BizConst';
import { deleteConfirm, getAreaName, getInsurByType } from '@/utils/BizUtil';
import { AREA_DATA } from '@/common/AreaJson';
import { normFile, getFormExtraMsg, getFilePrefix } from '@/utils/uploadUtils';
import OssMultiUpload from '@/widgets/OssMultiUpload';
import CarInputWidget from './CarInputWidget';

const localVal = getLocale();
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { RangePicker } = DatePicker;
// 图片最大上传数
const maxUpdNum = 3;

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
          })(<CarInputWidget disabled={!!eidParam} />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="保单编号">
          {getFieldDecorator('insurNum', {
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
      <Col span={14}>
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="投保公司">
          {getFieldDecorator('insurLtd', {
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
      <Col span={10}>
        <FormItem>
          {getFieldDecorator('insurType', {
            initialValue: 2,
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
          })(
            <RadioGroup>
              <Radio value={1}>交强险</Radio>
              <Radio value={2}>商业险</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="生效日期">
          {getFieldDecorator('effectDate', {
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
          })(<DatePicker />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="失效日期">
          {getFieldDecorator('expDate', {
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
    </Row>
  );
};

const editForm = (FormItem, form, formValue) => {
  if (!formValue) return null;
  const { getFieldDecorator } = form;

  const insurImgArr = [];
  const formImgArr = formValue.insurImgs ? formValue.insurImgs.split(',') : [];
  let fileTmpObj;
  if (formImgArr) {
    formImgArr.forEach(item => {
      fileTmpObj = {
        uid: `-${getFilePrefix(item)}`,
        name: item,
        url: `${BizConst.ossBaseUrl}${item}`,
        status: 'done',
      };
      insurImgArr.push(fileTmpObj);
    });
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="车辆编号">
          {getFieldDecorator('eid', {
            initialValue: formValue.eid,
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
          })(<Input disabled />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="保险类别">
          {getFieldDecorator('insurType', {
            initialValue: formValue.insurType,
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
          })(
            <RadioGroup>
              <Radio value={1}>交强险</Radio>
              <Radio value={2}>商业险</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="保单编号">
          {getFieldDecorator('insurNum', {
            initialValue: formValue.insurNum,
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
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="投保公司">
          {getFieldDecorator('insurLtd', {
            initialValue: formValue.insurLtd,
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
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="生效日期">
          {getFieldDecorator('effectDate', {
            initialValue: formValue.effectDate ? moment(formValue.effectDate, 'YYYY-MM-DD') : null,
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
          })(<DatePicker style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="失效日期">
          {getFieldDecorator('expDate', {
            initialValue: formValue.expDate ? moment(formValue.expDate, 'YYYY-MM-DD') : null,
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
          })(<DatePicker style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="客服电话">
          {getFieldDecorator('servTel', {
            initialValue: formValue.servTel,
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
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="业务员姓名">
          {getFieldDecorator('salesName', {
            initialValue: formValue.salesName,
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
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="业务员电话">
          {getFieldDecorator('salesTel', {
            initialValue: formValue.salesTel,
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
        <FormItem label="保险资料" extra={getFormExtraMsg(maxUpdNum)}>
          {getFieldDecorator('insurImgArr', {
            initialValue: insurImgArr,
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
            rules: [],
          })(<OssMultiUpload maxUpdNum={maxUpdNum} filedName="insurImgArr" curForm={form} />)}
        </FormItem>
      </Col>
      <Col span={24}>
        &nbsp;
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: formValue.id,
            rules: [],
          })(<Input type="hidden" />)}
        </FormItem>
      </Col>
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
      title: '保单类别',
      dataIndex: 'insurType',
      render: val => getInsurByType(val),
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
  const expDayChange = e => {
    form.resetFields();
    form.setFieldsValue({ expDayFlag: e.target.value });
  };
  return (
    // 注意Col总步长占总屏宽21:24
    <Row gutter={16}>
      <Col md={8} sm={24}>
        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('timeSel')(
                <Select
                  allowClear
                  placeholder="时间类型"
                  style={{ width: '100%', borderRadius: 0 }}
                >
                  <SelectOption key="3">生效日期</SelectOption>
                  <SelectOption key="4">失效日期</SelectOption>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <FormItem>
              {getFieldDecorator('times', { rules: [{ type: 'array' }] })(
                <RangePicker style={{ width: '100%', borderRadius: 0 }} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Col>
      <Col md={8} sm={24}>
        <FormItem label="车辆编号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('eidLike')(<Input placeholder="请输入车辆编号" />)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <Form.Item label="所在区域" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('areaIds')(
            <Cascader
              placeholder="请选择"
              style={{ width: '100%' }}
              options={AREA_DATA.areaIds}
              allowClear
            />
          )}
        </Form.Item>
      </Col>
      <Col md={8} sm={24}>
        <FormItem label="保单编号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('insurNumLike')(<Input placeholder="请输入保单编号" />)}
        </FormItem>
      </Col>
      <Col md={16} sm={24}>
        <Form.Item label="保险到期车辆" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          {getFieldDecorator('expDayFlag', { initialValue: 0 })(
            <RadioGroup onChange={expDayChange}>
              <Radio value={0}>忽略到期</Radio>
              <Radio value={1}>30天内到期</Radio>
              <Radio value={2}>60天内到期</Radio>
              <Radio value={3}>90天内到期</Radio>
              <Radio value={4}>已过期</Radio>
            </RadioGroup>
          )}
        </Form.Item>
      </Col>
    </Row>
  );
};

export { searchForm, addForm, editForm, getColumns, queryForm };
