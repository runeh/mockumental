# Mockumental - Directory based http server for testing.

Mockumental is a web server useful during development. It lets you create a
web server mocking the responses you would expect from your production system.
It's probably most useful during development, when you want to test how a
frontend application deals with different kinds of responses.

Features:

- File name conventions for configuration
- Switching responses for the same resource 
- Static responses
- Scripted responses
- Proxied responses
- Wildcard paths
- Testing multiple statuses for the same response
- Delayed responses
- CORS

The configuration uses the file system to mirror your server. Every directory
in your mock site represets a resource on the web server. Every file contains
a different response for the resource the directory represents.

## Minimalistic example

(The example folders can be found in the `example` folder of the Mockumentary
repository)

Given the following directory structure:

```
/ readme-1
├─ ok.default.json
└─ error.500.json
```

Running `mockumental ./example/readme-1` starts an HTTP server listening
on port 3031. If you open `http://localhost:3031` it will respond with 
the contents of the `ok.default.json` file.

To change what the server replies to, open the admin UI:
`http://localhost:3031/__admin`. This lets you activate different handlers for
the path. If you activate the 500 handler and reload `http://localhost:3031`,
you will get a 500 response and the contents of the `error.500.json` file.

There are other ways to select what handler to use. By default, there is a
terminal UI activated when you start the server as well as the web admin UI.

## Full example

This example attempts to use all the features of mockumental.

This mock server pretends to be the API backend for some kind of classifieds
website. 

```
/ readme-2
├─ ok.json
├─ error.500.json
├─ user/
│  ├─ create.PUT.201.json
│  ├─ show.default.json
│  ├─ edit.POST.json
│  └─ avatar/
│     ├─ user.png
│     └─ no-avatar.404.png
└─ market/
  └─ MARKETNAME/
    └─ search/
        ├─ one-hit.json
        ├─ many-hits.default.json
        ├─ many-hits-slow.delay-2000ms.json
        ├─ zero-hits.json
        ├─ dynamic-market-name.json.js
        ├─ server-error.500.json
        ├─ not-found.404.json.js
        ├─ proxy-to-dev.proxy
        └─ proxy-to-prod.proxy
```

- When requesting `/` the server replies with either the static files
  `ok.json` with a 200 status code, or `error.500.json`, with a 500 status
  code.
- When requesting `/user/` with a GET request, returns the contents of
  `show.default.json`
- When requesting `/user` with a PUT request, returns the contents of
  `create.PUT.201.json` with a 201 response code.
- When requesting `/user` with a POST request, returns the contents of
  `edit.POST.json` with a 200 response code.


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

### Explain a file name

```
mockumental explain search.200.POST.PUT.json.js
```

Explains how mockumental will interpret a file name. Mostly useful for
debugging and experimentation.


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

##### `constructor(rootDir)`

##### `getRoutes()`

Returns a list of routes, and the handlers for each route

##### `activateHandler(handlerId)`

Make the handler identified by `handlerId` active. 

Note: Handler IDs are unique so there is no need to specify the route ID.

##### `handle(path, method)`

Tries to find a handler matching the path and method. Returns a promise.

The promise resolves with `null` if there is no handler.

The promise resolves with a response object if the handler was found and
executed.


### Express integration

Mockumental has out of the box support for express.

This code would expose mocks on the `/mocks` path of an app:

```
const express = require('express');

// fixme: path
const { ExpressMockumental } = require('../lib/cli-utils/express');

const app = express();
const mocker = new ExpressMockumental(mockRootDir);

app.use('/mocks', mocker.router);
```

#### ExpressMockumental class

##### `constructor(mocksRoot)`

Creates a wrapper arond a regular `Mockumental` object,

##### `router`

Property that contains an express router. 

##### `activateHandler(hid)`

Same as for `Mockumental` class

##### `getRoutes()`

Same as for `Mockumental` class


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

### Resource paths

All mocked resources are represented by directories. Thus if one wants the
mock server to reply to a request for `index.json`, there needs to be a
**directory** named `index.json`. In the directory there can be any number of
handler files, that will contain different possible responses.

An all upper case directory name will be treated as a wildcard. Thus they
will match any string.

Thus, given the directory `/user/USERID` any request starting with `/user/`
will match. For example requesting `/user/runeh` will match this route. This
is the equivalent of using params in express routes, like `/user/:userid`. 

### Handler files

Handler file names roughly follow this pattern:

`<name>.<directives>.<mime and handler type>`

For example:

`search-results.POST.200.delay-400ms.json`

This translates to a handler named 'search results' that will reply to `POST`
requests with a 200 status with the contents of the file served as json. The
response will be delayed by 400 milliseconds.

The name part can contain any characters except a period, as the period
separates between the name and the rest of the file name. When pretty
printing the name, all non-alphanumeric characters are converted to
spaces. Thus `search-results` become `search results`.

The directives section can contain a number of directives separated by spaces.
The order of the directives does not matter.

### Directives

#### Method names

MUST be upper case, and match one of `DELETE`, `GET`, `HEAD`,
`OPTIONS`, `POST` or `PUT`. The method name directive sets what request
method the handler will respond to.

There can be multiple method names in a single
file name. Thus the file name `ok.POST.GET.PUT.json` is allowed, and there
will be created route handlers for post, put and get requests.

If there is no method name directive, the default method used is `GET`.

#### Status code

Any three digit number is interpreted as the status that will be used when
responding to a request. `service-error.500.json` will respond with a status
of 500, and the contents of the json file as the body.

If there is no status code directive, the default status is 200.

Note that for proxy routes, the status code directive is not used. It is not
possible to override the status code sent by the upstream server.

Query arguments will be forwarded to the upstream server.

#### Delay

A delay directive looks like `delay-<digits><unit>`. Allowed units are 'ms'
for milliseconds and 's' for seconds. If unit is omitted, milliseconds is
used. Some example delay directives:

- `ok.delay-500ms.json` - Delays 500 milliseconds
- `ok.delay-500.json` - Also delays 500 milliseconds
- `ok.delay-1s.json` - Delays 1 second

If no delay directive is present, no delay is added to the response.

#### Default route flag

If `.delay.` is present in a file name, it will be marked as the default
handler to activate when the server starts. For example
`many-hits.default.json`. If no default directive is used, the first handler
is selected. Handlers are sorted by status code, then alphabetically.

#### Handler ID

Handler IDs are assigned automatically when parsing the mock directory.
In some cases there needs to be a predictable handler ID, so it's possible to
script changing the handler. In this case adding `name.hid-myhid.json` would
assign `myhid` as the handler ID. Thus it would be safe to later use the HTTP
API to activate the `myhid` handler.


### MIME and handler type

There are three types of response handlers:

- Static
- Proxy
- Script


#### Static handlers

A handler file name that ends in an extension with a valid MIME type is
considered to be a static handler.

Static handlers simply returns the contents of the file. The MIME type is
determined by looking at the file extension.

Optionally a file name can end with `.static` to be more explicit about a
handler being static.

#### Proxy handlers

A handler file name that ends with `.proxy` is considered to be a proxy handler.

Proxy handlers forward requests to an upstream server and returns the body.
The target URL is read from the file. Thus the contents of a proxy route
handler should be a string containing a sungle URL.

Note that response code set in the file name is ignored for proxy handlers.
The response code from the upstream server is used. The same apply to MIME
types. They are ignored for proxy routes, the upstream sets the MIME type.


#### Script handlers

A handler file name that ends with `<mime-extension>.js` is considered a
script handler. `<mime-extension>` can be any extension with a valid MIME
type. So for example `ok.json.js` is a script handler with the MIME type
of json.

A script handler must be a node module file that exports either a string or a
single function.

If the export is a string, it is used as the response body.

If the export is a function it must return either a string, or a promise of a
string.

The function will be called with three arguments, `params`, `request` and
`memo`.

- `params` is an object containing any dynamic route params for the handler.
  Thus if the route handler path was `/user/USER_ID/user-info.200.json.js` and
  the request path was `/user/runeh/` then the first argument to the function
  is `{ user_id: 'runeh' }. If there are no route params, an empty object
  is passed in.
- `request` is a node.js HTTP request object.
  **Note**: this will likely change in the future.
- `memo` is an object that will persist between each invocation of the handler.
  This means that handlers that want to persist some state or share state
  between handlers can add things to this object.

Thus a handler may look like this:

```
function timeStampHandler(routeParams, request, memo) {
  const lastSeen = memo.lastSeen || Date.now();
  const response = {
    date: new Date().toUTCString(),
    timeSinceLastRequest: Date.now() - lastSeen;
  };
  memo.lastSeen = Date.now();
  return JSON.stringify(response);
}
```

This returns a string containing some JSON with the current timestamp and the
time since the last time the handler run.

## Caveats and notes

- The HTTP status code is allowed to be any three digit number, regardless
  if it's a defined status code or not.
- Query arguments are ignored for static handlers. Script handlers can read
  them from the request object if they need to.
