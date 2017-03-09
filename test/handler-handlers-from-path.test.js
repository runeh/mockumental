const { handlersFromPath } = require('../lib/dirparser/handlerparser');

test('static handler smoke test', () => {
    const handlers = handlersFromPath('ok-handler.299.POST.json');
    expect(handlers.length).toEqual(1);
    const handler = handlers[0];
    expect(handler.method)
        .toEqual('POST');
    expect(handler.status)
        .toEqual(299);
    expect(handler.prettyName)
        .toEqual('ok handler');
    expect(handler.handlerType)
        .toEqual('static');
    expect(handler.extension)
        .toEqual('json');
});

test('script handler smoke test', () => {
    const handlers = handlersFromPath('ok-handler.299.POST.json.js');
    expect(handlers.length).toEqual(1);
    const handler = handlers[0];
    expect(handler.method)
        .toEqual('POST');
    expect(handler.status)
        .toEqual(299);
    expect(handler.prettyName)
        .toEqual('ok handler');
    expect(handler.handlerType)
        .toEqual('script');
    expect(handler.extension)
        .toEqual('json');
});


test('Multiple methods cause multiple handlers', () => {
    const handlers = handlersFromPath('ok-handler.299.POST.GET.PUT.json.js');
    expect(handlers.length)
        .toEqual(3);
    
    let handler;

    handler = handlers[0];
    expect(handler.method)
        .toEqual('POST');

    handler = handlers[1];
    expect(handler.method)
        .toEqual('GET');

    handler = handlers[2];
    expect(handler.method)
        .toEqual('PUT');
});
