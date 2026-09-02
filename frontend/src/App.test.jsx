import { test } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import App from './App.jsx';

test('renders App', () => {
  render(<App />);
});
