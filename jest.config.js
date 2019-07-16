module.exports = {
  // reset state of MOCKED and SPIED functions
  // remove custom implementation of MOCKED functions (not spied ones)
  resetMocks: true,
  // remove custom implementation (and the related state) of SPIED functions
  restoreMocks: true,
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
};
