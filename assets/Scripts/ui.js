//Helpers
function create_button(text){
    const button = document.createElement('button');
    button.textContent = text;
    return button;
}

function create_section({element = 'div', class_to_add=""} = {}){
    const row = document.createElement(element);
    if(class_to_add){
        row.classList.add(class_to_add);
    }

    return row;
}

function create_input({type = 'text', value = "", placeholder = "", id= "", className = ""} = {}){
    let input = document.createElement('input')
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;

    if(id){
        input.id = id;
    }

    if(className){
        input.classList.add(className);
    }

    return input;
}

function create_text_element({element = 'p', text = ""} = {}){
    let p = document.createElement(element);
    p.textContent = text;
    return p;
}

function clear_container({element = '', willReveal = ''}){
    const container = document.querySelector(element);
    container.replaceChildren();
    if (willReveal){
        container.classList.remove('hidden')
    }

    return container;
}

function rename_skill_app_controller(oldName, newName){
    rename_skill(oldName, newName);
    remove_skill_data(oldName);
    save_and_render_controller();
}

function delete_skill_app_controller(skillName){
    delete_skill(skillName);
    save_and_render_controller();
    render_manage_skills_modal(get_all_skill_info())
}

function manage_skills_coordinator(){
    let button = document.getElementById('manage-skills');

    button.onclick = () => {
    render_manage_skills_modal(get_all_skill_info())
    }
}

function title_case(text){
    return text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

//////////////////////////
//UI Elements
//////////////////////////

//VIEW
function update_xp_display(){
    xpDisplay.textContent = "XP: " + xp;
}

//VIEW
function update_level_display(level){
    levelDisplay.textContent = "Level: " + level;
}

//VIEW
function update_streak_display(){
    streakDisplay.textContent = "Streak: " + streak;
}

//VIEW
function update_bestStreak_display(){
    bestStreakDisplay.textContent = "Best Streak: " + bestStreak;
}

// ============================
//Skill Summary Rendering
// ============================

//VIEW
function render_skill(skillInfo){
    let skillCard = create_section({class_to_add: 'skill-card'})
    let skillName = create_text_element({element: 'h2', text: title_case(skillInfo.name)})
    let skillXP = create_text_element({element: 'p', text: "XP: " + skillInfo.xp})
    let skillLevel = create_text_element({element: 'p', text: "Level: " + skillInfo.level})

    skillCard.append(skillName);
    skillCard.append(skillXP);
    skillCard.append(skillLevel);
    
    return skillCard;
}

//VIEW
function render_all_skills(skillCollection){
    let skillsContainer = clear_container({element:'#skills-container'})
    for (let i = 0; i < skillCollection.length; i++){
        skillsContainer.append(render_skill(skillCollection[i]));
    }
}

// ============================
//Quest Board Rendering
// ============================

//VIEW
function render_quest_checkbox(isChecked, task){
    let questContainer = create_section({element: 'li', class_to_add: 'quest-task'});
    let questBox = create_input({type: 'checkbox'})
    let taskLabel = create_text_element({element:'span'});
    let durationLabel = create_text_element({element: 'span'})
    let config = task.config;

    questBox.checked = isChecked;
    if (isChecked){
        questBox.disabled = true;
    }

    if (Object.hasOwn(task, "name")){
        if (!task.name){
            taskLabel.textContent = "Unnamed Task";
        } else {
            taskLabel.textContent = task.name;
        }
    
    }

    if (Object.hasOwn(config, "number")){
        taskLabel.textContent = `Block ${config.number}`
    }

    if (Object.hasOwn(config, "duration")){
        if (config.duration >= 1)
        durationLabel.textContent = `(${config.duration} mins)`
    }

    questContainer.append(questBox);
    questContainer.append(taskLabel);
    if (durationLabel.textContent){
        questContainer.append(durationLabel);
    }

    return questContainer;
}

//VIEW
function render_quest_section(questData){
    let questSection = create_section({element: 'section', class_to_add: 'quest-section'});
    let questTitle = create_text_element({element: 'h2', text: title_case(questData.name)})
    let questboxesSection = create_section({element: 'ul', class_to_add: 'quest-boxes'});

    for(let i = 0; i < questData.tasks.length; i++){
        questboxesSection.append(render_quest_checkbox(questData.tasks[i].completed, questData.tasks[i]))
    };

    questSection.append(questTitle);
    questSection.append(questboxesSection);

    return questSection;
}

//VIEW
function render_quest_board(questCollection){
    let questContainer = clear_container({element: '#quests-container'});
    for (let i = 0; i < questCollection.length; i++){
        questContainer.append(render_quest_section(questCollection[i]));
    }
}

//VIEW
function failure_popup(reason){
    let failure_popup = document.getElementById('fail-popup');
    let fail_reason = document.getElementById('fail-reason');
    let fail_button = document.getElementById('fail-button');

    failure_popup.classList.remove('hidden');
    fail_button.addEventListener('click', ()=>{
        failure_popup.classList.add('hidden');
    })

    fail_reason.textContent = reason;
}

//CONTROLLER
function save_and_render_controller(){
    save_quests();
    render_quest_board(get_all_quest_data());
    save_skills();
    render_all_skills(get_all_skill_info());
    initialize_quest_listeners();
}

//VIEW
function add_skills_logic(){
    const content = document.getElementById('add-skill-popup');
    let fail_popup = document.getElementById('fail-popup');
    let fail_reason = document.getElementById('fail-reason');
    const add = document.getElementById('confirm-add-skill');
    const cancel = document.getElementById('cancel-add-skill');
    let skill_input = document.getElementById('skill-input');
    let tasks_input = document.getElementById('tasks-count-input')
    let task_mode = document.getElementById('task-mode-select')

    content.classList.remove('hidden');

    task_mode.selectedIndex = 0;
    
    cancel.addEventListener('click', () => {
        content.classList.add('hidden');

        fail_popup.classList.add('hidden');
        fail_reason.classList.add('hidden');
    })

    add.onclick = () => {
        add_skill_controller(skill_input, tasks_input, task_mode, content);
    }
}

function add_skill_controller(name, number, mode, modal){
    let result = validate_skill_name(name.value)
        if (!result.success){
            failure_popup(result.reason)
        } else if (mode.value === "") {
            failure_popup("Please select a task mode.")
        } else {
            add_skill(result.normalizedName)
            create_new_quest_data(result.normalizedName, Number(number.value), mode.value)
            save_and_render_controller();
            render_manage_skills_modal(get_all_skill_info())
            
            name.value = ""
            modal.classList.add('hidden');
        }
}

// ============================
//Manage Skills Modal Rendering
// ============================

//COMPONENT
function create_milestone_task_modal(){
    let taskLabel = create_text_element({element: 'h2', text: "Task Name"});
    let nameInput = create_input({type: 'text', placeholder: "Enter task name", id: 'name-input'});
    let inputContainer = create_section({element: 'div', class_to_add: 'task-input-row'});

    nameInput.addEventListener('focus', () => {
        nameInput.select();
    });

    taskLabel.setAttribute('for', 'name-input');

    inputContainer.classList.add('popup-label');
    inputContainer.append(taskLabel);
    inputContainer.append(nameInput);

    let returnObject = {
        mode: "milestone",
        element: inputContainer,
        getData() {
            return {
                mode: "milestone",
                name: title_case(nameInput.value.trim())
            };
        },
        focus() {
            nameInput.focus();
        },
        isEmpty() {
            return nameInput.value.trim() === "";
        },
        clear() {
            nameInput.value = "";
        },
        setName(newName) {
            nameInput.value = newName;
        },
        setClass(newClass){
            inputContainer.classList.add(newClass)
        }
    }
    return returnObject;
}

function create_timed_task_modal(){
    let taskLabel = create_text_element({element: 'h2', text: "Task Name"});
    let nameInput = create_input({type: 'text', placeholder: "Enter task name", id: 'name-input'});
    let timeInput = create_input({type: 'number', placeholder: 'mins', id: 'time-input'});
    let inputContainer = create_section({element: 'div', class_to_add: 'task-input-row'});

    nameInput.addEventListener('focus', () => {
        nameInput.select();
    });

    taskLabel.setAttribute('for', 'name-input');

    inputContainer.append(taskLabel);
    inputContainer.append(nameInput);
    inputContainer.append(timeInput);

    let returnObject = {
        mode: "timed",
        element: inputContainer,
        getData() {
            return {
                mode: "timed",
                name: nameInput.value.trim(),
                duration: Number(timeInput.value)
            };
        },
        focus() {
            nameInput.focus();
        },
        isEmpty() {
            return nameInput.value.trim() === "";
        },
        clear() {
            nameInput.value = "";
            timeInput.value = '';
        },
        setName(newName) {
            nameInput.value = newName;
        },
        setTime(newTime){
            timeInput.value = newTime;
        },
        setClass(newClass){
            inputContainer.classList.add(newClass)
        }
    }
    return returnObject;
}

function create_repeated_task_modal(){
    let taskLabel = create_text_element({element: 'h2', text: "New Block"});
    let timeInput = create_input({type: 'number', placeholder: 'mins', id: 'time-input'});
    let inputContainer = create_section({element: 'div', class_to_add: 'task-input-row'});

    inputContainer.classList.add('popup-label');
    inputContainer.append(taskLabel);
    inputContainer.append(timeInput);

    let returnObject = {
        mode: "repeated",
        element: inputContainer,
        getData(){
            return {
                mode: "repeated",
                duration: Number(timeInput.value)
            }
        },
        clear(){
            timeInput.value = ""
        },
        setTime(newTime){
            timeInput.value = newTime
        },
        setClass(newClass){
            inputContainer.classList.add(newClass)
        }
    }

    return returnObject;
}

function create_modal(){
    const popup = clear_container({element: '#create-task-modal', willReveal: true});

    return {
        setContent(element){
            popup.append(element);
        },

        close(){
            popup.classList.add('hidden');
        },
        setClass(class_to_add){
            popup.classList.add(class_to_add);
        }
    }
}

//CONTROLLER
function task_changed_app_controller(skillName, index){
    const task = quests[skillName].tasks[index];
    const playerState = {
        globalXP: xp,
        skillXP: skills[skillName].xp,
        streak,
        globalLevel: calculate_level(xp, 10),
        skillLevel: calculate_level(skills[skillName].xp, 5)};
    const xpBundle = apply_task_xp(task.config, playerState);
    
    apply_xp_controller(skillName, xpBundle);
    save_and_render_controller();
}

//VIEW
function render_manage_skills_modal(skillInfo){
    let popup = clear_container({element: '#manage-skills-popup', willReveal: true})
    const overlay = document.getElementById('manage-skills-overlay')

    for (let i = 0; i < skillInfo.length; i++){
        popup.append(render_manage_skill_row(skillInfo[i]))
    };
    popup.append(render_manage_modal_buttons());

    overlay.classList.remove('hidden');
}

//VIEW
function render_manage_skill_row(skillInfo){
    let skill_row = create_section({element: 'div', class_to_add: 'manage-skill-skill-row'});
    let skill = create_text_element({element: 'p', text: title_case(skillInfo.name)})
    let skill_actions = create_section({element: 'div', class_to_add: 'skill-actions'});
    let rename_button = create_button("Rename");
    let delete_button = create_button("Delete");
    let task_manage_button = create_button("Tasks");

    rename_button.addEventListener('click', () =>{
        render_rename_modal(skillInfo.name)
        
    })

    delete_button.addEventListener('click', ()=> {
        render_confirm_delete_popup(skillInfo.name)
    })

    task_manage_button.addEventListener('click', ()=> {
        let questData = quests[skillInfo.name]
        run_tasks_modal(questData);
    })

    skill_actions.append(rename_button)
    skill_actions.append(delete_button)
    skill_actions.append(task_manage_button)

    skill_row.append(skill);
    skill_row.append(skill_actions);
    
    return skill_row;
}

//CONTROLLER
function get_task_builder(mode){
    switch (mode){
        case "milestone":
            return create_milestone_task_modal;
        case "timed":
            return create_timed_task_modal;
        case "repeated":
            return create_repeated_task_modal;
    }
}

function run_tasks_modal(questData){
    render_tasks_modal({questData, taskBuilder: get_task_builder(questData.mode)})
}

function render_tasks_modal({questData, taskBuilder}){
    const popup = clear_container({element: '#tasks-modal', willReveal: true});
    let buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});
    let exit_button = create_button("Exit");
    let add_button = create_button("+ Add Task");

    exit_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })
    add_button.addEventListener('click', () => {
        create_task_controller(questData, taskBuilder());
    })
    
    for (let i = 0; i < questData.tasks.length; i++){
        popup.append(create_task_rows_controller(questData, i));
    }
    buttons_section.append(add_button);
    buttons_section.append(exit_button);

    popup.append(buttons_section);
}

function create_task_controller(questData, component){
    let modal = create_modal();
    let buttons = create_modal_buttons_section();

    buttons.onConfirm(() => {
        add_task_controller(questData, component.getData(), modal);
    })

    buttons.onCancel(() => {
        modal.close();
        component.clear();
    })

    component.setClass('popup-label');

    component.element.append(buttons.element)
    modal.setContent(component.element);
}

function create_modal_buttons_section(){
    let confirm_button = create_button("Confirm");
    let cancel_button = create_button("Cancel");
    let buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});

    buttons_section.append(confirm_button);
    buttons_section.append(cancel_button);

    return {
        element: buttons_section,
        onConfirm(callback){
            confirm_button.onclick = callback;
        },
        onCancel(callback){
            cancel_button.onclick = callback;
        }
    }
}

function create_task_row({task, onEdit, onRemove}){
    let task_container = create_section({element: 'div', class_to_add: 'manage-skill-skill-row'})
    let taskName = create_text_element({element: 'p', text: get_task_display_text(task)})
    let edit_button = create_button("Edit\nTask")
    let remove_button = create_button("Remove\nTask")

    edit_button.onclick = onEdit;
    remove_button.onclick = onRemove;
    
    task_container.append(taskName);
    task_container.append(edit_button);
    task_container.append(remove_button);

    return task_container;
}

function get_task_display_text(task){
    if (task.name && task.config?.duration){
        return `${task.name}\n (${task.config.duration} min)`;
    }

    if (task.name) {
        return task.name;
    }

    if (task.config?.number){
        return `Block ${task.config.number}`
    }

    return "Unnamed\nTask";
}

function create_task({data, skillName}){
    let task = {skillName,
        completed: false,
        config: {}
    };

    switch (data.mode){
        case "milestone":
            task.name = data.name;
            break;
        case "timed":
            task.name = data.name;
            task.config.duration = data.duration;
            break;
        case "repeated":
            task.config.number = data.number;
            task.config.duration = data.duration;
    }

    return task;
}

function add_task_controller(questData, taskData, popup){
    if (taskData.mode === "repeated"){
        taskData.number = questData.tasks.length + 1;
    }
    questData.tasks.push(create_task({data: taskData, skillname: questData.skillName}));
    run_tasks_modal(questData)
    save_and_render_controller();
    popup.close();
}

//COMPONENT
function render_edit_task_modal(task){
    const popup = create_modal();
    popup.setClass('popup-label');
    let heading = create_text_element({element: 'h2', text: "Edit Task"});
    let taskText = create_text_element({element: 'p', text: get_task_display_text(task)});
    let buttons = create_modal_buttons_section();
    let nameInput = null;
    let timeInput = null;

    popup.setContent(heading);
    popup.setContent(taskText);

    if (Object.hasOwn(task, "name")){
        nameInput = create_input({type: 'text', value: task.name, placeholder: "Enter a Task Name"});
        popup.setContent(nameInput);
    }

    if (Object.hasOwn(task.config, "duration")){
        timeInput = create_input({type: 'number', value: task.config.duration, placeholder: "Time in Minutes"});
        popup.setContent(timeInput);
    }

    buttons.onConfirm(() => {
        confirm_edit_task_controller(task, nameInput, timeInput, popup);
    })

    buttons.onCancel(() => {
        popup.close();
    })

    popup.setContent(buttons.element);
}

function confirm_edit_task_controller(task, name, time, popup){
    popup.close();
    if (name){
        task.name = title_case(name.value.trim());
    }
    
    if (time){
        task.config.duration = Number(time.value)
    }
    popup.close();
    save_and_render_controller();
    run_tasks_modal(quests[task.skillName]);
}

function create_task_rows_controller(questData, i){
    let element = create_task_row({task: questData.tasks[i],
        onEdit(){
            render_edit_task_modal(questData.tasks[i]);
        },
        onRemove(){
            remove_task_controller({questData, index: i});
            run_tasks_modal(questData);
        }
    });
    return element;
}

function remove_task_controller({questData, index}){
    questData.tasks.splice(index, 1);
    save_and_render_controller();
}

//COMPONENT
function render_confirm_delete_popup(skillName){
    const popup = clear_container({element: '#confirm-delete', willReveal: true})
    let skillToDelete = create_text_element({element: 'h2', text: "Confirm delete: " + title_case(skillName)})
    let warning = create_text_element({element: 'p', text: "Once deleted, data cannot be retrieved and must be remade from scratch."})
    let confirm = create_button("Confirm");
    let cancel = create_button("Cancel");
    let buttonsRow = create_section({element: 'div', class_to_add: 'popup-buttons'});

    confirm.addEventListener('click', ()=> {
        delete_skill_ui_controller(skillName, popup);
    })

    cancel.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    buttonsRow.append(confirm);
    buttonsRow.append(cancel);

    popup.append(skillToDelete);
    popup.append(warning);
    popup.append(buttonsRow);
}

function delete_skill_ui_controller(skillName, popup){
    delete_skill_app_controller(skillName);
    popup.classList.add('hidden');
}

//COMPONENT
function render_rename_modal(oldName){
    const popup = document.getElementById('rename-modal');
    const confirm = document.getElementById('confirm-rename-skill');
    const cancel = document.getElementById('cancel-rename-skill');
    let input = document.getElementById('rename-input');

    confirm.onclick = () => {
        rename_skill_ui_controller(oldName, input, popup);
    }

    cancel.onclick = () => {
        popup.classList.add('hidden');
    }

    popup.classList.remove('hidden');
}

function rename_skill_ui_controller(oldName, input, popup){
    let result = validate_skill_name(input.value)
        if (result.success){
            rename_skill_app_controller(oldName, result.normalizedName);
            popup.classList.add('hidden');
            render_manage_skills_modal(get_all_skill_info());
        } else {
            failure_popup(result.reason)
        }
}

//COMPONENT
function render_manage_modal_buttons(){
    let button_row = create_section({element: 'div', class_to_add: 'modal-buttons'});
    let add_skills = create_button("+ Add Skill");
    let close_manage_modal = create_button("Close");
    let overlay = document.getElementById('manage-skills-overlay');
    let popup = document.getElementById('manage-skills-popup');

    add_skills.onclick = () => {
        add_skills_logic();
    }

    close_manage_modal.onclick = () => {
        overlay.classList.add('hidden');
        popup.classList.add('hidden');
    }

    button_row.append(add_skills);
    button_row.append(close_manage_modal);
    
    return button_row;
}