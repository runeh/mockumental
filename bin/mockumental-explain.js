#!/usr/bin/env node

const program = require('commander');
const { parseFileName } = require('../lib/dirparser/handlerparser');

function printHumanreadable(h, file) {
    // eslint-disable-next-line no-console
    console.log(`Handler: ${ file }
    pretty name:  ${ h.prettyName }
    methods:      ${ h.methods.sort().join(', ') }
    status:       ${ h.status }
    handler type: ${ h.handlerType }
    mime type:    ${ h.mimeType ? h.mimeType : 'none' }
    delay:        ${ h.delay ? `${ h.delay } milliseconds` : 'none' }
    is default?:  ${ h.isDefaultHandler ? 'yes' : 'no' }
    handler id:   ${ h.handlerId ? h.handlerId : '<automatic>' }    
    `.trim());
}

program
    .usage('file-pattern')
    .option('-j, --json', 'dump as json')
    .parse(process.argv);

const name = program.args[0];

if (name == null) {
    // eslint-disable-next-line no-console
    console.log('File name missing');
}
else {
    const handlerInfo = parseFileName(name);
    if (program.json) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(handlerInfo, null, 4));
    }
    else {
        printHumanreadable(handlerInfo, name);
    }
}
