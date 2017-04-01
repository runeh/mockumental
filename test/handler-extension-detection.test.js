const { inferExtension } = require('../lib/dirparser/handlerparser');

test('static json type', () => {
    expect(inferExtension('ok.json'))
        .toBe('json');
});

test('static js type', () => {
    expect(inferExtension('ok.js'))
        .toBe('js');
});

test('script json type', () => {
    expect(inferExtension('ok.json.js'))
        .toBe('json');
});

test('script json type, json as handler name', () => {
    expect(inferExtension('json.js'))
        .toBe('json');
});

test('explicit static json type', () => {
    expect(inferExtension('ok.json.static'))
        .toBe('json');
});
