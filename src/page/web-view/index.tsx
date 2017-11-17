import * as React from 'react'
import * as _ from 'lodash'
import app from '../../store/app'
import './web-view.less'

const LOCALPRE = 'http://127.0.0.1:'

class Web extends React.Component<any, any> {
    debounce: any
    constructor (props) {
        super(props)
        this.debounce = _.debounce(this.changeSrc, 600)
        this.state = {
            value: LOCALPRE + '8080'
        }
    }

    changeSrc (port: number) {
        const web = document.getElementById('webview') as HTMLIFrameElement
        web.src = LOCALPRE + port
    }

    handleChange (value) {
        if (!_.startsWith(value, LOCALPRE)) {
            this.setState({
                value: LOCALPRE
            })
            return
        }
        if (value.legth < 17) {
            this.setState({
                value: LOCALPRE
            })
            return
        }
        // tslint:disable-next-line:no-bitwise
        const port = ~~ value.split(':')[2]
        if (port > 0 && port <= 65535) {
            this.setState({
                value
            })
            this.debounce(port)
            return
        }
        this.setState({
            value: LOCALPRE
        })
    }

    render () {
        return (
            <div className="web-view-control">
                <input
                    type="text"
                    value={this.state.value}
                    onChange={e => this.handleChange(e.target.value)}
                />
            </div>
        )
    }

    componentDidMount () {
        app.change('showBack', true)
        const id = "webview-wrap"
        const webView = document.getElementById(id)
        const html = `<webview
            id="webview"
            src="${LOCALPRE}8080"
            style="
                position: fixed;
                width: 100%;
                top: 50px;
                height: 100%;
            "
        >
        </webview>`
        if (webView) {
            webView.innerHTML = html
            return
        }
        const div = document.createElement('div')
        div.id = id
        div.innerHTML = html
        document.body.appendChild(div)
    }
    componentWillUnmount () {
        app.change('showBack', false)
        const webView = document.getElementById("webview-wrap")
        webView.removeChild(webView.firstChild)
    }
}

export default Web
