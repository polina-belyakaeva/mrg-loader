module.exports = {
  name: 'client',
  filename: 'remoteEntry.js',
  exposes: {
    './MRGModule': './src/bootstrap.tsx',
  },
  shared: {
    react: { singleton: true, eager: true, requiredVersion: false },
    'react-dom': { singleton: true, eager: true, requiredVersion: false },
  },
};
