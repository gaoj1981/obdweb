import React, { PureComponent } from 'react';

import styles from './LicAuth.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return <div className={styles.testCss}>test LicAuth</div>;
  }
}

export default BaseInfo;
