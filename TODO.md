# Todo:

## Core 

- .cache. On path, qs, args?
- handler.500ms.json
  - Resolve the delay in `executeHandler`, or leave it to users?
- sorting is wonky for alpha route names?
- Support explicit hid in handler names
- .filter(e => isAllowedHandler(e.path)) should filter on bool perhaps
- Error out if using a status in a proxy handler name
- support 'ANY' method for proxying
- support 'ANY' for other stuff?
- support 'ANY' for status for proxying at least, needs to
  - show it in the ui
  - bail if setting status in name
- inferer / handler field for extension
- add `handleRequest` that takes node request obj? Maybe even takes
  optional response object to write to.
- `.proxy.js` for script proxy targets. Needed? Overkill? Might be useful
  for wildcard paths. Might not matter, better to just create explicit
  proxy routes in that case.
- Semantics for merging query params for proxying
- Calling convention for script handlers re path, query and body
- Pidfile / persist previous state?
- throw when non-usable file find or null it?
- Resolve retval from handlers so script handlers can do promises.

## CLI

- Use chalk for colors and stuff. Harder.
- cli for selecting a hid via http?
- prettyprint flag on json list?
- 'explain' command?

## Webui

- Web Fancyness
- HTTP log

## Tests

- More inferers
- Tree munging
- Express
- query args for proxying. Define what happens if both have them.

## Other

- Docs
- Hosts?
- util/writeMockToRes: set headers and stuff
  - Can use this in express as well, sturdier when proxying maybe
- For above, assume request objects are just node ones?
- Can we trigger repaint of the cli when web UI changes? With the RX
  stuff I guess? Would be neat.
- Ditto sync other way. Would need fancier ui, with sse or whatever
  Would need that anyway for request log / inspection
- Less classy express thingy?
- Added debug module perhaps?
- use METHODS and STATUS_CODES from http module?
- ANY extension thingy for UI on proxy routes
