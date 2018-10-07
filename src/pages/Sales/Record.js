import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Record.less';

class Record extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.sales.record" />
      </div>
    );
  }
}

export default Record;
