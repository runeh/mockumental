# Mocumental - Directory based http server for testing.

Mocumental is useful when developing services that talk to HTTP servers.
With Mocumental you define routes on the server as a set of paths on the
file system. For each route it's possible to define multiple responses and
response codes. A UI is provided to switch between available responses.

## Quick example:

```
npm install
npm start
```

This will serve a web server on port 3000 matching the contents of the `./ex2`
folder in the repo. There will be an interactive command line interface to
select which handlers should be activated for the different routes.

## Example

A mock server is represented by a root folder. Within the root, folders
represents the paths of URIs, and files are response handlers for the URIs

A directory that represents a mock service could look like this:

```
/
├─ index.html
├─ error.500.html
├─ user
│  ├─ create.PUT.201.json
│  └─ USERID
│     ├─ profile
│     │  ├─ regular-user.DEFAULT.json
│     │  ├─ admin-user.json
│     │  ├─ not-found.404.json
│     │  ├─ edit-ok.POST.json
│     │  └─ delete-ok.DELETE.json
│     └─ profile-widget
│        ├─ ok.html
│        └─ not-found.404.html
└─ search
   ├─ many-hits.200.json
   └─ zero-hits.200.json
```



## File name and path conventions

- Any 3 digit number enclosed in periods is assumed to be a HTTP status code.
  If no status code is given, it's assumed to be 200.
    - `error.500.html`
    - `success.200.html`
- Any uppercase HTTP method enclosed in periods is assumed to be the HTTP
  verb the handler responds to. If no method is given, `GET` is assumed:
    - `create-user.POST.json`
    - `update-user.PUT.json`
- File extensions are assumed to match the mime type of the document. Thus
  thus `.json`, `.html`, `.png` etc. should just work.
- Directory names in all upper case are assumed to be wildcards. That is, the
  path segment will match anything:
    - `/user/ID/profile.json`

## Notes:

- Needs to use extensions on **folder name** if the server is meant to respond
  to urls with extensions. So one might have the folder name `/userdata.json`
  which contains multiple handlers for the path.

## Todo:

- isStatic and isDynamic stuff: so `.json.js` should run the js to create the
  json.
- Web Fancyness
- HTTP log
- Use chalk for colors and stuff. Harder.
- "quit" and "show" routes in cli?
- Care about accept types? Sounds like too much work for too little utility?
- Docs
- handler.proxy
- handler.proxyonce (means statefulness somewhere)
  - Could be generic '.cache.' which'll just persist whatever, regardless
    if it came from proxy or file or script. Can be valuable for script
    as well I guess? Cache on handler or path? Path is better presumably
- handler.500ms.json
- tests
- Hosts?
- parse status code thingy `200.json`;
- util/writeMockToRes: set headers and stuff
- get rid of routeId, use only handlerId for activation?
- default selection should happen after sorting. So not be 404 is there is 200
- Can we trigger repaint of the cli when web UI changes? With the RX
  stuff I guess? Would be neat.
- link to mount point in web admin
- Ditto sync other way. Would need fancier ui, with sse or whatever
  Would need that anyway for request log / inspection
- tabelize the markup in web ui
- Remove selected prop in inquire.
- Less classy express thingy
- Support explicit rid
- cli for selecting a rid via http?

## Notes


```
const {
  status,
  contentType,
  headers,
  body(promise/stream/string/object?)
}
```
