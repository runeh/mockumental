const { inferExtension } = require('../lib/dirparser/handlerparser');

test('static json type', () => {
    expect(inferExtension('ok.json'))
        .toBe('json');
});

test('static js type', () => {
    expect(inferExtension('ok.js'))
        .toBe('js');
});

test('dynamic json type', () => {
    expect(inferExtension('ok.json.js'))
        .toBe('json');
});

test('dynamic json type, json as handler name', () => {
    expect(inferExtension('json.js'))
        .toBe('json');
});
