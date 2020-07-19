const $ = require('jquery');
require('jstree');
const nodePath = require('path');
const fs = require('fs');
var os = require('os');
var pty = require('node-pty');
var Terminal = require('xterm').Terminal;

$(document).ready(async function () {

    // Initialize node-pty with an appropriate shell
    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.cwd(),
        env: process.env
    });

    // Initialize xterm.js and attach it to the DOM
    const xterm = new Terminal();
    xterm.open(document.getElementById('terminal'));

    // Setup communication between xterm.js and node-pty
    xterm.onData(data => ptyProcess.write(data));
    ptyProcess.on('data', function (data) {
        xterm.write(data);
    });



    let editor = createEditor();
    console.log(editor);

    let currpath = process.cwd();
    console.log(currpath);

    let data = [];
    let baseobj = {
        id: currpath,
        parent: '#',
        text: getNamefromPath(currpath)
    }

    let rootChildren = getCurrentDirectories(currpath);
    data = data.concat(rootChildren);

    data.push(baseobj);

    $('#jstree').jstree({
        "core": {
            "check_callback": true,
            "data": data
        }
    }).on('open_node.jstree', function (e, data) {
        // console.log(data.node.children);

        data.node.children.forEach(function (child) {
            let childDirectories = getCurrentDirectories(child);
            childDirectories.forEach(function (directory) {
                $('#jstree').jstree().create_node(child, directory, 'last')
            })
        });
    });
})

function getNamefromPath(path) {
    return nodePath.basename(path);
}

function getCurrentDirectories(path) {
    if (fs.lstatSync(path).isFile()) {
        return [];
    }
    let files = fs.readdirSync(path);
    console.log(files);

    let rv = [];
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        rv.push({
            id: nodePath.join(path, file),
            parent: path,
            text: file
        })
    }
    return rv;
}

function createEditor() {

    return new Promise(function (resolve, reject) {
        let monacoLoader = require('./node_modules/monaco-editor/min/vs/loader.js');

        monacoLoader.require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });

        monacoLoader.require(['vs/editor/editor.main'], function () {
            var editor = monaco.editor.create(document.getElementById('editor'), {
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}'
                ].join('\n'),
                language: 'javascript'
            });
        });
    })
}