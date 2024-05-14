const { contextBridge, ipcRenderer } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

contextBridge.exposeInMainWorld(
    'api', {
        getInput: (username, password, clientID, subdirectory, files) => {
            return new Promise((resolve, reject) => {
                ipcRenderer.once('form-submitted-response', (event, responseData) =>{
                    resolve(responseData)
                })
                ipcRenderer.send('form-submitted', {username, password, clientID, subdirectory, files});
            })
            // Define other API functions...
        }

    }
)


// My original script looks something like this

// import { exec } from 'child_process';
// import inquirer from "inquirer";
// import fs from 'fs';
// import path from 'path';
// import os from 'os';

// const commands = [];
// const mount = [];
// const homeDir = os.homedir();
// const mountPoint = `${homeDir}/Volumes/ord_creatives_drive`

// function executeCommands(commands, index = 0) {
//     if (index >= commands.length) {
//         console.log('All commands executed successfully');
//         return;
//     }

//     const cmd = commands[index];
//     // console.log(`Executing command: ${cmd}`);
//     exec(cmd, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error executing command: ${cmd}\n`, error);
//             return;
//         }

//         // console.log(`Output for command: ${cmd}\n`, stdout);
//         executeCommands(commands, index + 1);
//     });
// }

// function ensureDestinationFolder(folderPath) {
//     if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true });
//     }
// }

// async function multiFileSelection(dirPath = process.cwd()) {

// }

// function cleanFilename(file) {
//     if (file.includes('first')) {
//         return file.replace(/(?<=\.jpg).*$/, '')
//     } else if (file.includes('last')) {
//         return file.replace(/_\d+(?=\.jpg$)/, '');
//     }
// }

// function getFolderName(filename) {
//     const match = filename.match(/(\d+x\d+)/);
//     return match ? match[1] : null;
// }

// async function processFiles(selectedFiles, clientID, subdirectory) {
//     // console.log('processFiles:', { clientID, subdirectory });
//     for (const sourceFile of selectedFiles) {
//         const isDirectory = fs.statSync(sourceFile).isDirectory();

//         if (isDirectory) {
//             const filesInDir = await multiFileSelection(sourceFile);
//             for (const file of filesInDir) {
//                 await processFile(file, clientID, subdirectory);
//             }
//         } else {
//             await processFile(sourceFile, clientID, subdirectory);
//         }
//     }
// }
// async function processFile(file, clientID, subdirectory) {
//     // console.log('processFile:', { file, clientID, subdirectory });
//     const filename = path.basename(file);
//     const folderName = getFolderName(filename);
//     const destination = `${homeDir}/Volumes/ord_creatives_drive/opslocal/images/${clientID}/${subdirectory}`;

//     // console.log('Destination:', destination);

//     if (!folderName) {
//         // console.log(`Skipping file ${filename} due to invalid file name pattern`);
//         return;
//     }

//     const destinationFolder = path.join(destination, folderName);
//     ensureDestinationFolder(destinationFolder);

//     const newFilename = cleanFilename(file);
//     let currentDate = new Date();
//     let year = currentDate.getFullYear();
//     let month = String(currentDate.getMonth() + 1).padStart(2, '0');
//     let day = String(currentDate.getDate()).padStart(2, '0');

//     let formattedDate = `${month}${day}${year}`

//     // Split filename and extension
//     let parts = newFilename.split('.');
//     let originalFilename = parts[0];
//     let posterImg = 'vid_poster_img'
//     let endImg = 'vid_end_img'
//     let extension = parts[1];
//     let modifiedFileName;

//     // Concatenate filename, formatted date, and extension
//     if (originalFilename.includes('first')) {
//         modifiedFileName = `${posterImg}_${formattedDate}.${extension}`;
//     }
//     else if (originalFilename.includes('last')) {
//         modifiedFileName =  `${endImg}_${formattedDate}.${extension}`;
//     }
   
//     const newFilePath = path.join(destinationFolder, path.basename(modifiedFileName));

//     try {
//         // Copy the file to the new location
//         await fs.promises.copyFile(file, newFilePath);

//         // Executing rsync command using the new file path as the source
//         const rsyncCmd = `rsync -v -r "${newFilePath}" "${destinationFolder}"`;
//         commands.push(rsyncCmd);

//         // Delete the original file
//         //await fs.promises.unlink(file);
//     } catch (error) {
//         console.error('Error copying, renaming, or syncing file:', error);
//         return;
//     }

//     // Executing rsync command
//     const rsyncCmd = `rsync -v -r "${newFilePath}" "${destinationFolder}"`;
//     commands.push(rsyncCmd);
// }

// inquirer.prompt([
//     // a list of question prompts in which the user had to reply with an answer
//     // whats ur username
//     // whats ur password
//     // whats ur clientID
//     // whats ur subdirectory
// ]).then(async answers => {
//     const { user, clientID, subdirectory } = answers
//     const serverAddress = `${user}@someURLHere`

//     // Check if the required directories exist, and create them if they don't
//     const volumesDir = `${homeDir}/Volumes`;
//     const creativesDriveDir = mountPoint;

//     if (!fs.existsSync(volumesDir)) {
//         // console.log('Volume directory not detected - creating directory...')
//         const mkdirVolumesDirCmd = `mkdir "${volumesDir}"`;
//         mount.push(mkdirVolumesDirCmd);
//     }

//     if (!fs.existsSync(creativesDriveDir)) {
//         // console.log('Creatives drive directory not detected - creating directory...')
//         const mkdirCreativesDirCmd = `mkdir "${creativesDriveDir}"`;
//         mount.push(mkdirCreativesDirCmd);
//     }

//     exec("df", (error, stdout, stderr) => {
//         if (!stdout.includes(`//${serverAddress}`) || !stdout.includes(`${mountPoint}`)) {
//             const mountCmd = `mount_smbfs //${serverAddress} ${mountPoint}`
//             mount.push(mountCmd)
//         }
//         executeCommands(mount)
//     })

//     setTimeout(async function () {
//         const selectedFiles = await multiFileSelection();
//         await processFiles(selectedFiles, clientID, subdirectory);
//         executeCommands(commands)
//     }, 60000);
// })