import * as React from 'react'
import ReactJson from 'react-json-view'

import './editor.less'

class Editor extends React.Component<any, any> {
    static defaultProps = {
        type: 'view',
        data: '',
        rootName: '',
        className: ''
    }
    render () {
        const {data, rootName, className} = this.props
        return (
            <div className={`editor-container ${className}`}>
                <pre className="view">
                    <ReactJson
                        src={data}
                        name={rootName}
                        enableClipboard={false}
                        collapseStringsAfterLength={80}
                    />
                </pre>
            </div>
        )
    }
}

export default Editor
