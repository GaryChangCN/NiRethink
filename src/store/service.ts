import * as r from 'rethinkdb'
import * as _ from 'lodash'
import history from '../lib/history'
import app from './app'
import l from '../lib/lang'
import {observable, extendObservable} from 'mobx'

class Service {
    conn = null

    @observable
    collect = new Map()

    async add (view) {
        const data = _.cloneDeep(view)
        data.user = data.username
        while (true) {
            if (this.collect.has(data.connectionName)) {
                data.connectionName = data.connectionName + '_'
            } else {
                break
            }
        }
        const {connectionName, username, ...other} = data
        this.collect.set(connectionName, {...other})
        return connectionName
    }

    async connect (connectionName) {
        const data = this.collect.get(connectionName)
        try {
            const conn = await r.connect(data)
            this.conn = conn
            return
        } catch (error) {
            throw error
        }
    }

    async close () {
        if (!this.conn) {
            return
        }
        await this.conn.close()
    }

    disConn () {
        if (!this.conn) {
            history.push('/add-conn')
            app.toaster(`${l`connection is close`}.  ${l`please reconnect`}`, 'DANGER', 5000)
            return true
        }
        return false
    }

    async fetchDbList () {
        if (this.disConn()) {
            return []
        }
        return await r.dbList().run(this.conn)
    }

    async fetchTableList (dbName) {
        if (this.disConn()) {
            return []
        }
        return await r.db(dbName).tableList().run(this.conn)
    }

    async fetchDetailList (dbName, tableName, skip = 0, limit = 20) {
        if (!dbName || !tableName || this.disConn()) {
            return []
        }
        const list: any[] = await (r.db(dbName)
            .table(tableName).skip(skip)
            .limit(limit) as any).coerceTo('array').run(this.conn)
        return list
    }

    async fetchDetailTotal (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            return 0
        }
        const total: number = await r.db(dbName).table(tableName).count().run(this.conn)
        return total
    }

    async fetchDetailIndex (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            return []
        }
        const list = await r.db(dbName).table(tableName).indexList().run(this.conn)
        return list
    }

    async addDatabase (dbName) {
        if (!dbName || this.disConn()) {
            return null
        }
        await r.dbCreate(dbName).run(this.conn)
    }

    async dropDatabase (dbName) {
        if (!dbName || this.disConn()) {
            return null
        }
        await r.dbDrop(dbName).run(this.conn)
    }

    async addTable (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            return []
        }
        await r.db(dbName).tableCreate(tableName).run(this.conn)
    }

    async dropTable (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            return []
        }
        await r.db(dbName).tableDrop(tableName).run(this.conn)
    }

    async insertTable (dbName, tableName, data) {
        if (!dbName || !tableName || this.disConn()) {
            throw new Error(l`dbName and tableName is needed`)
        }
        await r.db(dbName).table(tableName).insert(data).run(this.conn)
    }

    async removeRow (dbName, tableName, id) {
        if (!dbName || !tableName || this.disConn()) {
            throw new Error(l`dbName and tableName is needed`)
        }
        await (r.db(dbName).table(tableName).get(id) as any).delete().run(this.conn)
    }

    async clearTable (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            throw new Error(l`dbName and tableName is needed`)
        }
        await r.db(dbName).table(tableName).delete().run(this.conn)
    }

    async editRow (dbName, tableName, data) {
        if (!dbName || !tableName || this.disConn()) {
            throw new Error(l`dbName and tableName is needed`)
        }
        const {id, ...other} = data
        if (!id) {
            throw new Error('edit row need id')
        }
        await (r.db(dbName).table(tableName).get(id) as any).update({...other}).run(this.conn)
    }

}

export default new Service()
