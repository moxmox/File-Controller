/** jshint esversion: 6 */
$(document).ready(() => {
    
    const header = {
        setMessage: (text) => {
            $('.infmsg').text(text);
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
                let selected_item = '';
                display.entries.forEach((entry) => {
                    if(entry.isSelected){
                        selected_item = entry.name;
                    }
                    header.setMessage(selected_item);
                });
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
                    console.log('className: '+ className);
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
                let className = entry.name.split('.')[0];
                entry.setSelected(false);
                $(`.${utilities.escape(className)}`).removeClass('selected');
            });
            display.entries[item_name].setSelected(true);
            $(`.${utilities.escape(item_name)}`).addClass('selected');
        }
    };

    const app = {
        init: () => {
            $.get('/home_dir', (data) => {
                data.forEach(value => {
                    display.addEntry(value.name, value.mode, value.isDir);
                });
            });
        }
    };

    app.header = header;
    app.menu = menu;
    app.menu.init();
    app.display = display;
    app.init();

    window.App = app;

});