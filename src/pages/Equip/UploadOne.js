import React, { PureComponent } from 'react';
import { Form, Button, Upload, Icon, Cascader, Input } from 'antd';
import { AREA_DATA } from '@/common/AreaJson';
import { getAreaId } from '@/utils/BizUtil';

import styles from './Upload.less';

const FormItem = Form.Item;
const { Dragger } = Upload;

@Form.create()
class UploadOne extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadTip: {},
    };
  }

  componentDidMount() {}

  beforeUpload = file => {
    const { form } = this.props;
    const excelPath = form.getFieldValue('excelPath');
    if (excelPath) {
      this.setState({
        uploadTip: {
          help: '',
          helpHint: '已存在Excel文件，如要重新上传，请先删除已上传文件！',
          validateStatus: 'error',
        },
      });
      return false;
    }
    const filename = file.name;
    const suffix = filename.substring(filename.lastIndexOf('.') + 1);
    if (suffix) {
      return true;
    }
    this.setState({
      uploadTip: {
        help: '',
        helpHint: '文件格式不正确,请选择Excel文件',
        validateStatus: 'error',
      },
    });
    return false;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, next } = this.props;
    form.validateFields((err, values) => {
      const { excelPath, originalName } = values;
      if (err) {
        return;
      }
      if (!excelPath) {
        this.setState({
          uploadTip: {
            help: '',
            helpHint: '请选择上传文件',
            validateStatus: 'error',
          },
        });
        return;
      }
      //
      const { areaIds } = values;
      const areaId = getAreaId(areaIds);
      if (next) next({ areaId, excelPath, originalName });
    });
  };

  // 下载导入模版
  downloadTemplete = () => {
    window.open('/equip_template.xls');
  };

  onChange = info => {
    if (info.fileList.length > 1) {
      info.fileList.pop();
    }
    const { status } = info.file;
    if (status === 'done') {
      const uploadRes = info.file.response;
      if (uploadRes.isSuc) {
        const { form } = this.props;
        form.setFieldsValue({
          excelPath: `${uploadRes.fdir}${uploadRes.fname}`,
          originalName: uploadRes.oname,
        });
        this.setState({
          uploadTip: {
            help: '',
            helpHint: '',
            validateStatus: 'success',
          },
        });
      } else {
        this.setState({
          uploadTip: {
            help: '',
            helpHint: uploadRes.errMsg,
            validateStatus: 'error',
          },
        });
        info.fileList.pop();
      }
    } else if (status === 'error') {
      this.setState({
        uploadTip: {
          help: '',
          helpHint: `${info.file.name} 上传失败`,
          validateStatus: 'error',
        },
      });
      info.fileList.pop();
    }
  };

  onRemove = () => {
    this.setState({
      uploadTip: {
        help: '',
        helpHint: '',
        validateStatus: 'error',
      },
    });
    const { form } = this.props;
    form.setFieldsValue({ excelPath: null });
  };

  render() {
    const { uploadTip } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const props = {
      name: 'file',
      multiple: false,
      beforeUpload: this.beforeUpload,
      action: '/api/device/upload',
      onChange: this.onChange,
      onRemove: this.onRemove,
    };
    return (
      <div className={styles.stepCss}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem style={{ fontSize: 16, fontWeight: 'bold', marginTop: 40 }}>
            <div>1、下载Excel模板，填入对应设备信息。</div>
            <div>
              <Button type="primary" onClick={this.downloadTemplete}>
                下载模板
              </Button>
            </div>
            <div style={{ fontSize: 12, fontWeight: 'normal' }}>
              模板中包含两个sheet，红色标记为必填项。
            </div>
          </FormItem>
          <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 40 }}>
            2、选择导入设备的所属区县。
          </div>
          <FormItem
            labelCol={{ span: 3, offset: 7 }}
            wrapperCol={{ span: 8 }}
            label="选择所属区县"
            style={{ textAlign: 'left' }}
          >
            {getFieldDecorator('areaIds', {
              rules: [{ required: true, message: '请选择设备所属区县' }],
              validateFirst: true,
            })(<Cascader placeholder="请选择设备所属区县" options={AREA_DATA.areaIds} />)}
          </FormItem>
          <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 40 }}>
            3、选择填好设备信息的Excel文件。
          </div>
          <FormItem {...uploadTip}>
            <div style={{ height: 180, marginLeft: '20%', marginRight: '20%', marginTop: 8 }}>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到这里进行上传</p>
                <p className="ant-upload-hint" style={{ color: 'red' }}>
                  {uploadTip.helpHint}
                </p>
              </Dragger>
            </div>
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {form.getFieldDecorator('originalName', {
              rules: [],
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem style={{ display: 'none' }}>
            {form.getFieldDecorator('excelPath', {
              rules: [],
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{ width: 200, marginTop: 30 }}>
              下一步
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default UploadOne;
