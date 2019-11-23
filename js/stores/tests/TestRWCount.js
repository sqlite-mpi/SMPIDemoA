import {Platform} from 'react-native';
import {observable, runInAction} from 'mobx';
import {
    timer,
    getNextAssertOne,
    raceWithId,
    removeNext,
} from '../../lib/async-util';

import RNFS from "react-native-fs";



const getNewTestFile = () => {
    const d = (new Date()).toISOString();
    const randomId = Math.ceil(Math.random() * 100000000).toString(16);

    const dir = RNFS.DocumentDirectoryPath;

    // const dir = Platform.OS === 'ios' ?
    //     '~/Documents' :
    //     // '/tmp/
    //     '/data/user/0/com.smpidemo/cache';

    // '/data/local/tmp';
    // '/sdcard';

    return `${dir}/smpi-test-${d}-${randomId}.sqlite`;
};

const zero = {
    complete: 0,
    active: 0,
    queued: 0,
    ops: 0,
    lastWid: 0,
};


class TestRWCount {
    active = false;
    @observable data = {
        read: {
            ...zero,
            lastWid: [],
        },
        write: {
            ...zero,
        },
    };

    async start(c) {
        this.active = true;

        const f = c.newFileRef(getNewTestFile());
        console.log({absFile: f.absFile});
        await this.initSchema(f);

        while (this.active) {
            await Promise.all([
                this.oneIterWrite(f),
                this.oneIterRead(f),
            ]);
        }
    }

    stop() {
        this.active = false;


    }

    async oneIterWrite(f) {
        const d = this.data.write;
        let w = [];

        for (let i = 0; i < 10; i++) {
            w.push(f.getWriteTx());
            runInAction(() => {
                d.queued++;
            });
        }

        while (w.length > 0) {
            // Wait for next wtx request to be resolved.
            const wtx = await getNextAssertOne(w, 500);
            if (wtx === null) {
                break;
            }

            runInAction(() => {
                d.active++;
                d.queued--;
            });


            for (let i = 0; i < 10; i++) {
                await wtx.write('INSERT INTO t1 (b) VALUES (?)', [new Date()]);
                runInAction(() => {
                    d.ops++;
                });
            }

            const {rows: [{max = 0}]} = await wtx.read('SELECT max(a) max FROM t1');

            await wtx.commit();
            runInAction(() => {
                d.lastWid = max;
                d.complete++;
                d.active--;
            });
        }
    }

    async oneIterRead(f) {
        const d = this.data.read;

        const one = async () => {
            const p1 = f.getReadTx();

            runInAction(() => {
                d.queued++;
            });

            const rtx = await p1;

            runInAction(() => {
                d.active++;
                d.queued--;
            });

            const {rows: [{max = 0}]} = await rtx.read('SELECT max(a) max FROM t1');
            runInAction(() => {
                d.ops++;
            });

            await rtx.commit();

            runInAction(() => {
                const next = d.lastWid.slice(0, 9);
                next.unshift(max);
                d.lastWid = next;
                d.complete++;
                d.active--;
            });
        };

        let r = [];
        for (let i = 0; i < 100; i++) {
            r.push(one());
        }

        await Promise.all(r);
    }

    async initSchema(f) {
        const wtx = await f.getWriteTx();
        await wtx.write('CREATE TABLE t1(a INTEGER PRIMARY KEY, b);');
        await wtx.commit();
    }


}


export {
    TestRWCount,
};
