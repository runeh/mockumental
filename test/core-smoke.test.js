const { resolve } = require('path');
const { Mockumental } = require('../lib');

const treesDir = resolve(__dirname, 'trees');

test('passing in memo works', async () => {
    const testDir = resolve(treesDir, 'memo');
    const mocker = new Mockumental(testDir, {memo: {input: 'lol'}});
    const response = await mocker.handle('/');
    expect(response.body).toEqual('lol');
});
