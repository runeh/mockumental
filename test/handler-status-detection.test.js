const { inferStatusCode } = require('../lib/dirparser/handlerparser');

test('no status defaults to 200', () => {
    expect(inferStatusCode('ok.json'))
        .toBe(200);
});

test('explicit dotted status 200', () => {
    expect(inferStatusCode('ok.505.json'))
        .toBe(505);
});

test('status as file name', () => {
    expect(inferStatusCode('506.json'))
        .toBe(506);
});

test('throw on multiple status codes', () => {
    expect(
        () => inferStatusCode('lol.300.506.json')
    ).toThrow(/multiple status codes/);
});
