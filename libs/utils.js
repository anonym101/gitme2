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


/** 
 * spawn will install repo, then symlink it to `node_modules/project-name`
 * - to get intelesence add repo name to `package.json`, example :` "project-name":"file:gits/project-name" `
*/
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
                if (type === 'install') installed.reject({ kill: true, name, folder })
                if (type === 'link') linked.reject({ kill: true, name, folder })
            })
            .on('error', function () {

                if (type === 'install') installed.reject({ error: true, name, folder })
                if (type === 'link') linked.reject({ error: true, name, folder })

            }).on('message', (d) => {
                console.log('git/process message: ', d)
            }).stdout.pipe(process.stdout)

        if (type === 'install') return installed.promise()
        if (type === 'link') return linked.promise()
        else throw ('only type "link" and "install" are available')
    }

    try {
        let install
        if ((install = await execute('install')) && !install.success) throw (`install error for: ${install.name}`)
        const link = await execute('link', `npm link`) // wait for link, per each install

        if (!await directoryExists(install.folder)) throw (`doesnt exist, or invalid repo for: ${install.name}, check your "exec"`)
        return install
    } catch (error) {
        return Promise.reject({ error })
    }
}

exports.ondelete = async (name) => {
    if (!name) throw ('must specify name to delete')
    await del.promise([name], { force: true })
    await delay(100)
    if (!await directoryExists(name)) return true
    return false
}

exports.log = function (...args) {
    args = [].concat('[git-me]', args)
    console.log.apply(null, args)
}
exports.warn = function (...args) {
    args = [].concat('[git-me][warning]', args)
    console.warn.apply(null, args)
}
exports.onerror = function (...args) {
    args = [].concat('[git-me][error]', args)
    console.error.apply(null, args)
}
