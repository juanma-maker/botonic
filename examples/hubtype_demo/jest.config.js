// Options about JS are for compiling @botonic .js/jsx files
module.exports = {
  roots: ['tests/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tests/tsconfig.json'
    }
  },
  preset: 'ts-jest',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  testPathIgnorePatterns: ['lib', '.*.d.ts', 'tests/helpers'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!@botonic).+\\.(js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  snapshotSerializers: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  modulePaths: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
