const { inferDelay } = require('../lib/dirparser/handlerparser');

test('no delay', () => {
    const delay = inferDelay('ok.json');
    expect(delay)
        .toEqual(0);
});

test('delay without unit', () => {
    const delay = inferDelay('ok.delay-300.json');
    expect(delay)
        .toEqual(300);
});

test('delay with ms unit', () => {
    const delay = inferDelay('ok.delay-200ms.json');
    expect(delay)
        .toEqual(200);
});

test('delay with s unit', () => {
    const delay = inferDelay('ok.delay-3s.json');
    expect(delay)
        .toEqual(3000);
});
