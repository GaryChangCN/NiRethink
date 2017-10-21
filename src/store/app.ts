import { action, autorun, observable, computed } from 'mobx'
import * as _ from 'lodash'
import { Position, Toaster, Intent, IToaster } from "@blueprintjs/core"

const OurToaster: IToaster = Toaster.create({
    className: "my-toaster",
    position: Position.TOP,
})


class App {
    @observable
    store = {
        alert: ''
    }

    toggleAlert (msg = '') {
        this.store.alert = msg
    }

    toaster (msg = '', PRIMARY: 'PRIMARY' | 'SUCCESS' | 'WARNING' | 'DANGER' = 'PRIMARY', timeout = 3000) {
        OurToaster.show({
            message: msg,
            intent: Intent[PRIMARY],
            timeout
        })
    }
}

const app = new App()

const handle = (err) => {
    let message
    if (err.type === 'unhandledrejection') {
        message = _.get(err, 'reason.message', JSON.stringify(err))
    }else if (err.type === 'error') {
        message = _.get(err, 'error.message', JSON.stringify(err))
    }else {
        message = JSON.stringify(err)
    }
    app.toggleAlert(message)
}

window.addEventListener('unhandledrejection', handle)
window.addEventListener('error', handle)

export default app
