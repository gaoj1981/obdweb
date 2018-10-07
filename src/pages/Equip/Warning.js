import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Warning.less';

class Warning extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.equip.warning" />
      </div>
    );
  }
}

export default Warning;
