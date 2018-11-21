import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './LicAuth.less';

class BaseInfo extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.equip.license" />
        （二期开发中...）
      </div>
    );
  }
}

export default BaseInfo;
