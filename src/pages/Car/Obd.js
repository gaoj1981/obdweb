import React, { PureComponent } from 'react';

import styles from './Obd.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return <div className={styles.testCss}>test obd</div>;
  }
}

export default BaseInfo;
