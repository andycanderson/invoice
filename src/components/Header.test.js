import React from 'react';
import { render } from '@testing-library/react';
import { Header } from './Header';

test('renders without errors', () => {
  const component = render(
    <Header />
  );

  expect(component).toBeTruthy();
});
