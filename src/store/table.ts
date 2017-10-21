import {observable} from 'mobx'
import * as _ from 'lodash'

import service from './service'

class Table {
    private defaultDetail = {
        total: 0,
        list: [],
        limit: 20,
        select: 0
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

    change (path, value) {
        _.set(this.store, path, value)
    }

    async viewDbList () {
        const list = await service.fetchDbList()
        this.store.view.dbList = list
        if (list.length > 0) {
            await this.handleClick(0)
            await this.handleClick(0, 'child')
        }
    }

    resetParent () {
        this.store.view.selectDbIndex = ''
        this.store.view.tableList = []
        this.resetChild()
    }

    resetChild () {
        this.store.view.detail = _.cloneDeep(this.defaultDetail)
    }

    async handleClick (index, type = 'parent') {
        // parent means database
        if (type === 'parent') {
            const dbName = this.store.view.dbList[index]
            if (index === this.store.view.selectDbIndex) {
                if (this.store.view.tableList.length > 0) {
                    this.store.view.tableList = []
                }else {
                    this.store.view.tableList = await service.fetchTableList(dbName)
                }
                return
            }
            this.resetParent()
            const list = await service.fetchTableList(dbName)
            this.store.view.selectDbIndex = index
            this.store.view.tableList = list
        }
        // child means table
        if (type === 'child') {
            this.resetChild()
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

    async changePageSelect (i?) {
        const select = i ? i.selected : this.store.view.detail.select
        const limit = this.store.view.detail.limit
        const skip = select * limit
        const dbName = this.store.view.dbList[this.store.view.selectDbIndex]
        const tableName = this.store.view.tableList[this.store.view.selectTableIndex]
        const list = await service.fetchDetailList(dbName, tableName, skip, limit)
        this.store.view.detail.list = list
        this.store.view.detail.select = select
    }

    async changeLimit (limit) {
        this.change('view.detail.limit', limit)
        this.changePageSelect()
    }
}

export default new Table()
