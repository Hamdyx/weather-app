const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow gitmoji-after-colon style, e.g. "docs(general): ✏️ update readme"
    'subject-case': [0],
  },
};

export default config;
