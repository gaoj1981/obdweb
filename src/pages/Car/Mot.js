import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';

import styles from './Mot.less';

class Mot extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.testCss}>
        <FormattedMessage id="menu.car.mot" />
      </div>
    );
  }
}

export default Mot;
