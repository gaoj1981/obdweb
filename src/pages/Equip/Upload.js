import React, { PureComponent } from 'react';
import { Steps } from 'antd';

import UploadOne from './UploadOne';
import UploadTwo from './UploadTwo';
import UploadThree from './UploadThree';

import styles from './Upload.less';

const { Step } = Steps;

class Upload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      stepVal: {},
    };
  }

  componentDidMount() {}

  next = stepVal => {
    let { current } = this.state;
    current += 1;
    this.setState({ current, stepVal });
  };

  prev = () => {
    let { current } = this.state;
    current -= 1;
    this.setState({ current });
  };

  render() {
    const { current, stepVal } = this.state;
    const steps = [
      {
        title: '下载与上传',
        content: <UploadOne next={this.next} />,
      },
      {
        title: '导入预览',
        content: <UploadTwo next={this.next} prev={this.prev} stepVal={stepVal} />,
      },
      {
        title: '导入数据',
        content: <UploadThree prev={this.prev} stepVal={stepVal} />,
      },
    ];

    return (
      <div className={styles.testCss}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
      </div>
    );
  }
}

export default Upload;
