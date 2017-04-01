const { resolve } = require('path');
const { load } = require('../lib/dirparser');

test.only('no hid', () => {
    expect(
        () => load(resolve(__dirname, 'trees', 'duplicate-hids'))
    ).toThrow(/Handler "thehid" already defined/);
});
