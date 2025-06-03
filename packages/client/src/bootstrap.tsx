import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/app';

export const mount = (el: HTMLElement) =>
  ReactDOM.createRoot(el).render(<App />);
