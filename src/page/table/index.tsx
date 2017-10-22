import * as React from 'react'
import {observer} from 'mobx-react'
import {parseSearch} from '../../lib/util'
import {Tooltip, Position, NumericInput} from '@blueprintjs/core'
import l from '../../lib/lang'
import * as Pagenation from 'react-paginate'
import Icon from '../../components/svg-icon'

import table from '../../store/table'
import Detail from '../../components/detail'
import Catelog from '../../components/catelog'

import './table.less'

@observer
class Tables extends React.Component<any, any> {
    componentDidMount () {
        const query = parseSearch(this.props.location.search)
        const {connectionName} = query
        table.change('connectionName', connectionName)
        table.viewDbList()
    }
    async componentWillUpdate (nextProps) {
        const query = parseSearch(this.props.location.search)
        const nextQuery = parseSearch(nextProps.location.search)
        if (query.connectionName !== nextQuery.connectionName) {
            table.change('connectionName', nextQuery.connectionName)
        }
    }

    renderRight () {
        const data = table.store.view
        const listLen = data.detail.list.length
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
                            <Tooltip content="Use javascript to query this table">
                                <Icon type="terminal" className="terminal"/>
                            </Tooltip>
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
            return (
                <div className="middle">
                    <Detail
                        list={data.detail.list}
                        indexList={data.detail.indexList}
                    />
                </div>
            )
        }
        return (
            <div className="right">
                <div className="top">
                    <div className="top-left">
                        <div className="bread">
                        </div>
                    </div>
                    <div className="top-right">
                        <Tooltip content={l`Show/Hide Index List`} position={Position.LEFT}>
                            <button
                                className="pt-button pt-small pt-icon-layout-hierarchy"
                                onClick={() => table.listIndex()}
                            ></button>
                        </Tooltip>
                    </div>
                </div>
                {renderMiddle()}
                {renderBottom()}
            </div>
        )
    }

    renderAdd () {
        const {selectTableIndex, selectDbIndex, dbList} = table.store.view
        let content
        let addDb = true
        if (selectDbIndex === '') {
            content = l`Add Database`
        }else {
            addDb = false
            content = `${l`Add Table To Database:`} ${dbList[selectDbIndex]}`
        }
        return (
            <Tooltip content={content} position={Position.TOP}>
                <div className="add-container" onClick={() => table.addDbOrTable(addDb)}>
                    <span className="pt-icon-standard pt-icon-plus"></span>
                </div>
            </Tooltip>
        )
    }

    render () {
        const data = table.store.view

        return (
            <div className="tables-container">
                <div className="left">
                    <Catelog
                        className = 'tree-container catelog-container'
                    />
                    {this.renderAdd()}
                </div>
                {this.renderRight()}
            </div>
        )
    }
}

export default Tables
