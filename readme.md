### GitMe2
Install your `Git repos` using a script (make sure it includes `package.json` of your project). This Project installs gits from an array and place them in desired location. After each installation, `npm link` is performed on each repo so make sure it is an npm package. There after you can add it to your `package.json` for intellisense, example: `"rep-name":"file:gits/rep-name"`, so then `require('rep-name')` will get picked up by your `CLI`.


### Install
- `npm i gitme2`

#### Why use it ?
- Install private gits
- Automation of git installations
- Not an npm public repo.
- Add to `preinstall` script
- Call it on specific `process.env`

#### Examples:
- more examples avaialble in `example.js`

#### Example usage:

```

 const GitMe = require('./index')()

    /** 
     * GitMe.exampleRepo << following this setup
     * recommendations: `do not include your "GitMe installs" in the same dir as your project!, treat it as ./local_node_modules or ./gits`
    */
    const opts = {
        gitRepos: {

            // replace with existing repositories !
            ['projectName']: {
                exec: `git clone git@bitbucket.org/authourName/projectName.git`, 
                folder: `./gits/projectName` 
            },

            ['projectName2']: {
                exec: `git clone https://github.com/authourName/projectName2.git`,  
                folder: `./gits/projectName2` 
            },
            // and so on
        }
    }

    const git = new GitMe(opts)
    const results = await git.install()

```


##### Contact
* Have questions, or would like to submit feedback, `contact on: https://eaglex.net/app/contact?product=gitme2`


