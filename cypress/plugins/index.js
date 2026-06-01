module.exports = (on, config) => {
  // Example plugin hook: log the config before tests run
  on('before:run', (details) => {
    console.log('Starting Cypress run', details);
  });

  return config;
};
