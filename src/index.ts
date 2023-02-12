// fibo.ts - Firebase, firestore, React Native and ReactJS CRUD Ecosystem builder in TypeScript 💚.

import { helloStripe } from "./private/utils/stripe";

const argumentos = process.argv.slice(2)
const config = require('../config.json');
const pkgJson = require('../package.json');
const fs = require('fs');
const { exec } = require('node:child_process')
const fse = require('fs-extra');
const skipTabs = argumentos.includes('skipTabs');
console.log(`${helloStripe}`);
const printSignature = () => {
    return console.log(`
    ┌──────────────────────────────┐
    │      fibo.ts Boilerplate     │
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
    v${pkgJson.version}
    `)
}

/*

    To-Do list
        - separate this, from project - karlo.js should be an isolated project that can be upgraded and that kind of stuff.
        - handle custom folder name structure
        - deploy actions

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

const checkYesNo = (toCheck:string):boolean => {
    var res = false;
    const yesAleternatives = ['yes', 'y'];
    yesAleternatives.forEach((ya)=>{
        if(toCheck.toLowerCase() === ya){
            res = true;
        }
    })
    return res;
}

const extraRepos = config.extraRepos || []

const getMissingRepos = () => {
    var proms:Promise<any>[] = []
    var reposToInstall = []
    var toCheck = [];
    toCheck.push(config.admin)
    toCheck.push(config.core)
    toCheck.push(config.firebase)
    toCheck.push(config.reactNative)
    extraRepos.forEach((er:any)=>toCheck.push(er))
    toCheck.forEach((repo)=>{
        // directory to check if exists
        const dir = `../${repo.name}`;
        proms.push(new Promise((resolve)=>{
            // check if directory exists
            fs.access(dir, async (err:any) => {
                const required = (repo.required === true || repo.required === undefined)
                if(err){
                    console.log(`${repo.name} was added to install queue`);
                    reposToInstall.push(repo);
                }
                if(err && required){
                    //does not exist
                    console.error(`${repo.name} repo ❌ doesn't exist and it's required...`);
                }else{
                    //exists
                    if(required === true){
                        console.log(`${repo.name} repo exists`);
                    }else{
                        console.log(`${repo.name} is not required ✅ (but does not exists)`);
                    }
                    
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
        
        const firebasePath = `../${config.firebase.name}`;
        const rnPath = `../${config.reactNative.name}`;
        const corePath = `../${config.core.name}`;
        const coreFullPath = `${corePath}/core`
        const adminPath = `../${config.admin.name}`;
        //const webPath = '../web-react';

        //Firebase
        //const functionsPort = config.functions.port || 5001;
        const functionsEmoji = '🌟';
        //console.log(`${functionsEmoji} Starting firebase functions server on port ${functionsPort}...`)
        //skipTabs !== true && exec(`ttab -w 'cd .. && cd ${config.firebase.name} && firebase serve --only functions -p ${functionsPort}'`);

        //Functions TSC
        console.log(`${functionsEmoji} Starting to watch type changes on functions...`)
        skipTabs !== true && exec(`ttab -t 'Functions TypeScript' 'cd ${firebasePath}/functions && tsc -w'`);

        //React Native
        const rnPort = config.reactNative.port || 8081;
        const rnEmoji = '📱';
        console.log(`${rnEmoji} Starting React Native server on port ${rnPort}...`)
        skipTabs !== true && exec(`ttab -t 'React Native Metro Server' 'cd ${rnPath} && yarn start --port ${rnPort}'`);

        //Core libraries
        const coreEmoji = '🪐'
        //exec(`ttab -t '${coreEmoji} Core Types' 'cd ${firebasePath}/functions && tsc -w'`);
        const firebaseCore = `${firebasePath}/functions/src/core`;
        const adminCore = `${adminPath}/app/core`;
        const rnCore = `${rnPath}/core`;
        console.log(`${coreEmoji} - Watching core 👀 changes...`)
        fs.watch(coreFullPath, { recursive: true }, (eventType:any, filename:any) => {
            fse.copySync(coreFullPath, firebaseCore, { overwrite: true });
            fse.copySync(coreFullPath, adminCore, { overwrite: true });
            fse.copySync(coreFullPath, rnCore, { overwrite: true });
            extraRepos.forEach((eRepo:any)=>{
                const tCore = `../${eRepo.name}${eRepo.corePath}`;
                fse.copySync(coreFullPath, tCore, { overwrite: true });
            })
            console.log(`${coreEmoji} - ${filename} synced`)
        })
        skipTabs !== true && exec(`ttab -t 'local tsc' tsc -w`)

        //Extra
        extraRepos.forEach((eR:any)=>{
            const eEmoji = eR.emoji || '➕'
            if(eR.start !== undefined){
                console.log(`${eEmoji} - Starting ${eR.name}...`)
                skipTabs !== true && exec(`ttab -t '${eR.name}' 'cd .. && cd ${eR.name} && ${eR.start}'`);
            }
        })
        serveFirebaseSuite();
        setTimeout(() => {
            stripeServer();
        }, 2000);
    })
}

const deployFunctions = () => {
    var deployFunctionsCommand = config.functions.customDeploy || `cd .. && cd firebase && firebase deploy --only functions`;
    exec(`ttab -t 'Functions Deploy' '${deployFunctionsCommand}'`)
}

const serveFirebaseSuite = () => {
    //const locationGcSdk = config.functions.gcsdkLocation || `~/google-cloud-sdk`
    //exec(`${locationGcSdk}/bin/gsutil -m cp -r gs://charrocel-b0e1a.appspot.com/2023-02-11T18:48:29_97031 .`)
    exec(`ttab -t 'Firebase' 'cd .. && cd firebase && firebase emulators:start --import ./dbs/1'`)
}

const stripeServer = () => {
    exec(`ttab -t 'Stripe' 'stripe listen --forward-to http://127.0.0.1:5001/charrocel-b0e1a/us-central1/stripeChargeSucceeded'`)
}

if(argumentos.includes('start')){
    start();
}

if(argumentos.includes('deployFunctions')){
    deployFunctions();
}

if(argumentos.includes('serveFirebaseSuite')){
    deployFunctions();
}

if(argumentos.includes('getMissingRepos')){
    getMissingRepos();
}