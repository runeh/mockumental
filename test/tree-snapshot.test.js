const { resolve } = require('path');

const sortObject = require('deep-sort-object');

const { load } = require('../lib/dirparser');

function removePathPrefixes(routes) {
    routes.forEach(route => {
        route.handlers.forEach(handler => {
            handler.path = handler.path.split(__dirname).pop();
        })
    });
    return routes;
}

expect.addSnapshotSerializer({
    test: obj => obj,
    print: routes => JSON.stringify(sortObject(removePathPrefixes(routes)), null, 4),
});

const fixtureDir = resolve(__dirname, 'fixture-tree');

it('dir parsing snapshot smoke test', () => {
    const tree = load(fixtureDir);
    expect(tree).toMatchSnapshot();
});
