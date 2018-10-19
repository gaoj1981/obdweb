import React, { PureComponent } from 'react';
import { Alert, Badge, Button, Form, Icon, Input, Modal, Radio, Steps, Switch } from 'antd';

import BizConst from '@/common/BizConst';
import { getAreaName, getAreaArr } from '@/utils/BizUtil';

const FormItem = Form.Item;
const { Step } = Steps;
const RadioGroup = Radio.Group;

@Form.create()
class BindUserStepDefault extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        uname: props.values.uname,
        isDefault: props.values.isDefault,
        areaId: props.values.areaId,
        utype: props.values.utype,
        id: props.values.id,
      },
      currentStep: 0,
      loading: false,
    };

    this.formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
  }

  handleNext = currentStep => {
    if (currentStep === 2) this.setState({ loading: true });
    const { form, handleStep } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        this.setState({ loading: false });
        return;
      }
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleStep(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    const areaArr = getAreaArr(formVals.areaId);
    if (currentStep === 1) {
      return [
        <FormItem
          key="isDefault"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 12 }}
          label="是否默认该区县负责人"
        >
          {form.getFieldDecorator('isDefault', {
            rules: [{ required: true }],
            valuePropName: 'checked',
            initialValue: formVals.isDefault === 1,
          })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
        </FormItem>,
        <Alert
          message="提醒：当选择【是】时，系统会自动取消该区县之前的默认车辆负责人。"
          type="warning"
          showIcon
        />,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="car" {...this.formLayout} label="生效车辆">
          {form.getFieldDecorator('isCoverAll', {
            rules: [{ required: true }],
            initialValue: '0',
          })(
            <RadioGroup>
              <Radio value="1">全部车辆</Radio>
              <Radio value="0">仅后续添加车辆</Radio>
            </RadioGroup>
          )}
        </FormItem>,
        <Alert
          message="提醒：选择全部车辆，会将该区县对应的所有车辆负责人更新为当前负责人。"
          type="warning"
          showIcon
        />,
        <FormItem key="id" style={{ display: 'none' }}>
          {form.getFieldDecorator('id', {
            initialValue: formVals.id,
            rules: [],
          })(<Input type="hidden" />)}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="uname" {...this.formLayout} label="当前人员">
        <Icon type="user" style={{ color: '#ffbf00' }} />
        {formVals.uname}
      </FormItem>,
      <FormItem key="area" {...this.formLayout} label="所属区县">
        <Icon type="environment" style={{ color: '#ffbf00' }} />
        {getAreaName(areaArr[0])}
        {getAreaName(areaArr[1])}
        {getAreaName(formVals.areaId)}
      </FormItem>,
      <FormItem key="utype" {...this.formLayout} label="所属部门">
        <Badge
          status={BizConst.statusMap[formVals.utype]}
          text={BizConst.utypeArr[formVals.utype]}
        />
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleStepModalVisible } = this.props;
    const { loading } = this.state;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleStepModalVisible()}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleStepModalVisible()}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => this.handleNext(currentStep)}
          loading={loading}
        >
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleStepModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleStepModalVisible } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="区县默认负责人设置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleStepModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="区县默认设置" />
          <Step title="设定生效车辆" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

export default BindUserStepDefault;
