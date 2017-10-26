import * as React from 'react'
import Header from '../../components/header'

import './main.less'

import DevTools from 'mobx-react-devtools'

class Main extends React.Component<any, any> {
    render () {
        return (
            <div className="main">
                <Header />
                <div className="content-viewport">
                    {this.props.children}
                </div>
                {process.env.NODE_ENV === 'development' ?
                <DevTools/> : ''}
            </div>
        )
    }
}

export default Main
