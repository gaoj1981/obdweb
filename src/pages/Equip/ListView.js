import React, { PureComponent } from 'react';

import styles from './ListView.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return <div className={styles.testCss}>test ListView</div>;
  }
}

export default BaseInfo;
