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
                    <svg width="20px" height="17.152px" viewBox="0 0 1194 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#5c7080" d="M597.333333 682.666667h341.333334v85.333333H597.333333V682.666667zM341.333333 768l256-256-256-256-64 64L469.333333 512 277.333333 704 341.333333 768z m853.333334-682.666667v853.333334c0 46.933333-38.4 85.333333-85.333334 85.333333H85.333333c-46.933333 0-85.333333-38.4-85.333333-85.333333V85.333333c0-46.933333 38.4-85.333333 85.333333-85.333333h1024c46.933333 0 85.333333 38.4 85.333334 85.333333z m-85.333334 0H85.333333v853.333334h1024V85.333333z"  /></svg>
                </div>
            )
        }
        return ''
    }
}

export default Icon
