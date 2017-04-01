const { inferHid } = require('../lib/dirparser/handlerparser');

test('no hid', () => {
    const hid = inferHid('ok.json');
    expect(hid)
        .toEqual(null);
});

test('with hid 1', () => {
    const hid = inferHid('ok.hid-lol.json');
    expect(hid)
        .toEqual('lol');
});

test('with hid 2', () => {
    const hid = inferHid('found-my-user.hid-myuser.200.json');
    expect(hid)
        .toEqual('myuser');
});
