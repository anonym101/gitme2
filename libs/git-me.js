`use strict`

/**
 * @GitMe
 * - install git repos via script
 */
module.exports = () => {
    const { spawnAsync, ondelete, sq, log, warn, onerror } = require('./utils')
    /** 
     * @param `opts.gitRepos:{}` provide list of repos, example setup as per GitInstall.exampleRepo
     * @param debug
    */
    return class GitMe {
        constructor(opts = {}, debug) {
            this.debug = debug
            this.gitRepos = opts.gitRepos || {}
        
            if (!Object.entries(this.gitRepos).length) throw (`must provide opts.gitRepos`)
        }

        static get exampleRepo() {

            return {
                // NOTE you can add `file:gits/rep-name` to your `package.json` to get intellisense when accessing require('rep-name')
                ['rep-name']: {
                    exec: `git clone git@rep-name`,  // git execution type
                    folder: `./gits/rep-name` // where to include this repo 
                },
                ['repName']: {
                    exec: `git clone git@repName`, 
                    folder: `./gits/repName`
                }
                // ,...
            }
        }

        /** 
         * - start installing your gits specified in `opts.gitRepos`, format must follow as per example in `GitMe.exampleRepo`
         * @returns results as promise array
        */
        async install() {
            const entries = Object.entries(this.gitRepos)
            const defs = entries.reduce((n, [key, value]) => {
                n[key] = sq() // assign promise
                return n
            }, {})

            for (let [key, value] of entries) {

                if(!await this.cleared(value)) {
                    warn(`ups repo ${key} didnt get deleted on time, skipping this instalation`)
                    continue
                }

                const folder = value.folder.replace("./","")
                log(`--- installing ${key}`)

                try {
                    const sp = await spawnAsync({
                        command: `${value.exec} ${folder}`,
                        name: key, folder: value.folder
                    }).catch(e=>{
                        defs[key].resolve(e)
                    })
                    if(sp) defs[key].resolve(sp)
                } catch (err) {
                    onerror(`project: ${key} did not install, error: `, err)
                    defs[key].resolve(err)
                    continue
                }
            }

            const pArr = Object.entries(defs).map(([k, value]) => value.promise())
            return Promise.all(pArr)
            // NOTE or handle like this
            // .then(z => {
            //     return z.map(z => {
            //         if (z.error) throw (z)
            //         else return z
            //     })
            // }, err => {
            //     onerror(err)
            //     return err
            // }).catch(err => {
            //     return err
            // })
        }

        /**
         * - when installing new clear old
         */
        cleared(repo = {}) {
          return ondelete(repo.folder)
        }
    }
}
