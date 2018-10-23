import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Upload, Modal, Icon } from 'antd';
import { randomString, getFileSuffix, Compare } from '@/utils/utils';

import styles from './OssMultiUpload.less';

@connect(({ main }) => ({
  main,
}))
class OssMultiUpload extends PureComponent {
  constructor(props) {
    super(props);

    const fileList = props.fileList || [];
    this.state = {
      fileList,
      previewVisible: false,
      previewImage: '',
      action: '',
      data: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { fileList } = this.state;
    if ('fileList' in nextProps) {
      const { fileList: fileListProps } = nextProps;
      if (!Compare({ fileList }, { fileList: fileListProps })) {
        this.setState({ fileList: fileListProps });
      }
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    const fileListState = [];
    /* eslint-disable */
    for (const file of fileList) {
      if (file.status !== 'removed') {
        fileListState.push(file);
      }
    }
    this.setState({ fileList: fileListState });
    const { onChange } = this.props;
    if (onChange) {
      onChange(fileListState);
    }
  };

  beforeUpload = (file, fileList) => {
    const { dispatch, maxUpdNum, checkImgMax, filedName } = this.props;
    const { fileList: fileListState } = this.state;
    if (maxUpdNum > 0 && fileListState.length + fileList.length > maxUpdNum) {
      file.status = 'removed';
      if (checkImgMax) checkImgMax(fileListState.length, filedName, true);
      return false;
    } else {
      if (checkImgMax) checkImgMax(fileListState.length, filedName, false);
      return dispatch({
        type: 'main/fetchOssPolicy',
        payload: {
          t: randomString(6),
        },
        callback: () => {
          const suffix = getFileSuffix(file.name);
          const { main } = this.props;
          const { ossPolicyInfo } = main;
          const { accessid, policy, signature, dir, host, fn } = ossPolicyInfo;
          /* eslint-disable */
          file.newName = fn + suffix;
          this.setState({
            action: host,
            data: {
              OSSAccessKeyId: accessid,
              policy,
              signature,
              key: `${dir}/${fn}${suffix}`,
            },
          });
        },
      });
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, action, data } = this.state;
    let { maxUpdNum } = this.props;
    if (!maxUpdNum) maxUpdNum = 3;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          className={styles.component}
          action={action}
          data={data}
          listType="picture-card"
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          multiple
        >
          {fileList.length < maxUpdNum || maxUpdNum === 0 ? uploadButton : null}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default OssMultiUpload;
