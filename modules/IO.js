/** 
 * jshint esversion: 8
 * */
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

const IO = {};

IO.listAll = async (dir) => {
    let files;
    try{
        files = await readdir(dir, {withFileTypes: true});
    }catch(ex){
        console.error(`error: ${ex}`);
    }
    return await Promise.resolve(files);
};

IO.getStats = async (entryList, cwd) => {
    let stats = [];
    let result = [];
    try {
        for(i=0;i<entryList.length;i++){
            stats.push(await stat(`${cwd}/${entryList[i].name}`));
        }
    } catch (err) {
        console.error(err);
    }
    let statRes = await Promise.all(stats);
    for(i=0;i<entryList.length;i++){
        result.push({
            name: entryList[i].name,
            isDir: entryList[i].isDirectory(),
            mode: statRes[i].mode
        });
    }
    return result;
};

IO.moveFile = async (oldPath, newPath) => {
    return await Promise.resolve(rename(oldPath ,newPath));
};

IO.remFile = async (absoluteName) => {
    return await Promise.resolve(unlink(absoluteName));
};

module.exports = IO;