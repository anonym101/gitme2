
/** 
 * few examples, not how to use
*/

GitMeOne()
async function GitMeOne() {
    
    const GitMe = require('./index')()

    /** 
     * GitMe.exampleRepo << following this setup
     * recommendations: `do not include your "GitMe installs" in the same dir as your project!, treat it as ./local_node_modules or ./gits`
    */
    const opts = {
        gitRepos: {

            ['projectName']: {
                exec: `git clone git@bitbucket.org/authourName/projectName.git`, 
                folder: `./gits/projectName` 
            },

            ['projectName2']: {
                exec: `git clone https://github.com/authourName2/projectName2.git`,  
                folder: `./gits/projectName2` 
            },
            // and so on
        }
    }

    const git = new GitMe(opts)
    const results = await git.install()
    console.log('GitMe/results',results)
}
