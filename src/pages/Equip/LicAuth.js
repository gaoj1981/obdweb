import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './LicAuth.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.equip.license" />
      </div>
    );
  }
}

export default BaseInfo;
