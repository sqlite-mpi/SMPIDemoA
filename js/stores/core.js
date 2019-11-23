import _ from 'lodash';
import {
    configure,
    runInAction,
    action,
    observable,
} from 'mobx';

import * as iop from 'smpi-iop-react-native';
import {smpi} from 'sqlite-mpi-client-js';

import {TestRWCount} from './tests/TestRWCount';


configure({
    enforceActions: 'always',
});

const c = smpi.newClient(iop);

class CoreStore {
    @observable curTestKey = null;
    @observable tests = {
        rwCount: null,
    };

    curTest = null;

    @action
    startTest(x) {
        const {curTestKey} = this;

        if (_.isString(curTestKey)) {
            throw Error('Another test is currently running.');
        }

        this.curTestKey = x;
        const t = new TestRWCount();
        this.tests[x] = t.data;
        this.curTest = t;

        t.start(c);
    }

    @action
    stopAndGoToMenu() {
        const {curTestKey} = this;
        if (curTestKey === null) {
            throw Error('Cannot stop test that is not running.');
        }

        this.tests[this.curTestKey] = null;
        this.curTestKey = null;
        this.curTest.stop();
        this.curTest = null;
    }
}




// Single global instance; when using `import` many times, it only runs the modules code once.
const coreStore = new CoreStore();


export {
    coreStore,
};

