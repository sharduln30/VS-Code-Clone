const $ = require('jquery');
require('jstree');
const nodePath = require('path');
const fs = require('fs');

$(document).ready(function(){

    let currpath = process.cwd();
    console.log(currpath);

    let data = [];
    let baseobj = {
        id:currpath,
        parent:'#',
        text: getNamefromPath(currpath)
    }

    let rootChildren = getCurrentDirectories(currpath);
    data = data.concat(rootChildren);

    data.push(baseobj);

    $('#jstree').jstree({
        "core":{
            "check_callback": true,
            "data":data
        }
    }).on('open_node.jstree', function(e, data) {
        // console.log(data.node.children);

        data.node.children.forEach(function(child) {
            let childDirectories = getCurrentDirectories(child);
            childDirectories.forEach(function(directory){
               $('#jstree').jstree().create_node(child,directory,'last') 
            })
        });
    });
})

function getNamefromPath(path){
    return nodePath.basename(path);
}

function getCurrentDirectories(path){
   if(fs.lstatSync(path).isFile()){
        return [];
    }
    let files = fs.readdirSync(path);
    console.log(files);

    let rv = [];
    for(let i=0;i<files.length;i++){
        let file = files[i];
        rv.push({
            id:nodePath.join(path,file),
            parent:path,
            text:file
        })
    }
    return rv;
}