const { getHandlerType } = require('../lib/dirparser/handlerparser');

test('static json type', () => {
    expect(getHandlerType('ok.json'))
        .toBe('static');
});

test('static html type', () => {
    expect(getHandlerType('ok.html'))
        .toBe('static');
});

test('static html type, works in concert with other opts', () => {
    expect(getHandlerType('ok.POST.PUT.204.html'))
        .toBe('static');
});

test('dynamic json type', () => {
    expect(getHandlerType('ok.json.js'))
        .toBe('dynamic');
});

test('static when js and no other extension', () => {
    expect(getHandlerType('ok.js'))
        .toBe('static');
});

