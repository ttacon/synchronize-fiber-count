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

    describe('emit', () => {
        it('correctly emits the fiber count', (done) => {
            let sync = require('synchronize');
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

            sync.fiber(() => {
                sync.await(((done) => {
                    done();
                })(sync.defer()));
            });

            counter.start();
        });
    });
});
