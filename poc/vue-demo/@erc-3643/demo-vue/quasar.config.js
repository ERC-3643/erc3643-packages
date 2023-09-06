import { configure } from "quasar/wrappers";

module.exports = configure((ctx) => {
  return {
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx,vue}'
        }
      }
    },
  }
});