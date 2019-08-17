/** jshint esversion: 6 */
$(document).ready(() => {
    
    const header = {
        infoMsg: $('.infmsg'),
        setMessage: (text) => {
            this.infoMsg.val = text;
        }
    };

    const menu = {
        moveBtn: $('.move'),
        copyBtn: $('.copy'),
        detailsBtn: $('.details'),
        deleteBtn: $('.delete'),
        openBtn: $('.open'),
        init: () => {
            //initialize events for menu buttons
            menu.moveBtn.on('click', () => {
                console.log('moveBtn clicked');
            });
            menu.copyBtn.on('click', () => {
                console.log('copyBtn clicked');
            });
            menu.detailsBtn.on('click', () => {
                console.log('detailsBtn clicked');
            });
            menu.deleteBtn.on('click', () => {
                console.log('deleteBtn clicked');
            });
            menu.openBtn.on('click', () => {
                console.log('openBtn clicked');
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
            let className = entry.name.split('.')[0];            
            //FIND WAY TO AVOID DOUBLE ADD TO ARRAY!
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
            $(`.file_item_wrapper.${className}`)
                .on('click', () => {
                    entry.setSelected(true);
                    display.selectEntry(className);
                });
        },

        clear: (item_name) => {
            if(item_name){
                $(`.${item_name}`).remove();
                display.entries[item_name] = undefined;
            }else{
                $('.file_item_wrapper').remove();
                display.entries = [];
            }
        },

        selectEntry: (item_name) => {
            console.log('select entry called')
            item_name = item_name.split('.')[0];
            if(!item_name) throw new Error('Missing Argument');
            display.entries.forEach((entry) => {
                console.log('logging');
                entry.setSelected(false);
                $(`.${entry.name}`).removeClass('selected');
            });
            display.entries[item_name].setSelected(true);
            $(`.${item_name}`).addClass('selected');
        }
    };

    const app = {};
    app.header = header;
    app.menu = menu;
    app.menu.init()
    app.display = display;

    window.App = app;

});