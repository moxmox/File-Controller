/** jshint esversion: 6 */
$(document).ready(() => {
    
    const header = {
        setMessage: (text) => {
            $('.infmsg').text(text);
        }
    };

    const ACTION = {
        MOVE: 'MOVE',
        COPY: 'COPY',
        DELETE: 'DELETE'
    };

    const menu = {
        moveBtn: $('.move'),
        copyBtn: $('.copy'),
        upBtn: $('.up'),
        deleteBtn: $('.delete'),
        openBtn: $('.open'),
        confirmDialog: $('.confirmDialog'),
        confirmInput: $('.confirmInput'),
        confirmSubmit: $('.confirmSubmit'),
        confirmCancel: $('.confirmCancel'),

        init: () => {
            //initialize events for menu buttons
            menu.confirmSubmit.on('click', () => {
                for(i=0;i<display.entries.length;i++){
                    if(display.entries[i].isSelected){
                        app.actionItem = display.entries[i].name;
                    }
                }
                if(app.action===ACTION.DELETE){
                    if(app.actionItem){
                        app.removeItem();
                        menu.confirmDialog.addClass('hidden');
                    }else{
                        window.alert('No file selected');
                    }
                }else{
                    window.alert('An unknown error occured');
                }
            });
            menu.confirmCancel.on('click', () => {
                menu.confirmDialog.addClass('hidden');
                app.action = 'none';
                app.actionItem = 'none';
            });
            menu.moveBtn.on('click', () => {
                if(app.action===ACTION.MOVE){
                    app.moveItem();
                }

                display.entries.forEach((entry) => {
                    if(entry.isSelected){
                        app.oldPath = app.cwd;
                        console.log(`oldPath: ${app.oldPath}`);
                        app.actionItem = entry.name;
                        app.action = ACTION.MOVE;
                        header.setMessage(`click move again to move ${app.actionItem} to ${app.cwd}`);                        
                    }
                });
            });
            menu.copyBtn.on('click', () => {
                console.log('copyBtn clicked');
            });
            menu.upBtn.on('click', () => {
                if(app.cwd==='' || app.cwd==='/'){
                    window.alert('Cannot move up.');
                    return;
                }
                let dirList = app.cwd.split('/');
                dirList.pop();
                app.cwd = '/';
                for(i=0;i<dirList.length - 1;i++){
                    app.cwd += `${dirList[i]}/`;
                    console.log(app.cwd);
                }
                app.cwd += dirList[dirList.length - 1];
                app.cwd = utilities.slashSquash(app.cwd);
                console.log(app.cwd);
                display.clear();
                app.openDir();
            });
            menu.deleteBtn.on('click', () => {
                app.action = ACTION.DELETE;
                menu.confirmDialog.removeClass('hidden');
            });
            menu.openBtn.on('click', () => {
                for(i=0;i<display.entries.length;i++){
                    if(display.entries[i].isSelected){
                        if(!display.entries[i].isDir){
                            window.alert(`${display.entries[i].name} is not a directory`);
                            return;
                        }
                        let dir_path = display.entries[i].name;
                        app.openDir(dir_path);
                    }
                }             
            });
        }
    };

    const Entry = function(name, permissions, isDir) {
        this.name = name;
        this.permissions = permissions;
        this.isDir = isDir;
        this.isSelected = false;
        this.setSelected = (selected) => {
            this.isSelected = selected;
        }
    };

    const display = {
        content: $('.inner_content'),
        entries: [],

        addEntry: (name, permission, isDir) => {
            let entry = new Entry(name, permission, isDir);
            let className = '';
            if(entry.name.startsWith('.')){
                className = entry.name.split('.')[1];    
            }else{
                className = entry.name.split('.')[0];            
            }
            display.entries[className] = entry;
            display.entries.push(entry);
            display.content.append(`
            <div class="file_item_wrapper ${className}">
                <a href="#" class="file_item">
                    <span class='filename'>${entry.name}</span>
                    <span class='fileperm'>${entry.permissions}</span>
                    <span class='filedir'>${entry.isDir?'dir':'file'}</span>
                </a> 
            </div>
            `);
            $(`.file_item_wrapper.${utilities.escape(className)}`)
                .on('click', () => {
                    entry.setSelected(true);
                    display.selectEntry(className);   
                });
        },

        clear: (item_name) => {
            if(item_name){
                $(`.${utilities.escape(item_name)}`).remove();
                display.entries[item_name] = null;
                display.entries.indexOf(item_name)
            }else{
                $('.file_item_wrapper').remove();
                display.entries = [];
            }
        },

        selectEntry: (item_name) => {
            item_name = item_name.split('.')[0];
            if(!item_name) throw new Error('Missing Argument');
            display.entries.forEach((entry) => {
                let className = '';
                if(entry.name.startsWith('.')){
                    className = entry.name.split('.')[1];
                }else{
                    className = entry.name.split('.')[0];
                }
                entry.setSelected(false);
                $(`.${utilities.escape(className)}`).removeClass('selected');
            });
            display.entries[item_name].setSelected(true);
            $(`.${utilities.escape(item_name)}`).addClass('selected');
        },

        updateHeader: () => {
            switch(app.action)
            {
                case ACTION.MOVE:
                    header.setMessage(`click move again to move '${app.actionItem}' to '${app.cwd}'`); 
                    break;
                case ACTION.COPY:
                    header.setMessage.setMessage('copy func not currently operating');
                    break;
                case ACTION.DELETE:
                    header.setMessage(`Delete ${app.actionItem}?`);
                    break;
                default: 
                    header.setMessage('Nothing to display');
            }            
        }
    };

    const app = {
        cwd: '',

        init: () => {
            $.get(`${utilities.urlify('/home_dir')}`, (data) => {
                data.forEach(value => {
                    display.addEntry(value.name, value.mode, value.isDir);
                });
            });
        },

        removeItem: () => {
            let path = utilities.urlify(`/del?file=${app.actionItem}&path=${app.cwd}`);
            $.get(path, (data) => {
                console.log('removeItem function complete');
                console.log(data.code);
                display.clear();
                if(data.code==='success'){
                    window.alert(`${app.actionItem} removed succesfully!`);
                    display.updateHeader();
                }else{
                    header.setMessage('An Error has occurred');
                }
                app.openDir();
                app.action = 'none';
                app.actionItem = 'none';
            });
        },

        copyItem: () => {

        },

        moveItem: () => {
            let path = utilities.urlify(`/move?file=${app.actionItem}&oldPath=${app.oldPath}/&dest=${app.cwd}`);
                    $.get(path, (data) => {
                        display.clear();
                        console.log(data.code);
                        app.openDir();
                        if(data.code==='success'){
                            window.alert(`success!`);
                            display.updateHeader();
                        }else{
                            header.setMessage('An Error has occurred');
                        }
                        app.action = 'none';
                        app.actionItem = 'none';
                    });
        },

        openDir: (path) => { 
            if(app.cwd===''){
                urlSafePath = utilities.urlify(`/${path}`);
            }else{
                if(!path){
                    urlSafePath = utilities.urlify(app.cwd);
                }else{
                    urlSafePath = utilities.urlify(`${app.cwd}/${path}`);
                }
            }
            $.get(`/files?dir_path=${urlSafePath}`, (data) => {
                if(path){
                    app.cwd = `${app.cwd}/${path}`;
                }
                display.clear();
                display.updateHeader();
                for(i=0;i<data.length;i++){
                    value = data[i];
                    display.addEntry(value.name, value.mode, value.isDir);
                }
            });
        },
    };

    app.action = 'none';
    app.actionItem = 'none';
    app.oldPath = '';
    app.header = header;
    app.menu = menu;
    app.menu.init();
    app.display = display;
    app.init();

    window.App = app;

});