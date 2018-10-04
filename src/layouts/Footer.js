import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" />
          &nbsp;&nbsp;
          <FormattedMessage id="layout.copyright.year" />
          &nbsp;&nbsp;
          <FormattedMessage id="layout.copyright.ltd" />
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
