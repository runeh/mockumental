const { inferDefault } = require('../lib/dirparser/handlerparser');

test('no default', () => {
    expect(inferDefault('200.json'))
        .toBe(false);
});

// fixme: what should the sematics of this be?
test.skip('default as file name', () => {
    expect(inferDefault('default.json'))
        .toBe(false);
});

test('default dotted', () => {
    expect(inferDefault('ok.default.json'))
        .toBe(true);
});
