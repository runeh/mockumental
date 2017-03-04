module.exports = {
    plugins: ['jest'],
    env: {
        es6: true,
        node: true,
        'jest/globals': true // fixme: namespaced to test dir?
    },
    parserOptions: {
        ecmaVersion: 6
    },
    extends: 'eslint:recommended',
    rules: {
        'no-console': 'warn',
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never'
            }
        ],
        'consistent-return': 'error',
        'template-curly-spacing': ['error', 'always'],
        'prefer-template': 'warn',
        'no-new-symbol': 'error',
        'prefer-const': 'error',
        'no-multi-spaces': 'error'
    }
};
