const kit = require('nokit')

module.exports = (task, option) => {
    task('default', ['dev'], 'default task', () => {
        kit.log('\n>>>>>>> start >>>>>>>\n')
    })

    task('tsc-w', 'watch typescript', (opt) => {
        const args = [
            './src/index.tsx',
            '-w',
            '--lib',
            'es2015,dom',
            '--jsx',
            'react',
            '--experimentalDecorators',
            'true'
        ]
        kit.spawn('./node_modules/typescript/bin/tsc', args, {
            prefix: 'TSC | :blue'
        })
    })

    task('check-dev', kit.async(function * () {
        let ret = yield kit.exec('git rev-parse --abbrev-ref HEAD')
        if (ret.stdout === 'master\n') {
            throw new Error(kit.log('git should be on dev branch'))
            process.exit()
        }
    }))

    task('tsc-p', 'typescript compile', kit.async(function * (opt) {
        const args = [
            '-p',
            './tsconfig.json'
        ]
        yield kit.spawn('./node_modules/typescript/bin/tsc', args, {
            prefix: 'TSC | :blue'
        })
    }))

    task('template', 'render-template', kit.async(function * () {
        yield kit.exec('node ./config/template.js')
    }))

    task('dev', ['check-dev', 'tsc-w', 'template', 'electron'], 'webpack-dev-server', (opt) => {
        kit.spawn('./node_modules/webpack-dev-server/bin/webpack-dev-server.js', [
            '--progress',
            '--hot',
            '--info',
            'false',
            '--config',
            './config/dev.config.js'
        ], {
            prefix: 'WEB | :green'
        })
    })

    task('electron', 'electron', () => {
        kit.spawn('./node_modules/electron/cli.js', ['.'], {prefix: 'Electron | :blue'})
    })

    task('build', ['tsc-p'], 'build', kit.async(function * (opt) {
        const config = opt.config || 'prod'
        kit.log(`\n>>>>>>>> build >>>>>>>>>>>\n`)
        yield kit.spawn('./node_modules/webpack/bin/webpack.js', [
            '--progress',
            '--config',
            './config/prod.config.js'
        ], {
            prefix: 'BUILD | :black'
        })
    }))
}
