# async-file
Adapts the Node.js File System API (fs) for use with TypeScript async/await

This package wraps the Node.js [File System API](https://nodejs.org/api/fs.html), replacing any callback functions with an equivalent async function.
Alternative definitions of some functions are also introduced to enhance the interface and/or take better advantage of TypeScript async/await.
Other than the modified async function signatures and introduced functions, the interface is virtually identical to the original API.

## Examples

Read a text file...
```js
var result = await File.readFile('readme.txt', 'utf8');
```

Read a series of three text files, one at a time...
```js
var data1 = await File.readTextFile('data1.txt');
var data2 = await File.readTextFile('data2.txt');
var data3 = await File.readTextFile('data3.txt');
```

Append a line into an arbitrary series of text files...
```js
var files = ['data1.log', 'data2.log', 'data3.log'];
for (var file of files)
    await File.writeTextFile(file, '\nPASSED!\n', null, File.OpenFlags.append);
```

## Getting Started

Make sure you're running Node v4 and TypeScript 1.7 or higher...
```
$ node -v
v4.2.6
$ npm install -g typescript
$ tsc -v
Version 1.7.5
```

Install package...
```
$ npm install async-file
```

Write some code...
```js
import * as File from 'async-file';
(async function () {
    var list = await File.readdir('.');
    console.log(list);    
})();
```

Save the above to a file (index.ts), build and run it!
```
$ tsc index.ts --target es6 --module commonjs
$ node index.js
["index.ts", "index.js", "node_modules"]
```
