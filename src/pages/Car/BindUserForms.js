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
} from 'antd';
import Ellipsis from '@/components/Ellipsis';

import BizConst from '@/common/BizConst';
import { deleteConfirm, getAreaName, getAreaArr } from '@/utils/BizUtil';
import { AREA_DATA } from '@/common/AreaJson';

const localVal = getLocale();
const RadioGroup = Radio.Group;

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

const editForm = (FormItem, form, formValue) => (
  <Fragment>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="areaId">
      {form.getFieldDecorator('areaId', {
        initialValue: formValue.areaId,
        rules: [{ required: true }],
      })(<Input />)}
    </FormItem>
  </Fragment>
);

const getColumns = columnMethods => {
  const { handleEditVisible, handleDelete, moreBtnExc } = columnMethods;
  return [
    {
      title: '姓名',
      dataIndex: 'uname',
      render: val => (
        <Ellipsis length={6} tooltip>
          {val}
        </Ellipsis>
      ),
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
              <Menu onClick={({ key }) => moreBtnExc(key)}>
                <Menu.Item key="more">更多操作</Menu.Item>
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

export { addForm, editForm, getColumns };
