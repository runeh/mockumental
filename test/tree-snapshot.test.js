const { resolve } = require('path');

const { load } = require('../lib/dirparser');

const fixtureDir = resolve(__dirname, 'fixture-tree');

it('dir parsing snapshot smoke test', () => {
    const tree = load(fixtureDir);
    expect(tree).toMatchSnapshot();
});
