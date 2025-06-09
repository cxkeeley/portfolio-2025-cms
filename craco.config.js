const path = require('path');

const webpackAlias = 

module.exports = {
  webpack: {
    alias: { 
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@models': path.resolve(__dirname, './src/models'),
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@api/(.*)$': '<rootDir>/src/api/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@models/(.*)$': '<rootDir>/src/models/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
      }

      return jestConfig
    }
  }
};
