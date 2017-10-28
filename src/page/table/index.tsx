import * as React from 'react'
import {observer} from 'mobx-react'
import {parseSearch} from '../../lib/util'
import {Tooltip, Position, NumericInput, Dialog, EditableText} from '@blueprintjs/core'
import l from '../../lib/lang'
import * as Pagenation from 'react-paginate'
import Icon from '../../components/svg-icon'
import history from '../../lib/history'

import table from '../../store/table'
import service from '../../store/service'
import Detail from '../../components/detail'
import Catelog from '../../components/catelog'
import Editor from '../../components/editor'

import './table.less'

@observer
class Tables extends React.Component<any, any> {
    oldData: any = ''
    constructor (props) {
        super(props)
        this.state = {
            viewType: 'table',
            dialog: {
                type: 'add',
                value: '',
                open: false
            }
        }
    }

    async componentDidMount () {
        const query = parseSearch(this.props.location.search)
        const {connectionName} = query
        if (!connectionName) {
            history.replace('/add-conn')
            return
        }
        const ret = await service.connect(connectionName)
        if (!ret) {
            history.replace('/add-conn')
            return
        }
        table.change('connectionName', connectionName)
        table.viewDbList()
    }

    async componentWillUnmount () {
        table.change('connectionName', '')
        await service.close()
    }

    async componentWillUpdate (nextProps) {
        const query = parseSearch(this.props.location.search)
        const nextQuery = parseSearch(nextProps.location.search)
        if (!query.connectionName) {
            history.replace('/add-conn')
            return
        }
        if (query.connectionName !== nextQuery.connectionName) {
            await service.connect(nextQuery.connectionName)
            table.change('connectionName', nextQuery.connectionName)
            table.viewDbList()
        }
    }

    toggleDialog (open = false, value = '', type = 'add') {
        const dialog = {type, value, open}
        this.setState({dialog})
    }

    async submitDialog () {
        const {dialog} = this.state
        if (dialog.type === 'add') {
            const ret = await table.insertRow(dialog.value)
            if (!ret) {
                return
            }
            this.toggleDialog()
            return
        }
        if (dialog.type === 'edit') {
            const ret = await table.editRow(dialog.value, this.oldData)
            if (!ret) {
                return
            }
            this.oldData = ''
            this.toggleDialog()
        }
    }

    changeDialog (value) {
        const {dialog} = this.state
        dialog.value = value
        this.setState({dialog})
    }

    handleEditRow (data) {
        this.oldData = data
        this.setState({
            dialog: {
                type: 'edit',
                value: JSON.stringify(data, null, 4),
                open: true
            }
        })
    }

    renderRight () {
        const data = table.store.view
        const listLen = data.detail.list.length
        const {viewType} = this.state
        if (listLen === 0 && data.selectTableIndex === '') {
            return (
                <div className="pt-non-ideal-state">
                    <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
                        <span className="pt-icon pt-icon-box"></span>
                    </div>
                    <h4 className="pt-non-ideal-state-title">{l`No table has selected`}</h4>
                    <div className="pt-non-ideal-state-description">
                        {l`Select table from left category`}
                    </div>
                </div>
            )
        }
        const tableName = data.tableList[data.selectTableIndex]
        const renderBottom = () => {
            if (listLen === 0) {
                return (
                    <div className="bottom"></div>
                )
            }
            return (
                <div className="bottom">
                    <div className="tool-box">
                        <div className="limit">
                            <div className="number-container">
                                <NumericInput
                                    stepSize={5}
                                    min={20}
                                    className="pt-small pt-fill"
                                    max={100}
                                    value={data.detail.limit}
                                    onValueChange={limit => table.changeLimit(limit)}
                                />
                            </div>
                            <div className="label">
                            {l`Rows`} / {l`Page`}
                            </div>
                        </div>
                        <div className="box">
                        </div>
                    </div>
                    <div className="page-container">
                        <Pagenation
                            pageCount={Math.ceil(data.detail.total / data.detail.limit)}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            disableInitialCallback={true}
                            onPageChange={i => table.changePageSelect(i)}
                            initialPage={data.detail.select}
                            forcePage={data.detail.select}
                            pageClassName="pt-button pt-small"
                            previousLabel=""
                            nextLabel=""
                            previousLinkClassName="pt-button pt-small pt-icon-arrow-left"
                            nextLinkClassName="pt-button pt-small pt-icon-arrow-right"
                            activeClassName="pt-active"
                        />
                    </div>
                </div>
            )
        }
        const renderMiddle = () => {
            if (listLen === 0) {
                return (
                    <div className="middle middle-empty">
                        <div className="pt-non-ideal-state">
                            <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
                                <span className="pt-icon pt-icon-full-stacked-chart"></span>
                            </div>
                            <h4 className="pt-non-ideal-state-title">{l`This table is empty`}</h4>
                            <div className="pt-non-ideal-state-description">
                                {l`You can add new rows through the buttons above`}
                            </div>
                        </div>
                    </div>
                )
            }
            const detailList: any = data.detail.list
            return (
                <div className="middle">
                    {viewType === 'table' ?
                    <Detail
                        list={detailList.peek()}
                        indexList={data.detail.indexList}
                        onRemoveRow={id => table.removeRow(id)}
                        onEditRow={datas => this.handleEditRow(datas)}
                    /> : <Editor
                        type='view'
                        data={detailList.peek()}
                        rootName={tableName}
                    />}
                </div>
            )
        }
        const renderTop = () => {
            const isListEmpty = listLen === 0
            return (
                <div className="top">
                    <div className="top-left">
                        <Tooltip content={l`Add row`} position={Position.BOTTOM}>
                            <button
                                className="pt-button pt-small pt-icon-plus"
                                onClick={() => this.toggleDialog(true, '', 'add')}
                            >
                            </button>
                        </Tooltip>
                        <Tooltip content={l`Refresh table`} position={Position.BOTTOM}>
                            <button
                                className="pt-button pt-small pt-icon-refresh fresh-button"
                                onClick={() => table.handleCatelog(data.selectTableIndex, 'child')}
                            >
                            </button>
                        </Tooltip>
                        <Tooltip content={l`Clear table`} position={Position.BOTTOM}>
                            <button
                                className="pt-button pt-small pt-icon-delete"
                                onClick={() => table.clearTable()}
                                disabled={isListEmpty}
                            >
                            </button>
                        </Tooltip>
                    </div>
                    <div className="top-center">
                        <div className="pt-button-group">
                            <Tooltip
                                content={l`View as table`}
                                position={Position.BOTTOM}
                            >
                                <a
                                    className={`pt-button pt-icon-th ${viewType === 'table' ? 'pt-active' : ''}`}
                                    role="button"
                                    onClick={() => this.setState({viewType: 'table'})}
                                ></a>
                            </Tooltip>
                            <Tooltip
                                content={l`View as tree`}
                                position={Position.BOTTOM}
                            >
                                <a
                                    // tslint:disable-next-line:max-line-length
                                    className={`pt-button pt-icon-fast-backward tree-icon ${viewType === 'tree' ? 'pt-active' : ''}`}
                                    role="button"
                                    onClick={() => this.setState({viewType: 'tree'})}
                                ></a>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="top-right">
                        <Tooltip content={l`Show/Hide Index List`} position={Position.LEFT}>
                            <button
                                className="pt-button pt-small pt-icon-layout-hierarchy"
                                onClick={() => table.listIndex()}
                                disabled={isListEmpty || viewType !== 'table'}
                            ></button>
                        </Tooltip>
                    </div>
                </div>
            )
        }
        return (
            <div className="right">
                {renderTop()}
                {renderMiddle()}
                {renderBottom()}
            </div>
        )
    }

    renderAddDatabse () {
        return (
            <Tooltip content={l`Add Database`} position={Position.TOP}>
                <div className="add-container" onClick={() => table.addDbOrTable(true)}>
                    <span className="pt-icon-standard pt-icon-plus"></span>
                </div>
            </Tooltip>
        )
    }

    render () {
        const data = table.store.view
        const {dialog} = this.state
        return (
            <div className="tables-container">
                <div className="left">
                    <Catelog
                        className = 'tree-container catelog-container'
                    />
                    {this.renderAddDatabse()}
                </div>
                {this.renderRight()}
                <Dialog
                    iconName="edit"
                    className="add-edit-dialog"
                    isOpen={dialog.open}
                    title={dialog.type === 'add' ? l`Add new row` : l`Edit this row`}
                    onClose={() => this.toggleDialog()}
                >
                    <div className="editable-container">
                        <EditableText
                            maxLines={25}
                            multiline={true}
                            minLines={3}
                            value={dialog.value}
                            onChange={value => this.changeDialog(value)}
                        />
                    </div>
                    <div className="control">
                        <button
                            className="pt-button"
                            onClick={() => this.toggleDialog()}
                        >{l`Cancel`}</button>
                        <button
                            className="pt-button pt-intent-primary"
                            onClick={() => this.submitDialog()}
                        >{l`Ok`}</button>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default Tables
