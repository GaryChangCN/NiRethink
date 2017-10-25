import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {webFrame} from 'electron'

import 'normalize.css'
import '@blueprintjs/core/dist/blueprint.css'

import Index from './page'

webFrame.setZoomLevelLimits(1, 1)

ReactDOM.render(<Index/>, document.getElementById('app'))

