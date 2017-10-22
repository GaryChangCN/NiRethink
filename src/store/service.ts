import * as r from 'rethinkdb'
import * as _ from 'lodash'
import history from '../lib/history'
import app from './app'
import l from '../lib/lang'

class Service {
    conn = null
    collect = {}

    async add (view) {
        const data = _.cloneDeep(view)
        while (true) {
            if (this.collect.hasOwnProperty(data.connectionName)) {
                data.connectionName = data.connectionName + '_'
            }else {
                break
            }
        }
        const {connectionName, ...other} = data
        this.collect[data.connectionName] = {...other}
        await this.connect(connectionName)
        return connectionName
    }

    async connect (connectionName) {
        const data = this.collect[connectionName]
        try {
            const conn = await r.connect(data)
            this.conn = conn
            return
        } catch (error) {
            throw error
        }
    }

    disConn () {
        if (!this.conn) {
            console.log('------disconn------')
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
        try {
            return await r.dbList().run(this.conn)
        } catch (error) {
            throw new Error(error)
        }
    }

    async fetchTableList (dbName) {
        if (this.disConn()) {
            return []
        }
        try {
            return await r.db(dbName).tableList().run(this.conn)
        } catch (error) {
            throw new Error(error)
        }
    }

    async fetchDetailList (dbName, tableName, skip = 0, limit = 20) {
        if (!dbName || !tableName || this.disConn()) {
            return []
        }
        try {
            const list: any[] = await (r.db(dbName)
                .table(tableName).skip(skip)
                .limit(limit) as any).coerceTo('array').run(this.conn)
            return list
        } catch (error) {
            throw new Error(error)
        }
    }

    async fetchDetailTotal (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            return 0
        }
        try {
            const total: number = await r.db(dbName).table(tableName).count().run(this.conn)
            return total
        } catch (error) {
            throw new Error(error)
        }
    }

    async fetchDetailIndex (dbName, tableName) {
        if (!dbName || !tableName || this.disConn()) {
            return []
        }
        try {
            const list = await r.db(dbName).table(tableName).indexList().run(this.conn)
            return list
        } catch (error) {
            throw new Error(error)
        }
    }

    async addDatabase (dbName) {
        if (!dbName || this.disConn()) {
            return null
        }
        try {
            await r.dbCreate(dbName).run(this.conn)
        } catch (error) {
            throw new Error(error)
        }
    }

}

export default new Service()
