import { action, autorun, observable, computed } from 'mobx'
import * as _ from 'lodash'
import { Position, Toaster, Intent, IToaster } from "@blueprintjs/core"

const OurToaster: IToaster = Toaster.create({
    className: "my-toaster",
    position: Position.TOP,
})

interface Prompt {
    value: string
    callBack: (msg?: string) => void
    msg: string
    intent: 'PRIMARY' | 'DANGER' | 'WARNING'
}

interface Confirm {
    callBack: () => void
    msg: string
    intent: 'PRIMARY' | 'DANGER' | 'WARNING'
}

class App {
    private defaultPrompt: Prompt = {
        value: '',
        callBack: _.noop,
        msg: '',
        intent: 'PRIMARY'
    }

    private defaultConfirm: Confirm = {
        msg: '',
        callBack: _.noop,
        intent: 'PRIMARY'
    }

    @observable
    store = {
        alert: '',
        prompt: _.cloneDeep(this.defaultPrompt),
        confirm: _.cloneDeep(this.defaultConfirm),
        showBack: false
    }

    toaster (msg = '', PRIMARY: 'PRIMARY' | 'SUCCESS' | 'WARNING' | 'DANGER' = 'PRIMARY', timeout = 3000) {
        OurToaster.show({
            message: msg,
            intent: Intent[PRIMARY],
            timeout
        })
    }

    change (path, value) {
        _.set(this.store, path, value)
    }

    togglePrompt (prompt?: Prompt) {
        if (!prompt) {
            this.store.prompt = _.cloneDeep(this.defaultPrompt)
            return
        }
        prompt.value = prompt.value || ''
        this.store.prompt = prompt
    }

    toggleConfirm (confirm?: Confirm) {
        if (!confirm) {
            this.store.confirm = _.cloneDeep(this.defaultConfirm)
            return
        }
        this.store.confirm = confirm
    }
}

const app = new App()

const handle = (err) => {
    let message
    if (err.type === 'unhandledrejection') {
        message = _.get(err, 'reason.message', JSON.stringify(err))
    } else if (err.type === 'error') {
        message = _.get(err, 'error.message', JSON.stringify(err))
    } else {
        message = JSON.stringify(err)
    }
    app.toaster(message, 'DANGER')
}

window.addEventListener('unhandledrejection', handle)
window.addEventListener('error', handle)

export default app
