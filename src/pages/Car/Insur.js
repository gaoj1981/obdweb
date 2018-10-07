import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Insur.less';

class Insur extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.car.insur" />
      </div>
    );
  }
}

export default Insur;
