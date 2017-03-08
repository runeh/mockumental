const { inferDefault } = require('../lib/dirparser/handlerparser');

test('no default', () => {
    expect(inferDefault('200.json'))
        .toBe(false);
});

test('default as file name', () => {
    expect(inferDefault('default.json'))
        .toBe(true);
});

test('default dotted', () => {
    expect(inferDefault('ok.default.json'))
        .toBe(true);
});
