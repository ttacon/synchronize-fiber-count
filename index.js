'use strict';

const EventEmitter = require('events');
const assert = require('assert');

class FiberCounter extends EventEmitter {
    constructor(options) {
        super();
        options = options || {};
        assert(options.sync, 'Must provide the synchronize.js reference');
        assert(options.sync.Fiber, 'sync must expose the Fiber property');
        this.interval = options.interval || 30000;
        this.unit = options.unit || 'ms';
        this.syncRef = options.sync.Fiber;
        this.currNumFibers = this.syncRef.fibersCreated;
    }

    getInterval() {
        if (this.unit === 'ms') {
            return this.interval;
        } else if (this.unit === 's') {
            return this.interval * 1000;
        }
        return 30000; // Default to thirty second
    }

    start() {
        this.intervalRef = setInterval(() => {
            let currFiberCount = this.syncRef.fibersCreated;
            let fiberDiff = currFiberCount - this.currNumFibers;
            this.currNumFibers = currFiberCount;
            this.emit('count', fiberDiff);
        }, this.getInterval());
    }

    stop() {
        clearInterval(this.intervalRef);
        this.intervalRef = null;
    }
}

module.exports = FiberCounter;
