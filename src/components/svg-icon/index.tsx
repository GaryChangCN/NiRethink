import * as React from 'react'

class Icon extends React.Component<any, any> {
    static defaultProps = {
        className: '',
        type: ''
    }
    render () {
        const {className, type} = this.props
        if (type === 'terminal') {
            return (
                <div className={`icon-container ${className}`}>
                    1
                </div>
            )
        }
        return ''
    }
}

export default Icon
