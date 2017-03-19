# Todo:

## Core 

- Remove cache code until it's implemented
- .cache. On path, qs, args?
- sorting is wonky for alpha route names?
- Support explicit hid in handler names
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
- Delay code that tries to compensate for handler duration? Overkill?
- Support for `.html.json` where the json body contains same as a
  mockumental response. body, headers, whatnot
  - Perhaps naming should be .resjson or something? 
- Support string or object as retval fron script handlers. If object, treat
  as mockumental response?
- Split up handler name parsing and handler loading, for testing and
  to be able to implement the `describe` command
- Optional dash in name delay directive?
- Sanity check hid selection
- figure out copy / immutability semantics when mutating routes on hid
  selection
- Sanity check proxy URL
- lower case method names? so 'post.json' works?
- Support buffers as retval from script handlers
- caching
- Throw on unknown method?
- Validate status?

## CLI

- Use chalk for colors and stuff. Harder.
- cli for selecting a hid via http?
- prettyprint flag on json list?
- 'explain' command?
- show delay


## Webui

- Web Fancyness
- HTTP log
- show delay


## Tests

- More inferers
- Tree munging
- Express
- query args for proxying. Define what happens if both have them.
- assertions for handler name parsing
  - Only a single status code allowed
- namespaced eslint to test dir?

## Docs

- Clean up example dirs
- Screenshot / screen cast thingies
- Calling conventions / object types for script handlers req / res objects
- Memo object
- What is synchronous and what isn't


## Other

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
- use STATUS_CODES from http module?
- ANY extension thingy for UI on proxy routes
