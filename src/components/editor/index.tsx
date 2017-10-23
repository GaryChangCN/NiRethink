import * as React from 'react'
import ReactJson from 'react-json-view'

import './editor.less'

class Editor extends React.Component<any, any> {
    static defaultProps = {
        type: 'view',
        data: ''
    }
    render () {
        const {data} = this.props
        return (
            <div className="editor-container">
                <pre className="view">
                    <ReactJson
                        src={data}
                        name="table"
                        enableClipboard={false}
                    />
                </pre>
            </div>
        )
    }
}

export default Editor
