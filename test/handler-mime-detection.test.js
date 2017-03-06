const { inferMimeType } = require('../lib/dirparser/handlerparser');

// fixme: with dynmic handlers this should be able to detect
// .<realtype>.js extensions. So for example
// searchresponse.json.js , userprofile.html.js

// fixme: should whitelist be a thing? If so, on what, mime or extension?
// guessing extension is better so we get more stuff for free from mime
// module.

const samples = [
    ['css', 'text/css'],
    ['csv', 'text/csv'],
    ['gif', 'image/gif'],
    ['html', 'text/html'],
    ['js', 'application/javascript'],
    ['json', 'application/json'],
    ['txt', 'text/plain'],
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['png', 'image/png'],
    ['svg', 'image/svg+xml'],
    ['xml', 'application/xml'],
    ['yaml', 'text/yaml'],
];

samples.forEach(([extension, mime]) => {
    test(`mime type match for .${ extension }`, () => {
        expect(inferMimeType(`ok.${ extension }`))
            .toEqual(mime);
    });
});

// fixme: not an official mime type. register it in the module?
test.skip('jsonl mime types', () => {
    expect(inferMimeType('ok.jsonl'))
        .toEqual('application/jsonl');
});

// fixme: not an official mime type. register it in the module?
test.skip('jsonp mime types', () => {
    expect(inferMimeType('ok.jsonp'))
        .toEqual('application/jsonp');
});
