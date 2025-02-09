import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterContent: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }} className="h-4">
      ©{new Date().getFullYear()} Dashboard Demo. All Rights Reserved.
    </Footer>
  );
};

export default FooterContent;
