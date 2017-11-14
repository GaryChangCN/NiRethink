const kit = require('nokit')

module.exports = (task, option) => {
    option('-p, --platform <darwin | windows>', 'package for platform')

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
        yield kit.spawn('./node_modules/.bin/tsc', args, {
            prefix: 'TSC | :blue'
        })
    }))

    task('template-dev', 'render-template-dev', kit.async(function * () {
        yield kit.exec('node ./config/template.js development')
    }))

    task('template-prod', 'render-template-prod', kit.async(function * () {
        yield kit.exec('node ./config/template.js production')
    }))

    task('dev', ['check-dev', 'tsc-w', 'template-dev', 'electron'], 'run in development', (opt) => {
        kit.spawn('./node_modules/.bin/webpack-dev-server', [
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

    task('electron', 'open electron in dev model', () => {
        kit.spawn('./node_modules/.bin/electron', ['.', 'development'], {prefix: 'Electron | :blue'})
    })

    task('build', ['tsc-p', 'template-prod'], 'build app to dist', kit.async(function * (opt) {
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

    task('production', ['build'], 'run in production', kit.async(function * () {
        kit.log(`\n>>>>>>>> start electron >>>>>>>>>>>\n`)
        yield kit.spawn('./node_modules/.bin/electron', ['.', 'production'], {prefix: 'Electron | :blue'})
    }))

    task('package', ['build'], 'package to macos app', kit.async(function * (opt) {
        const platform = opt.platform || 'darwin'
        kit.log(`\n>>>>>>>> package >>>>>>>>>>>\n`)
        yield kit.spawn('./node_modules/.bin/electron-packager', [
            '.',
            'NiRethink',
            '--platform',
            platform,
            '--out',
            './build',
            '--icon',
            './src/assets/nirethink.icns',
            '--overwrite'
        ])
    }))
}
