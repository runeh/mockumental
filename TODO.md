# Todo:

## Rest

- throw when non-usable file find or null it?
- Semantics for merging query params for proxying
  - just support multiple, like the spec says.

## Core 

- .cache. On path, qs, args?
- sorting is wonky for alpha route names?
- Error out if using a status in a proxy handler name
- support 'ANY' method for proxying
- support 'ANY' for other stuff?
- support 'ANY' for status for proxying at least, needs to
  - show it in the ui
  - bail if setting status in name
- `.proxy.js` for script proxy targets. Needed? Overkill? Might be useful
  for wildcard paths. Might not matter, better to just create explicit
  proxy routes in that case.
- Calling convention for script handlers re path, query and body
- Pidfile / persist previous state?
- Delay code that tries to compensate for handler duration? Overkill?
- Support for `.html.json` where the json body contains same as a
  mockumental response. body, headers, whatnot
  - Perhaps naming should be .resjson or something? 
- Support string or object as retval fron script handlers. If object, treat
  as mockumental response?
- figure out copy / immutability semantics when mutating routes on hid
  selection
- Sanity check proxy URL?
  - support paths as well?
- lower case method names? so 'post.json' works?
- Support buffers as retval from script handlers?
- caching
- move params onto request object so it's more expressy?
- make proxy handlers get `any` as default response

## CLI

- Use chalk for colors and stuff. Harder.
- cli for selecting a hid via http?
- show delay


## Webui

- Web Fancyness
- HTTP log
- show delay


## Tests

- Tree munging
- Proxying
  - middleman or something
  - query args for proxying. Define what happens if both have them.
- assertions for handler name parsing
  - Only a single status code allowed
- Test malformed input to handlers from path


## Docs

- Clean up example dirs
- Screenshot / screen cast thingies
- Calling conventions / object types for script handlers req / res objects
- jsdoc typedef for handler
- typings for flow and ts?


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
- ANY extension thingy for UI on proxy routes

## Unknowns
