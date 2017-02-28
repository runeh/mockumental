module.exports = {
    env: {
        browser: false,
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': [
            'error',
            {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: 'never'
            }
        ]
    }
};
