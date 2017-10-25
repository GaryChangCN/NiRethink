import {observable, computed} from 'mobx'
import * as _ from 'lodash'
import l from '../lib/lang'

import service from './service'
import app from './app'

class Table {
    private defaultDetail = {
        total: 0,
        list: [],
        limit: 20,
        select: 0,
        indexList: {}
    }

    @observable
    store = {
        connectionName: '',
        view: {
            dbList: [],
            tableList: [],
            selectDbIndex: '', // '' | number as  index
            selectTableIndex: '',
            detail: _.cloneDeep(this.defaultDetail)
        },
    }

    private getDbName () {
        return this.store.view.dbList[this.store.view.selectDbIndex]
    }

    private getTableName () {
        return this.store.view.tableList[this.store.view.selectTableIndex]
    }

    change (path, value) {
        _.set(this.store, path, value)
    }

    async viewDbList () {
        const list = await service.fetchDbList()
        this.store.view.dbList = list
        // console.log()
        if (list.length > 0) {
            await this.handleCatelog(3)
            await this.handleCatelog(0, 'child')
        }
    }

    reset (type) {
        if (type === 'parent') {
            this.store.view.tableList = []
            this.store.view.selectDbIndex = ''
            this.reset('child')
            return
        }
        if (type === 'child') {
            this.store.view.selectTableIndex = ''
            this.store.view.detail = _.cloneDeep(this.defaultDetail)
        }
    }

    // change click catelog
    async handleCatelog (index, type = 'parent') {
        // parent means database
        if (type === 'parent') {
            if (index === this.store.view.selectDbIndex) {
                this.reset('parent')
            }else {
                this.reset('parent')
                this.store.view.selectDbIndex = index
                await this.viewTableList()
            }
            return
        }
        // child means table
        if (type === 'child') {
            this.reset('child')
            const dbName = this.store.view.dbList[this.store.view.selectDbIndex]
            const tableName = this.store.view.tableList[index]
            const limit = this.store.view.detail.limit
            const list: any[] = await service.fetchDetailList(dbName, tableName, 0, limit)
            const total = await service.fetchDetailTotal(dbName, tableName)
            this.store.view.selectTableIndex = index
            this.store.view.detail.list = list
            this.store.view.detail.total = total
            return
        }
        // add means add table
        if (type === 'add') {
            await this.addDbOrTable(false)
        }
    }

    async viewTableList () {
        const dbName = this.getDbName()
        const list = await service.fetchTableList(dbName)
        this.store.view.tableList = list
        if (list.length === 0 ) {
            app.toaster(l`This database is empty`)
        }
    }

    async changePageSelect (i?) {
        const select = i ? i.selected : this.store.view.detail.select
        const limit = this.store.view.detail.limit
        const skip = select * limit
        const dbName = this.getDbName()
        const tableName = this.getTableName()
        const list = await service.fetchDetailList(dbName, tableName, skip, limit)
        this.store.view.detail.list = list
        this.store.view.detail.select = select
    }

    async changeLimit (limit) {
        this.change('view.detail.limit', limit)
        this.changePageSelect()
    }

    async listIndex () {
        if (Object.keys(this.store.view.detail.indexList).length > 0) {
            this.store.view.detail.indexList = {}
            return
        }
        const dbName = this.getDbName()
        const tableName = this.getTableName()
        const list = await service.fetchDetailIndex(dbName, tableName)
        if (list.length === 0) {
            app.toaster(l`No index in the table`)
            return
        }
        const obj: {
            [key: string]: boolean
        } = {}
        for (const key of list) {
            obj[key] = true
        }
        this.store.view.detail.indexList = obj
    }

    async addDbOrTable (addDb: boolean) {
        if (addDb) {
            const cb = async (msg) => {
                if (!msg) {
                    app.toaster(l`Database name should't be empty`, 'DANGER', 5000)
                    return
                }else {
                    await service.addDatabase(msg)
                    app.togglePrompt()
                    await this.viewDbList()
                    app.toaster(l`Success`)
                }
            }
            app.togglePrompt({
                msg: l`New database name`,
                callBack: cb,
                value: '',
                intent: 'PRIMARY'
            })
            return
        }else {
            const dbName = this.getDbName()
            const cb = async (msg) => {
                if (!msg) {
                    app.toaster(l`Table name should't be empty`, 'DANGER', 5000)
                    return
                }else {
                    if (!/^[A-Za-z0-9_]+$/.test(msg)) {
                        app.toaster(l`Table name A-Za-z0-9_ only`, 'DANGER', 5000)
                        return
                    }
                    await service.addTable(dbName, msg)
                    app.togglePrompt()
                    await this.viewTableList()
                    app.toaster(l`Success`)
                }
            }
            app.togglePrompt({
                msg: l`New table name add to` + ' ' + dbName,
                callBack: cb,
                value: '',
                intent: 'PRIMARY'
            })
            return
        }
    }

    async dropDbOrTable (i, j?) {
        const dbName = this.store.view.dbList[i]
        if (j > -1) {
            // drop table
            const tableName = this.store.view.tableList[j]
            const cb = async () => {
                await service.dropTable(dbName, tableName)
                app.toggleConfirm()
                await this.viewTableList()
                app.toaster(l`Success`)
            }
            app.toggleConfirm({
                msg: l`DELELE table` + ': ' + tableName + '?',
                callBack: cb,
                intent: 'DANGER'
            })
            return
        }else {
            // drop database
            const cb = async () => {
                await service.dropDatabase(dbName)
                app.toggleConfirm()
                await this.viewDbList()
                app.toaster(l`Success`)
            }
            app.toggleConfirm({
                msg: l`DELELE database` + ': ' + dbName + '?',
                callBack: cb,
                intent: 'DANGER'
            })
            return
        }
    }

    async insertRow (data) {
        const dbName = this.getDbName()
        const tableName = this.getTableName()
        let json
        try {
            json = JSON.parse(data)
        } catch (error) {
            app.toaster(l`Illegal JSON`, 'DANGER', 5000)
            return false
        }
        if (typeof json !== 'object') {
            app.toaster(l`Only support insert object to this table`, 'DANGER', 3000)
            return false
        }
        await service.insertTable(dbName, tableName, json)
        app.toaster(l`Success`)
        await this.handleCatelog(this.store.view.selectTableIndex, 'child')
        return true
    }

    async removeRow (id) {
        await service.removeRow(this.getDbName(), this.getTableName(), id)
        this.handleCatelog(this.store.view.selectTableIndex, 'child')
        app.toaster(l`Success`, 'SUCCESS')
    }

    async editRow (data, oldData) {
        let newData
        try {
            newData = JSON.parse(data)
        } catch (error) {
            app.toaster(l`Illegal JSON`, 'DANGER', 5000)
            return false
        }
        if (newData.id !== oldData.id) {
            app.toaster(l`Can't change id! Use old id as default.`, 'PRIMARY', 4000)
            newData.id = oldData.id
        }
        await service.editRow(this.getDbName(), this.getTableName(), newData)
        this.handleCatelog(this.store.view.selectTableIndex, 'child')
        app.toaster(l`Success`, 'SUCCESS')
        return true
    }
}

export default new Table()
