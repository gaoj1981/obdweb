import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './BindUser.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.car.buser" />
      </div>
    );
  }
}

export default BaseInfo;
