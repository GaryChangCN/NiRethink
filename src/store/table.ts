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
        // if (list.length > 0) {
        //     await this.handleClick(0)
        //     await this.handleClick(0, 'child')
        // }
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
                await this.freshTableList()
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
        }
    }

    async freshTableList () {
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
            const tableName = this.getTableName()
            const cb = async (msg) => {
                if (!msg) {
                    app.toaster(l`Table name should't be empty`, 'DANGER', 5000)
                    return
                }else {
                    await service.addTable(tableName, msg)
                    app.togglePrompt()
                    const selectDbIndex = this.store.view.selectTableIndex
                    await this.freshTableList()
                    app.toaster(l`Success`)
                }
            }
            app.togglePrompt({
                msg: l`New table name add to` + tableName,
                callBack: cb,
                value: '',
                intent: 'PRIMARY'
            })
            return
        }
    }
}

export default new Table()
