import * as React from 'react'
import Header from '../../components/header'
import {NODE_ENV} from '../../config'

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
                {NODE_ENV === 'development' ?
                <DevTools/> : ''}
            </div>
        )
    }
}

export default Main
