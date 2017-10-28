import * as React from 'react'
import Header from '../../components/header'

import './main.less'

class Main extends React.Component<any, any> {
    render () {
        return (
            <div className="main">
                <Header />
                <div className="content-viewport">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Main
