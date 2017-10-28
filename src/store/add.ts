import { observable } from 'mobx'
import * as _ from 'lodash'
import history from '../lib/history'
import l from '../lib/lang'

import service from './service'
import app from './app'

class Add {
    private defaultView = {
        connectionName: 'newConnect',
        address: '127.0.0.1',
        port: '28015',
        username: 'admin',
        password: ''
    }

    @observable
    store = {
        view: _.cloneDeep(this.defaultView)
    }

    change (path, value) {
        _.set(this.store, path, value)
    }

    async add () {
        const connectionName = await service.add(this.store.view)
        if (!connectionName) {
            app.toaster(l`connectionName already exists`, 'WARNING', 5000)
            return
        }
        this.store.view = _.cloneDeep(this.defaultView)
        if (connectionName) {
            app.toaster(l`Success`, 'SUCCESS')
            history.replace('/table?connectionName=' + connectionName)
        }
    }
}

export default new Add()
