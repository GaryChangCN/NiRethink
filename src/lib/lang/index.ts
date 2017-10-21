import cn from './cn'

const l = (...arg) => {
    const char = arg[0]
    if (cn[char]) {
        return cn[char]
    }
    return char
}

export default l
