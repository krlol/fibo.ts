/* 

karlol.ts - Firebase, firestore, React Native and ReactJS CRUD Ecosystem builder in TypeScript 💚.

karlo@karlol.com

*/
const config = require('./config.json');
const package = require('./package.json');
const fs = require('fs');
const { exec } = require('node:child_process')
const fse = require('fs-extra');

const printSignature = () => {
    return console.log(`
    ┌──────────────────────────────┐
    │     karlol.js Boilerplate    │
    │         - TypeScript         │
    │- Firebase Hosting & Functions│
    │        - React Native        │
    │   - ReactJS and/or Next.js   │
    │                              │
    │  contact: karlo@karlol.com   │
    │                              │
    │  Hope you're building cool   │
    │  stuff with this software.   │
    │                              │
    └──────────────────────────────┘
    v${package.version}
    `)
}

/*

    To-Do list
        - separate this, from project - karlo.js should be an isolated project that can be upgraded and that kind of stuff.
        - handle custom folder name structure

*/

// const askQuestion = (qs) => {
//     return new Promise((resolve)=>{
//         readline.question(qs, name => {
//             resolve(name)
//             readline.close();
//         });
//     })
// }

/*
var twirlTimer = (function() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 250);
})();
*/

const checkYesNo = (toCheck) => {
    var res = false;
    const yesAleternatives = ['yes', 'y'];
    yesAleternatives.forEach((ya)=>{
        if(toCheck.toLowerCase() === ya){
            res = true;
        }
    })
    return res;
}

const getMissingRepos = () => {
    var proms = []
    var reposToInstall = []
    var toCheck = [];
    toCheck.push(config.admin)
    toCheck.push(config.core)
    toCheck.push(config.firebase)
    toCheck.push(config.reactNative)
    toCheck.forEach((repo)=>{
        // directory to check if exists
        const dir = `../${repo.name}`;
        proms.push(new Promise((resolve)=>{
            // check if directory exists
            fs.access(dir, async (err) => {
                const required = (repo.required === true || repo.required === undefined)
                if(err && required){
                    //does not exist
                    console.error(`${repo.name} repo ❌ doesn't exist and it's required...`);
                    if(required === true){
                        reposToInstall.push(repo);
                    }               
                }else{
                    //exists
                    console.log(`${repo.name} repo exists or is not required ✅`);
                }
                return resolve(true);
            })
        }))
    })
    console.log(`Should install ${reposToInstall.length} repos.`)
    return Promise.all(proms);
}

const start = () => {
    return new Promise(async (mainResolve, mainReject)=> {
        printSignature();
        console.log(`${config.name} - ¿Cool right? 💡`)

        //await awaiter(3000);
        await getMissingRepos();
        
        console.log(`🚀 looks like you have everything to continue.`);
        console.log(`starting dev servers...`);
        
        const firebasePath = '../firebase';
        const rnPath = '../rnative';
        const corePath = '../charrocel-core';
        const coreFullPath = `${corePath}/core`
        const adminPath = '../web-admin';
        const webPath = '../web-react';

        //Firebase
        const functionsPort = config.functions.port || 5001;
        const functionsEmoji = '🌟';
        console.log(`${functionsEmoji} Starting firebase functions server on port ${functionsPort}...`)
        exec(`ttab -t '${functionsEmoji} Functions Server' 'cd ${firebasePath} && firebase serve --only functions -p ${functionsPort}'`);

        //Functions TSC
        console.log(`${functionsEmoji} Starting to watch type changes on functions...`)
        exec(`ttab -t '${functionsEmoji} Functions TypeScript' 'cd ${firebasePath}/functions && tsc -w'`);

        //React Native
        const rnPort = config.reactNative.port || 8081;
        const rnEmoji = '📱';
        console.log(`${rnEmoji} Starting React Native server on port ${rnPort}...`)
        exec(`ttab -t '${rnEmoji} React Native Metro Server' 'cd ${rnPath} && yarn start --port ${rnPort}'`);

        //Core libraries
        const coreEmoji = '🪐'
        //exec(`ttab -t '${coreEmoji} Core Types' 'cd ${firebasePath}/functions && tsc -w'`);
        const firebaseCore = `${firebasePath}/functions/src/core`;
        const webCore = `${webPath}/core`;
        const adminCore = `${adminPath}/app/core`;
        const rnCore = `${rnPath}/core`;
        console.log(`${coreEmoji} - Watching core 👀 changes...`)
        fs.watch(coreFullPath, { recursive: true }, (eventType, filename) => {
            fse.copySync(coreFullPath, firebaseCore, { overwrite: true });
            fse.copySync(coreFullPath, webCore, { overwrite: true });
            fse.copySync(coreFullPath, adminCore, { overwrite: true });
            fse.copySync(coreFullPath, rnCore, { overwrite: true });
            console.log(`${coreEmoji} - ${filename} synced`)
        })
    })
}

start();



