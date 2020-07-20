import React from 'react';
import { render } from '@testing-library/react';
import { Invoice } from './Invoice';
import { Provider } from 'react-redux';
import store from '../../app/store';
import { BrowserRouter } from 'react-router-dom';

test('renders without errors', () => {
  const component = render(
    <Provider store={store}>
      <BrowserRouter>
        <Invoice />
      </BrowserRouter>
    </Provider>
  );

  expect(component).toBeTruthy();
});
