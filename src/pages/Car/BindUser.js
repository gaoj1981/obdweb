import React, { PureComponent } from 'react';

import styles from './BindUser.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return <div className={styles.testCss}>test binduser</div>;
  }
}

export default BaseInfo;