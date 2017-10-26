const fs = require('fs')
const path = require('path')

const env = process.argv[2] || 'development'

let scripts = []
let styles = []

if (env === 'development') {
    scripts = [
        '<script src="http://127.0.0.1:9900/bundle.js"></script>'
    ] 
}

if (env === 'production') {
    scripts = [
        '<script src="./bundle.js"></script>'
    ]
    styles = [
        '<link rel="stylesheet" href="./styles.css">'
    ]
}


let template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>NiRethink</title>
    ${styles.join('\n')}
</head>
<body>
    <div id="app"></div>
</body>
${scripts.join('\n')}
</html>
`

const main = () => {
    try {
        const distDir = path.resolve(__dirname, '../dist')

        const writeFile = () => {
            fs.writeFile(path.resolve(distDir, './index.html'), template, err => {
                if (err) {
                    throw err
                }
                process.exit(0)
            })
        }

        fs.stat(distDir, (err, stats) => {
            if (err) {
                fs.mkdir(distDir, err => {
                    if (err) {
                        throw err
                    }
                    writeFile()
                })
            }else {
                writeFile()
            }
        })
        
    } catch (error) {
        console.error(error)
    }
}

main()
