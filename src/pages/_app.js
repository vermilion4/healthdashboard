import React from 'react';
import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import '@/styles/globals.css';
import { Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
});

const App = ({ Component, pageProps }) => (
  <ConfigProvider theme={theme}>
    <div className={manrope.className}>
      <Component {...pageProps} />
    </div>
  </ConfigProvider>
);

export default App;