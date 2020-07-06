Install `Git repos` using a script. This app installs gits from an array, and places them in desired location. After each installation, `npm link` is performed on a repo so make sure it is an npm package.  After you can add it to your `package.json` for intellisense _(`"rep-name":"file:gits/rep-name"`)_.
&nbsp;
&nbsp;



### Install
```shell
$ npm i gitme2
```
&nbsp;
&nbsp;



### Why use it ?
* Install private gits
* Automation of git installs
* Not an npm public repo.
* Add to `preinstall` script
* Call it on specific `process.env`
* Npm module wont install? Use the git repo and then npm link it as local!
&nbsp;
&nbsp;



### Example usage:
More examples in `./example.js`

```js
 const GitMe = require('gitme2')()

    /** 
     * GitMe.exampleRepo << following this setup
     * recommendations: `do not include your "GitMe installs" in the same dir as your project!, treat it as ./local_node_modules or ./gits` for example.
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
    // const relinked = await git.relink() // if npm syslink got missing, try to relink them 
```
&nbsp;
&nbsp;



### API

|METHODS                |RETURN                          |DESCRIPTION                         |
|----------------|-------------------------------|-----------------------------|
|install() | `promise` |Start installing gitRepos, return results after all complete, or return errors |
|relink() | `promise` |when already installed, your repos and syslink got missing? You can use it to relink them! |
&nbsp;
&nbsp;




### Contact
Have questions, or would like to submit feedback, [contact eaglex](https://eaglex.net/app/contact?product=gitme2)


