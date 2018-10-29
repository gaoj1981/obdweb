import React, { PureComponent } from 'react';
import { Form, Button, Upload, Icon, Cascader } from 'antd';
import { AREA_DATA } from '@/common/AreaJson';

import styles from './Upload.less';

const FormItem = Form.Item;
const { Dragger } = Upload;

@Form.create()
class UploadOne extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      excelFile: null,
      uploadTip: {},
    };
  }

  componentDidMount() {}

  beforeUpload = file => {
    const filename = file.name;
    const suffix = filename.substring(filename.lastIndexOf('.') + 1);
    if (suffix && (suffix.toLowerCase() === 'xls' || suffix.toLowerCase() === 'xlsx')) {
      this.setState({
        excelFile: file,
        uploadTip: {
          help: filename,
          validateStatus: 'success',
        },
      });
    } else {
      //            message.error('文件格式不正确, 请上传Excel文件');
      this.setState({
        uploadTip: {
          help: '文件格式不正确,请选择Excel文件',
          validateStatus: 'error',
        },
      });
    }
    return false;
  };

  handleSubmit = e => {
    e.preventDefault();
    const { excelFile } = this.state;
    const { form, next } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        if (!excelFile) {
          this.setState({
            uploadTip: {
              help: '请选择上传文件',
              validateStatus: 'error',
            },
          });
        }
        return;
      }
      console.log(values);
      if (next) next();
    });
  };

  // 下载导入模版
  downloadTemplete = () => {
    window.open('/static/名单导入模板.xls');
  };

  onChange = info => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      this.setState({
        uploadTip: {
          help: `${info.file.name} file uploaded successfully.`,
          validateStatus: 'success',
        },
      });
    } else if (status === 'error') {
      this.setState({
        uploadTip: {
          help: `${info.file.name} file upload failed.`,
          validateStatus: 'error',
        },
      });
    }
  };

  render() {
    const { uploadTip } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const props = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      beforeUpload: this.beforeUpload,
      action: '/api/upload',
      onChange: this.onChange,
    };
    return (
      <div className={styles.stepCss}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem style={{ fontSize: 16, fontWeight: 'bold', marginTop: 28 }}>
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
          <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 28 }}>
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
          <div style={{ fontSize: 16, fontWeight: 'bold', marginTop: 28 }}>
            3、选择填好设备信息的Excel文件。
          </div>
          <FormItem {...uploadTip}>
            <div style={{ height: 180, marginLeft: '20%', marginRight: '20%', marginTop: 8 }}>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到这里进行上传</p>
              </Dragger>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{ width: 200 }}>
              下一步
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default UploadOne;
