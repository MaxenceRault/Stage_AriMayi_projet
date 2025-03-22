// app/Providers.tsx
'use client';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { antdTheme } from '../../theme.config';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </Provider>
  );
}
