import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Obd.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.car.obd" />
      </div>
    );
  }
}

export default BaseInfo;
