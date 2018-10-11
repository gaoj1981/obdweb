import React, { PureComponent } from 'react';
import { Cascader, Form, Button, Input, Drawer, Select, Row, Col } from 'antd';
import { formatMessage, FormattedMessage, getLocale } from 'umi/locale';
import { AREA_DATA } from '@/common/AreaJson';
import BizConst from '@/common/BizConst';

const FormItem = Form.Item;
const { Option } = Select;
const localVal = getLocale();
// 兼容Modal&&Drawer滚动条闪动
let isViewed = false;

@Form.create()
class ModifyCarForm extends PureComponent {
  state = {
    visible: true, // 兼容Modal&&Drawer滚动条闪动
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

  render() {
    const { visible } = this.state;
    const { drawerVisible, drawerWidth, form, handleDrawerVisible } = this.props;

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
        title="Basic Drawer"
        placement="right"
        width={realWidth}
        closable={false}
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
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
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
            </Col>
            <Col span={12}>
              <FormItem
                label={formatMessage({ id: 'biz.car.areaid', defaultMessage: 'No Translate' })}
              >
                {form.getFieldDecorator('areaIds', {
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
                    allowClear
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
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
            <Col>
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
          <Button onClick={this.onClose} type="primary">
            <FormattedMessage id="form.submit" defaultMessage="No translate" />
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default ModifyCarForm;
