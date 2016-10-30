synchronize-fiber-count
=======================


 - Do you use synchronize.js?
 - Have you ever wondered how many fibers you're making?
 - Well now you can find out!

```js
let sync = require('synchronize');
let FiberCounter = require('synchronize-fiber-count');

let counter = new FiberCount({
    sync,
    interval: 5, // Report the new fibers created every 5 seconds
    unit: 's'
});

counter.on('count', (numFibers) => {
  console.log('there have been %d new fibers', numFibers);
});

counter.start(); // We can later stop it with counter.stop()
```