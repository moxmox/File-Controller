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
        init: () => {
            //initialize events for menu buttons
            menu.moveBtn.on('click', () => {
                if(app.action===ACTION.MOVE){
                    //move the file then return & skip below block
                    app.moveItem();
                }

                display.entries.forEach((entry) => {
                    if(entry.isSelected){
                        app.actionItem = entry.name;
                        app.action = ACTION.MOVE;
                    }
                    header.setMessage(`click move again to move ${app.actionItem} to ${app.cwd}`);
                });
            });
            menu.copyBtn.on('click', () => {
                console.log('copyBtn clicked');
            });
            menu.upBtn.on('click', () => {
                console.log('upBtn clicked');
            });
            menu.deleteBtn.on('click', () => {
                console.log('deleteBtn clicked');
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
                    header.setMessage('delete func not currently operating');
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

        moveItem: () => {
            let path = utilities.urlify(`/move?file=${app.actionItem}&dest=${app.cwd}`);
                    $.get(path, (data) => {
                        console.log(data.msg);
                        display.clear();
                        console.log(`cwd: ${app.cwd}`);
                        /**
                         * after file is moved,
                         * update view & state vars
                         */
                        app.openDir();
                        app.action = 'none';
                        app.actionItem = 'none';
                        display.updateHeader();
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
                app.cwd = `${app.cwd}/${path}`;
                display.clear();
                display.updateHeader();
                for(i=0;i<data.length;i++){
                    value = data[i];
                    display.addEntry(value.name, value.mode, value.isDir);
                }
            });
        }
    };

    app.action = 'none';
    app.actionItem = 'none';
    app.header = header;
    app.menu = menu;
    app.menu.init();
    app.display = display;
    app.init();

    window.App = app;

});