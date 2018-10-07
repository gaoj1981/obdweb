import React from 'react';
import { Cascader, Form, Input, Modal, Select, Row, Col } from 'antd';
import { formatMessage, getLocale } from 'umi/locale';
import { AREA_DATA } from '@/common/AreaJson';
import BizConst from '@/common/BizConst';

const FormItem = Form.Item;
const { Option } = Select;
const localVal = getLocale();

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={formatMessage({
        id: 'form.biz.title.add',
        defaultMessage: 'No translate',
      })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label={formatMessage({ id: 'biz.car.eid', defaultMessage: 'No Translate' })}
      >
        {form.getFieldDecorator('eid', {
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
              min: 15,
              max: 20,
              message:
                localVal === 'zh-CN'
                  ? formatMessage(
                      { id: 'biz.common.length.range', defaultMessage: 'No Translate' },
                      { lenMin: 15, lenMax: 20 }
                    )
                  : null,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
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
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label={formatMessage({ id: 'biz.obd.device.number', defaultMessage: 'No Translate' })}
      >
        {form.getFieldDecorator('deviceNumber', {
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
      <Row gutter={6}>
        <Col span={8}>
          <FormItem
            label={formatMessage({ id: 'biz.car.platenum', defaultMessage: 'No Translate' })}
          >
            {form.getFieldDecorator('plateNum', {
              rules: [
                {
                  max: 10,
                  message:
                    localVal === 'zh-CN'
                      ? formatMessage(
                          { id: 'biz.common.length.max', defaultMessage: 'No Translate' },
                          { length: 10 }
                        )
                      : null,
                },
              ],
            })(<Input placeholder="请输入车牌号" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            label={formatMessage({ id: 'biz.car.carmodel', defaultMessage: 'No Translate' })}
          >
            {form.getFieldDecorator('carModel', {
              rules: [
                {
                  max: 10,
                  message: formatMessage(
                    { id: 'biz.common.length.max', defaultMessage: null },
                    { length: 10 }
                  ),
                },
              ],
            })(<Input placeholder="请输入车型" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            label={formatMessage({ id: 'biz.car.fueltype', defaultMessage: 'No Translate' })}
          >
            {form.getFieldDecorator('fuelType', {
              rules: [],
            })(
              <Select placeholder="请选择燃料类型" style={{ width: '100%' }}>
                {BizConst.fuelTypeArr.map(item => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

export default CreateForm;
