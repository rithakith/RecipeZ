// App.tsx
import { registerRootComponent } from 'expo';
import React from 'react';
import Layout from './_layout';

const App = () => {
  return (
    <Layout />
  );
};

export default registerRootComponent(App);
