import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Consum.less';

class Consum extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.equip.consum" />
      </div>
    );
  }
}

export default Consum;
