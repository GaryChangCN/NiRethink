import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {webFrame, remote} from 'electron'

import '@blueprintjs/core/dist/blueprint.css'

import 'normalize.css/normalize.css'
import Index from './page'

webFrame.setZoomLevelLimits(1, 1)

ReactDOM.render(<Index/>, document.getElementById('app'))
