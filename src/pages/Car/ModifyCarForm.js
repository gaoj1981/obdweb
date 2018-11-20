import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Cascader,
  Form,
  Button,
  Input,
  Drawer,
  Select,
  Row,
  Col,
  InputNumber,
  Divider,
} from 'antd';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { AREA_DATA } from '@/common/AreaJson';
import BizConst from '@/common/BizConst';
import { getAreaArr } from '@/utils/BizUtil';
import ColorInputWidget from './ColorInputWidget';
import BuserSelWidget from './BuserSelWidget';

const FormItem = Form.Item;
const { Option } = Select;
const localVal = getLocale();
// 兼容Modal&&Drawer滚动条闪动
let isViewed = false;

@connect(({ user, car }) => ({
  currentUser: user.currentUser,
  bindUserDefault: car.bindUserDefault,
}))
@Form.create()
class ModifyCarForm extends PureComponent {
  state = {
    visible: true, // 兼容Modal&&Drawer滚动条闪动
    areaId: null,
  };

  componentWillReceiveProps(nextProps) {
    // 兼容Modal&&Drawer滚动条闪动
    if (!isViewed) {
      if (!nextProps.loading) {
        this.setState({ visible: false });
      }
    }
  }

  componentWillUnmount() {
    // 兼容Modal&&Drawer滚动条闪动
    isViewed = false;
  }

  handleSubmit = () => {
    const { form, handleEdit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  handleAreaChange = value => {
    const { length } = value;
    if (length > 0) {
      const { dispatch, formValue, form } = this.props;
      const areaId = value[length - 1];
      dispatch({
        type: 'car/reqCommon',
        service: 'getBindUserDefault',
        payload: { areaId, eid: formValue.eid },
        callback: () => {
          const { bindUserDefault } = this.props;
          let prinId = '';
          let maintId = '';
          bindUserDefault.forEach(item => {
            if (item.utype === 1) {
              prinId = item.id;
            } else if (item.utype === 2) {
              maintId = item.id;
            }
          });
          form.setFieldsValue({ prinId, maintId });
          this.setState({ areaId });
        },
      });
    }
  };

  render() {
    const { visible, areaId } = this.state;
    const {
      currentUser,
      drawerVisible,
      drawerWidth,
      form,
      formValue,
      handleDrawerVisible,
    } = this.props;

    // 兼容Modal&&Drawer滚动条闪动
    let realVisible = true;
    let realWidth = 0;
    if (!visible) {
      realVisible = drawerVisible;
      if (isViewed) {
        realWidth = drawerWidth || 400;
      }
      isViewed = true;
    }
    // 兼容End

    return (
      <Drawer
        title={`${formatMessage({
          id: 'form.edit',
          defaultMessage: 'No Translate',
        })}${formatMessage({
          id: 'biz.car',
          defaultMessage: 'No Translate',
        })}（${formValue.eid}）`}
        placement="right"
        width={realWidth}
        closable={false}
        destroyOnClose
        onClose={() => handleDrawerVisible()}
        visible={realVisible}
      >
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: -15,
            display: drawerVisible ? 'block' : 'none',
          }}
        >
          <Button
            icon="double-right"
            type="default"
            style={{ height: 50, width: 18, padding: 0, border: 0, color: '#40a9ff' }}
            onClick={() => handleDrawerVisible()}
          />
        </div>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                label={formatMessage({ id: 'biz.car.areaid', defaultMessage: 'No Translate' })}
              >
                {form.getFieldDecorator('areaIds', {
                  initialValue: getAreaArr(formValue.areaId),
                  rules: [
                    {
                      required: true,
                      message:
                        localVal === 'zh-CN'
                          ? formatMessage({ id: 'biz.common.require.sel' })
                          : null,
                    },
                  ],
                })(
                  <Cascader
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    options={AREA_DATA.areaIds}
                    onChange={value => this.handleAreaChange(value)}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={formatMessage({
                  id: 'biz.obd.device.number',
                  defaultMessage: 'No Translate',
                })}
              >
                {form.getFieldDecorator('deviceNumber', {
                  initialValue: formValue.deviceNumber,
                  rules: [
                    {
                      min: 10,
                      max: 20,
                      message:
                        localVal === 'zh-CN'
                          ? formatMessage(
                              { id: 'biz.common.length.range', defaultMessage: 'No Translate' },
                              { lenMin: 10, lenMax: 20 }
                            )
                          : null,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="发动机编号">
                {form.getFieldDecorator('engineNum', {
                  initialValue: formValue.engineNum,
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
                })(<Input placeholder="请输入发动机编号" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="车架号">
                {form.getFieldDecorator('frameNum', {
                  initialValue: formValue.frameNum,
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
                })(<Input placeholder="请输入车架号" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label={formatMessage({ id: 'biz.car.name', defaultMessage: 'No Translate' })}
              >
                {form.getFieldDecorator('carName', {
                  initialValue: formValue.carName,
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
                })(<Input placeholder="请输入车牌名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label={formatMessage({ id: 'biz.car.platenum', defaultMessage: 'No Translate' })}
              >
                {form.getFieldDecorator('plateNum', {
                  initialValue: formValue.plateNum,
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
                label={formatMessage({ id: 'biz.car.fueltype', defaultMessage: 'No Translate' })}
              >
                {form.getFieldDecorator('fuelType', {
                  initialValue: formValue.fuelType,
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
            <Col span={8}>
              <FormItem label="车型">
                {form.getFieldDecorator('carModel', {
                  initialValue: formValue.carModel,
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
            <Col span={6}>
              <FormItem label="尺寸">
                {form.getFieldDecorator('carSize', {
                  initialValue: formValue.carSize,
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
            <Col span={6}>
              <FormItem label="发动机排量">
                {form.getFieldDecorator('enginePower', {
                  initialValue: formValue.enginePower,
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
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="百公里油耗">
                {form.getFieldDecorator('baiOilUsed', {
                  initialValue: formValue.baiOilUsed,
                  rules: [],
                })(<InputNumber style={{ width: '100%' }} min={1} max={500} />)}
              </FormItem>
            </Col>
            {currentUser && currentUser.role !== 'user' ? (
              <Fragment>
                <Col span={24}>
                  <FormItem>
                    {form.getFieldDecorator('carColor', {
                      initialValue: formValue.carColor,
                      rules: [],
                    })(<ColorInputWidget />)}
                  </FormItem>
                </Col>
                <Col>
                  <Divider dashed>车辆相关人员</Divider>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="运营人">
                    {form.getFieldDecorator('prinId', {
                      initialValue: formValue.prinId,
                      rules: [],
                    })(<BuserSelWidget utype={1} areaId={areaId || formValue.areaId} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="维护人">
                    {form.getFieldDecorator('maintId', {
                      initialValue: formValue.maintId,
                      rules: [],
                    })(<BuserSelWidget utype={2} areaId={areaId || formValue.areaId} />)}
                  </FormItem>
                </Col>
              </Fragment>
            ) : null}

            <FormItem style={{ display: 'none' }}>
              {form.getFieldDecorator('id', {
                initialValue: formValue.id,
                rules: [],
              })(<Input type="hidden" />)}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              {form.getFieldDecorator('eid', {
                initialValue: formValue.eid,
                rules: [],
              })(<Input type="hidden" />)}
            </FormItem>
          </Row>
        </Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={() => handleDrawerVisible()}
          >
            <FormattedMessage id="form.cancel" defaultMessage="No translate" />
          </Button>
          <Button type="primary" onClick={() => this.handleSubmit()}>
            <FormattedMessage id="form.submit" defaultMessage="No translate" />
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default ModifyCarForm;
