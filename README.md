# Mocumental - Directory based http server for testing.

Mocumental is useful when developing services that talk to HTTP servers.
With Mocumental you define routes on the server as a set of paths on the
file system. For each route it's possible to define multiple responses and
response codes. A UI is provided to switch between available responses.

## Installation

```
npm install
```

## Command line usage

(There are example mock directories in the repo, under `./example`)

### Serve mocks

```
mockumental serve ./path/to/mock/folder
```

This will serve a web server on port 3031 matching the contents of the
folder in the repo.

The selected routes can be inspected and edited in the following ways:

- Interactive prompt in the console
- The web admin UI at `http://localhost:3031/__admin`
- JSON API, also at `http://localhost:3031/__admin`

### List mock routes

```
mockumental list ./path/to/mock/folder
```

Prints all the mocks in the folder.

## HTTP API

When requesting the `__admin` URL without an accept header, or with a JSON
accept header, the server returns a list of all routes, and all handlers
for the routes. The active handler for each route will have its `current` 
flat set to `true`.

Get the routes from a running mock server:

```
curl http://localhost:3031/__admin
```

Activating the handler with id "r9h1":

```
curl --data "hid=r9h1"  http://localhost:3031/__admin
```

## JavaScript API

### Core

```
const { Mockumental } = require('mockumental');

const mocker = new Mockumental(pathToMockFolder);

const path = '/test/path/';
const method = 'GET';

mocker
  .handle(path, 'GET');
  .then(response => {
    if (response) {
      console.log(response)
    }
    else {
      console.log(`no handler for ${ method }: ${ path }`)
    }
  });
```

#### Mockumental class

#### `constructor(rootDir)`

#### `getRoutes()`

Returns a list of routes, and the handlers for each route

#### `activateHandler(handlerId)`

Make the handler identified by `handlerId` active. 

Note: Handler IDs are unique so there is no need to specify the route ID.

#### `handle(path, method)`

Tries to find a handler matching the path and method. Returns a promise.

The promise resolves with `null` if there is no handler.

The promise resolves with a response object if the handler was found and
executed.

fixme: response object docs and more args


### Express integration

fixme: document the middleware

## Mock directory structure

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
│     │  ├─ regular-user.default.json
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
- File extensions ending in `.js` are treated as a dynamic handler if the
  second most extension matches a static file type we know about. Thus it's
  possible to write a javascript handler that runs som code to emit the
  response. For example `ok.json.js` will run the js in the file, and
  send the response data as json.
- Directory names in all upper case are assumed to be wildcards. That is, the
  path segment will match anything:
    - `/user/ID/profile.json`
- A handler ending in `.proxy` will set up proxying of the route. The contents
  of the file should be the target URL to proxy to.


## Notes:

- Needs to use extensions on **folder name** if the server is meant to respond
  to urls with extensions. So one might have the folder name `/userdata.json`
  which contains multiple handlers for the path.
