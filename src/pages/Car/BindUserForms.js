import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import {
  Input,
  Row,
  Col,
  Cascader,
  Radio,
  Dropdown,
  Tooltip,
  Badge,
  Icon,
  Menu,
  Divider,
  Form,
  Checkbox,
  Select,
  DatePicker,
} from 'antd';

import BizConst from '@/common/BizConst';
import { deleteConfirm, getAreaName, getAreaArr, convUname, getAreaId } from '@/utils/BizUtil';
import { AREA_DATA } from '@/common/AreaJson';

const localVal = getLocale();
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const CheckboxGroup = Checkbox.Group;
const DateRange = DatePicker.RangePicker;

const searchForm = (FormItem, form) => {
  const { getFieldDecorator } = form;
  return (
    // 注意Col总步长14
    <Fragment>
      <Col md={6} sm={24}>
        <FormItem label="姓名/手机">
          {getFieldDecorator('orUnameTel')(<Input placeholder="姓名或手机" />)}
        </FormItem>
      </Col>
      <Col md={8} sm={24}>
        <Form.Item label="所在区域">
          {getFieldDecorator('areaIds')(
            <Cascader placeholder="请选择" options={AREA_DATA.areaIds} allowClear />
          )}
        </Form.Item>
      </Col>
    </Fragment>
  );
};

const addForm = (FormItem, form) => (
  <Row>
    <Col span={10}>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="姓名">
        {form.getFieldDecorator('uname', {
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
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系手机">
        {form.getFieldDecorator('tel', {
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
              pattern: /^1[0-9]{10}$/,
              message: localVal === 'zh-CN' ? '联系手机格式有误！' : null,
            },
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
      <FormItem
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        label={formatMessage({ id: 'biz.car.areaid', defaultMessage: 'No Translate' })}
      >
        {form.getFieldDecorator('areaIds', {
          rules: [
            {
              required: true,
              message:
                localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.sel' }) : null,
            },
          ],
        })(
          <Cascader
            style={{ width: '100%' }}
            placeholder="请选择"
            options={AREA_DATA.areaIds}
            allowClear
          />
        )}
      </FormItem>
    </Col>
    <Col span={12}>
      <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所属部门">
        {form.getFieldDecorator('utype', {
          initialValue: '1',
          rules: [
            {
              required: true,
              message:
                localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.sel' }) : null,
            },
          ],
        })(
          <RadioGroup>
            <Radio value="1">运营</Radio>
            <Radio value="2">维护</Radio>
          </RadioGroup>
        )}
      </FormItem>
    </Col>
    <Col span={12}>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="职位">
        {form.getFieldDecorator('job', {
          rules: [
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

const editForm = (FormItem, form, formValue) => {
  const handleAreaChange = value => {
    const { length } = value;
    if (length > 0) {
      const areaId = value[length - 1];
      if (areaId !== `${formValue.areaId}`) {
        form.setFieldsValue({ isDefault: false });
      } else {
        const utypeCurSel = form.getFieldValue('utype');
        if (utypeCurSel === `${formValue.utype}`) {
          form.setFieldsValue({ isDefault: formValue.isDefault === 1 });
        }
      }
    }
  };

  const handleUtypeChange = e => {
    const utypeCurSel = e.target.value;
    const { utype } = formValue;
    if (utypeCurSel !== `${utype}`) {
      form.setFieldsValue({ isDefault: false });
    } else {
      const areaCurSel = form.getFieldValue('areaIds');
      const areaIdCurSel = getAreaId(areaCurSel);
      if (areaIdCurSel === formValue.areaId) {
        form.setFieldsValue({ isDefault: formValue.isDefault === 1 });
      }
    }
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="姓名">
          {form.getFieldDecorator('uname', {
            initialValue: formValue.uname,
            rules: [
              {
                required: true,
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.input' }) : null,
              },
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
      <Col span={7}>
        <FormItem label="手机" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {form.getFieldDecorator('tel', {
            initialValue: formValue.tel,
            rules: [
              {
                required: true,
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.input' }) : null,
              },
              {
                pattern: /^1[0-9]{10}$/,
                message: localVal === 'zh-CN' ? '联系手机格式有误！' : null,
              },
            ],
          })(<Input />)}
        </FormItem>
      </Col>
      <Col span={9}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="部门">
          {form.getFieldDecorator('utype', {
            initialValue: `${formValue.utype}`,
            rules: [
              {
                required: true,
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.sel' }) : null,
              },
            ],
          })(
            <RadioGroup style={{ paddingTop: 6 }} onChange={handleUtypeChange}>
              <Radio value="1">运营</Radio>
              <Radio value="2">维护</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Col>
      <Col span={15}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          label={formatMessage({ id: 'biz.car.areaid', defaultMessage: 'No Translate' })}
        >
          {form.getFieldDecorator('areaIds', {
            initialValue: getAreaArr(formValue.areaId),
            rules: [
              {
                required: true,
                message:
                  localVal === 'zh-CN' ? formatMessage({ id: 'biz.common.require.sel' }) : null,
              },
            ],
          })(
            <Cascader
              style={{ width: '100%' }}
              placeholder="请选择"
              options={AREA_DATA.areaIds}
              onChange={value => handleAreaChange(value)}
            />
          )}
        </FormItem>
      </Col>
      <Col span={9}>
        <FormItem>
          {form.getFieldDecorator('isDefault', {
            valuePropName: 'checked',
            initialValue: formValue.isDefault === 1,
          })(<Checkbox disabled>是否默认该区县负责人</Checkbox>)}
        </FormItem>
      </Col>
      <Col span={15}>
        <FormItem label="职位" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          {form.getFieldDecorator('job', {
            initialValue: formValue.job,
            rules: [
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
      <Col span={9}>
        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="性别">
          {form.getFieldDecorator('sex', {
            initialValue: formValue.sex,
            rules: [],
          })(
            <RadioGroup style={{ paddingTop: 6 }}>
              <Radio value="M">男</Radio>
              <Radio value="F">女</Radio>
              <Radio value="N">保密</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Col>
      <Col>
        <Divider dashed>紧急联系信息</Divider>
      </Col>
      <Col span={12}>
        <FormItem label="紧急联系人" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {form.getFieldDecorator('urName', {
            initialValue: formValue.urName,
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
          })(<Input placeholder="请输入紧急联系人姓名" />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem label="紧急联系电话" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          {form.getFieldDecorator('urTel', {
            initialValue: formValue.urTel,
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
          })(<Input placeholder="请输入紧急联系人手机号码" />)}
        </FormItem>
      </Col>
      <FormItem style={{ display: 'none' }}>
        {form.getFieldDecorator('id', {
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
      title: '姓名',
      dataIndex: 'uname',
      render: (text, record) => convUname(text, record.sex),
    },
    {
      title: '联系手机',
      dataIndex: 'tel',
    },
    {
      title: '所属部门',
      dataIndex: 'utype',
      render: val => <Badge status={BizConst.statusMap[val]} text={BizConst.utypeArr[val]} />,
    },
    {
      title: <FormattedMessage id="biz.car.areaid" defaultMessage="No translate" />,
      dataIndex: 'areaId',
      render: text => {
        const areaArr = getAreaArr(text);
        return (
          <Tooltip placement="top" title={`${getAreaName(areaArr[0])}${getAreaName(areaArr[1])}`}>
            {getAreaName(text)}
          </Tooltip>
        );
      },
    },
    {
      title: '默认区县负责人',
      align: 'center',
      dataIndex: 'isDefault',
      render: val => BizConst.yesnoArr[val],
    },
    {
      title: <FormattedMessage id="form.action" defaultMessage="No translate" />,
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => handleEditVisible(true, record.id)}>
            <FormattedMessage id="form.edit" defaultMessage="No translate" />
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              deleteConfirm('相关人员', record.id, handleDelete);
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
  const defaultOptions = [{ label: '是', value: 1 }, { label: '否', value: 0 }];
  const sexOptions = [
    { label: '全部', value: 'All' },
    { label: '男', value: 'M' },
    { label: '女', value: 'F' },
    { label: '保密', value: 'N' },
  ];
  const normalizeAll = (value, prevValue = []) => {
    if (value) {
      const allPosi = value.indexOf('All');
      if (allPosi >= 0 && prevValue.indexOf('All') < 0) {
        return ['All', 'M', 'F', 'N'];
      }
      if (allPosi < 0 && prevValue.indexOf('All') >= 0) {
        return [];
      }
      if (value.length === 3 && allPosi < 0) {
        return ['All', 'M', 'F', 'N'];
      }
      if (value.length !== 4) {
        if (allPosi >= 0) {
          value.splice(allPosi, 1);
        }
      }
    }
    return value;
  };

  return (
    // 注意Col总步长占总屏宽20:24
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item label="所在区域" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('areaIds')(
            <Cascader
              style={{ width: '100%' }}
              placeholder="请选择"
              options={AREA_DATA.areaIds}
              allowClear
            />
          )}
        </Form.Item>
      </Col>
      <Col span={6}>
        <FormItem label="姓名/手机" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          {getFieldDecorator('orUnameTel')(<Input placeholder="姓名或手机" />)}
        </FormItem>
      </Col>
      <Col span={6}>
        <Form.Item label="所属部门" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {getFieldDecorator('utypeSel')(
            <Select mode="multiple" placeholder="可多选查询" showArrow style={{ width: '100%' }}>
              <SelectOption key="1">运营</SelectOption>
              <SelectOption key="2">维护</SelectOption>
            </Select>
          )}
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item label="默认负责" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          {getFieldDecorator('isDefaultSel', {})(<CheckboxGroup options={defaultOptions} />)}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Row>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('timeSel')(
                <Select
                  allowClear
                  placeholder="时间类型"
                  style={{ width: '100%', borderRadius: 0 }}
                >
                  <SelectOption key="1">添加时间</SelectOption>
                  <SelectOption key="2">最后修改时间</SelectOption>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={16}>
            <FormItem>
              {getFieldDecorator('times', { rules: [{ type: 'array' }] })(
                <DateRange style={{ width: '100%', borderRadius: 0 }} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Form.Item label="性别" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
          {getFieldDecorator('sexSel', { normalize: normalizeAll })(
            <CheckboxGroup options={sexOptions} />
          )}
        </Form.Item>
      </Col>
    </Row>
  );
};

export { searchForm, addForm, editForm, getColumns, queryForm };
