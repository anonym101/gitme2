`use strict`
const del = require('delete');
const { exec } = require('child_process')
const directoryExists = require('directory-exists');
const delay = (time = 10) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

const sq = function () {
    return new function () {
        const promises = {}
        let __deferSet = null
        const defer = new Promise((resolve, reject) => {
            promises['resolve'] = resolve
            promises['reject'] = reject
        })

        this.resolve = (data = null) => {
            if (__deferSet) return this // already set
            promises['resolve'](data)
            __deferSet = true
            return this
        }

        this.reject = (data = null) => {
            if (__deferSet) return this // already set
            promises['reject'](data)
            __deferSet = true
            return this
        }

        this.promise = () => defer
    }
}
exports.sq = sq

exports.spawnAsync = async ({ command, name, folder }) => {

    const installed = sq()
    const linked = sq()

    const execute = async (type = 'install', link = null) => {
        const cmd = link ? `${link} ${folder}` : command
        exec(cmd)
            .on('exit', async function () {
                await delay(100)
                if (type === 'install') installed.resolve({ success: true, name, folder })
                if (type === 'link') {
                    const f = folder.replace('./', "")
                    linked.resolve({ success: true, name, folder, message: `file linked, add:"file:${f}/${name}" to package.json dependancies` })
                }
            })
            .on('kill', function () {
                if (type === 'install') installed.reject({ kill: true, name })
                if (type === 'link') linked.reject({ kill: true, name, folder })
            })
            .on('error', function () {

                if (type === 'install') installed.reject({ error: true, name })
                if (type === 'link') linked.reject({ error: true, name, folder })

            }).on('message', (d) => {
                console.log('process on message', d)
            }).stdout.pipe(process.stdout)

        if (type === 'install') return installed.promise()
        if (type === 'link') return linked.promise()
        else throw ('only type "link" and "install" are available')
    }

    try {
        const install = await execute('install')
        const link = await execute('link', `npm link`) // wait for link, per each install
        return install
    } catch (err) {
        console.log(err)
        return Promise.reject(err)
    }
}

exports.ondelete = async (name) => {

    if (!name) {
        throw ('must specify name to delete')
    }
    await del.promise([name], { force: true })
    await delay(100)
    if (!await directoryExists(name)) return true
    return false
}
