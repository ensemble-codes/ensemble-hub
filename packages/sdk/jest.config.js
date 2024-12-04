module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    // Add any module name mappings if necessary
  },
  transformIgnorePatterns: [
    '/node_modules/(?!graphql-request)', // Add any other modules that need to be transformed
  ],
};