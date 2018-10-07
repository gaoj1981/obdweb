import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Score.less';

class Score extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.sales.score" />
      </div>
    );
  }
}

export default Score;
