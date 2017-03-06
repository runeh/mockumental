## Todo:

Core 

- handler.proxy
- .cache. On path, qs, args?
- handler.500ms.json
- sorting is wonky for alpha route names?
- Support explicit hid in handler names
- .filter(e => isAllowedHandler(e.path)) should filter on bool perhaps
- mime types are probably broken for dynaic handlers
- Error out if using a status in a proxy handler name
- support 'ANY' method for proxying
- support 'ANY' for other stuff?
- inferer / handler field for extension
- add `handleRequest` that takes node request obj? Maybe even takes
  optional response object to write to.

CLI

- Use chalk for colors and stuff. Harder.
- "quit" and "show" routes in cli?
- Remove selected prop in inquire.
- cli for selecting a hid via http?
- prettyprint flag on json list?
- 'explain' command?

Webui

- Web Fancyness
- HTTP log
- Show handler type. mime type and proxy url etc

Tests

- More inferers
- Tree munging
- Express
- Mime type / extension stuff for dynamic routes

Other

- Docs
- Hosts?
- parse status code thingy `200.json`; See skipped test
- util/writeMockToRes: set headers and stuff
  - Can use this in express as well, sturdier when proxying maybe
- For above, assume request objects are just node ones?
- Can we trigger repaint of the cli when web UI changes? With the RX
  stuff I guess? Would be neat.
- Ditto sync other way. Would need fancier ui, with sse or whatever
  Would need that anyway for request log / inspection
- Less classy express thingy
- Added debug module perhaps?
- Prefix path stuff in snapshot tests
- use METHODS and STATUS_CODES from http module?