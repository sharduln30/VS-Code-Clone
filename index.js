const $ = require('jquery');
require('jstree');
const nodePath = require('path');

$(document).ready(function(){

    let currpath = process.cwd();
    console.log(currpath);

    let data = [];
    let baseobj = {
        id:currpath,
        parent:'#',
        text: getNamefromPath(currpath)
    }
    data.push(baseobj);

    $('#jstree').jstree({
        "core":{
            "check_callback": true,
            "data":data
        }
    })
})

function getNamefromPath(path){
    return nodePath.basename(path);
}