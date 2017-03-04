const { inferMethods } = require('../lib/dirparser/handlerparser');

test('no methods defaults to get', () => {
    const methods = inferMethods('ok.json');
    expect(methods)
        .toHaveLength(1);
    expect(methods)
        .toContain('GET');
});

test('ignore lowercase method names', () => {
    const methods = inferMethods('ok.post.json');
    expect(methods)
        .toHaveLength(1);
    expect(methods)
        .toContain('GET');
});

test('ignore non-stanadard method names', () => {
    const methods = inferMethods('ok.FOO.json');
    expect(methods)
        .toHaveLength(1);
    expect(methods)
        .toContain('GET');
});

test('single method', () => {
    const methods = inferMethods('ok.PUT.json');
    expect(methods)
        .toHaveLength(1);
    expect(methods)
        .toContain('PUT');
});

test('multiple methodst', () => {
    const methods = inferMethods('ok.POST.PUT.json');
    expect(methods)
        .toHaveLength(2);
    expect(methods)
        .toEqual(expect.arrayContaining(['PUT', 'POST']));
});
