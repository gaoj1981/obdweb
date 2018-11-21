import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Record.less';

class Record extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.sales.record" />
        （开发中...）
      </div>
    );
  }
}

export default Record;
