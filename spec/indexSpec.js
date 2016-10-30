'use strict';

let FiberCounter = require('..');

describe('FiberCounter', () => {
    describe('getInterval', () => {
        let sync = require('synchronize');

        it('should be able to default the timer options', () => {
            let counter = new FiberCounter({sync});
            expect(counter.getInterval()).toEqual(30000);
        });

        it('should be able to handle custom timer options', () => {
            let counter = new FiberCounter({
                sync,
                interval: 1000
            });
            expect(counter.getInterval()).toEqual(1000);

            counter = new FiberCounter({
                sync,
                interval: 5,
                unit: 's'
            });
            expect(counter.getInterval()).toEqual(5000);
        });
    });

    function createFiber(sync) {
        sync.fiber(() => {
            sync.await(((done) => {
                done();
            })(sync.defer()));
        });
    }

    describe('emit', () => {
        let sync = require('synchronize');
        it('correctly emits the fiber count', (done) => {
            let counter = new FiberCounter({
                sync,
                interval: 0.5,
                unit: 's'
            });
            counter.on('count', (val) => {
                expect(val).toEqual(1);
                counter.stop();
                done();
            });
            counter.start();

            createFiber(sync);
        });

        it('correctly emits the fiber count', (done) => {
            createFiber(sync); // This is to force sync to cleanup?
            let counter = new FiberCounter({
                sync,
                interval: 1,
                unit: 's'
            });
            
            counter.on('count', (val) => {
                expect(val).toEqual(3);
                counter.stop();
                done();
            });
            counter.start();

            createFiber(sync);
            createFiber(sync);
            createFiber(sync);
        });
    });
});
