`use strict`

/**
 * @GitInstall
 * - install git repos via script
 */
module.exports = () => {
    const { spawnAsync, ondelete, sq } = require('./utils')

    /** 
     * @param `opts.gitRepos:{}` provide list of repos, example setup as per GitInstall.exampleRepo
     * @param `opts.private:Boolean` if set will request via `ssh` otherwise `https`
    */
    return class GitInstaller {
        constructor(opts = {}) {
            this.gitRepos = opts.gitRepos || {}
            this.gitHostUrl = opts.gitHostUrl || ""
            this.private = opts.private || null // if private will use `ssh` else `https://`
            if (!Object.entries(this.gitRepos).length) throw (`must provide gitRepos`)
        }

        static get exampleRepo() {
            // NOTE `rep-name` 
            return {
                // NOTE you can add `file:gits/rep-name` to your `package.json` to get intelesence when accessing require('rep-name')
                ['rep-name']: {
                    exec: `git clone git@rep-name`,  // git execution type
                    folder: `./gits/rep-name` // where to include this repo 
                }
                // ,...
            }
        }

        async install() {
            const entries = Object.entries(this.gitRepos)
            const defs = entries.reduce((n, [key, value]) => {
                n[key] = sq() // assign promise
                return n
            }, {})

            for (let [key, value] of entries) {
                if(!await this.cleared(value)) {
                    console.log(`ups repo ${key} didnt get deleted on time, skipping this instalation`)
                    continue
                }
                const folder = value.folder.replace("./","")
                console.log(`--- installing ${key}`)
                const sp = await spawnAsync({ command: `${value.exec} ${folder}`, 
                                              name: key, folder: value.folder })
                defs[key].resolve(sp)
            }
            const pArr = Object.entries(defs).map(([k, value]) => value.promise())
            return Promise.all(pArr).then(z => {
                return z
            }).catch(err => {
                console.log('on install/err', err)
            })
        }

        /**
         * - when installing new clear old
         */
        cleared(repo = {}) {
          return ondelete(repo.folder)
        }
    }
}
