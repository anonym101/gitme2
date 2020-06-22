
/** 
 * few examples, not how to use
*/

GitInstallOne()
async function GitInstallOne(){
    const GitInstall = require('./index')()
    // GitInstall.exampleRepo << following this setup
    const opts = {
        gitRepos:{
            ['simple-q']: { 
                exec: `git clone git@eaglex_bitbucket:eag1ex/simple-q.git`,  // git execution type
                folder: `./gits/simple-q` // where to include this repo 
            },
            ['x-utils']: {
                exec: `git clone git@eaglex_bitbucket:eag1ex/x-utils.git`,  // git execution type
                folder: `./gits/x-units` // where to include this repo 
            },

            ['x-dispatcher']: {
                exec: `git clone git@eaglex_bitbucket:eag1ex/x-dispatcher.git`,  // git execution type
                folder: `./gits/x-dispatcher` // where to include this repo 
            },
        }
    }
    // git+ssh://git@eaglex_bitbucket:eag1ex/simple-q.git
    // x-units x-dispatcher
    const git = new GitInstall(opts)
   await git.install()
   // ready
}