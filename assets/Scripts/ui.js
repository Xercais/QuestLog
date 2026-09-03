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

function create_text_element({element = 'p', text = ''} = {}){
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

function get_and_reveal(id){
    const popup = document.querySelector(id)
    popup.classList.remove('hidden');
    return popup;
}

//MODEL
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
    let skillXP = create_p("XP: " + skillInfo.xp)
    let skillLevel = create_p("Level: " + skillInfo.level)

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
    let questContainer = document.createElement('li');
    let questBox = create_input({type: 'checkbox'})
    let taskLabel = create_text_element({element:'span'});

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

    if (task.config.taskMode === "timed") {
        taskLabel.textContent += ` (${task.config.duration} min)`;
    }

    if (task.config.taskMode === "repeated"){
        taskLabel.textContent += ` (x${task.config.repetitions})`;
    }

    if (task.config.taskMode === "milestone"){
    taskLabel.textContent += " ★ Milestone";
    }   

    questContainer.append(questBox);
    questContainer.append(taskLabel);

    return questContainer;
}

//VIEW
function render_quest_section(questData){
    let questSection = create_section({element: 'section', class_to_add: 'quest-section'});
    let questTitle = create_text_element({element: 'h2', text: title_case(questData.name)})

    let questboxesSection = document.createElement('ul');
    questboxesSection.classList.add('quest-boxes');
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

//VIEW
function add_skills_logic(){
    const content = get_and_reveal('add-skill-popup')
    let fail_popup = document.getElementById('fail-popup');
    let fail_reason = document.getElementById('fail-reason');
    const add = document.getElementById('confirm-add-skill');
    const cancel = document.getElementById('cancel-add-skill');
    let skill_input = document.getElementById('skill-input');
    let tasks_input = document.getElementById('tasks-count-input')
    let task_mode = document.getElementById('task-mode-select')

    task_mode.selectedIndex = 0;
    
    cancel.addEventListener('click', () => {
        content.classList.add('hidden');

        fail_popup.classList.add('hidden');
        fail_reason.classList.add('hidden');
    })

    add.onclick = () => {
        let result = validate_skill_name(skill_input.value)
        if (!result.success){
            failure_popup(result.reason)
        } else if (task_mode.value === "") {
            failure_popup("Please select a task mode.")
        } else {
            add_skill(result.normalizedName)
            create_new_quest_data(result.normalizedName, Number(tasks_input.value), task_mode.value)
            render_all_skills(get_all_skill_info())
            render_quest_board(get_all_quest_data())
            initialize_quest_listeners()
            render_manage_skills_modal(get_all_skill_info())
            save_skills();
            save_quests();
            skill_input.value = ""
            content.classList.add('hidden');
        }
    }
}

// ============================
//Manage Skills Modal Rendering
// ============================

//COMPONENT
function create_milestone_task_modal(){
    let taskLabel = create_text_element({element: 'label', text: "Task Name"});
    let nameInput = create_input({type: 'text', placeholder: "Enter task name", id: 'name-input'});
    let inputContainer = create_section({element: 'div', class_to_add: 'task-input-row'});

    nameInput.addEventListener('focus', () => {
        nameInput.select();
    });

    taskLabel.setAttribute('for', 'name-input');

    inputContainer.append(taskLabel);
    inputContainer.append(nameInput);

    let returnObject = {
        mode: "milestone",
        element: inputContainer,
        getData() {
            return {
                mode: "milestone",
                name: nameInput.value.trim()
            };
        },
        focus() {
            nameInput.focus();
        },
        getInput() {
            return nameInput;
        },
        isEmpty() {
            return nameInput.value.trim() === "";
        },
        clear() {
            nameInput.value = "";
        },
        setName(newName) {
            nameInput.value = newName;
        }
    }
    return returnObject;
}

function create_timed_task_modal(){
    
}

//CONTROLLER
function task_modal_controller(mode){
    let builder;

    switch (mode){
        case "milestone":
            builder = create_milestone_task_modal();
            break;
    }
    modal.setContent(builder.element);
    builder.focus();

    modal.onSubmit(() => {
        if (builder.isEmpty()){
            return;
        } else {
           let data = builder.getData();
           save_task(data)
           builder.clear();
           modal.close();
        }
    })
}

//CONTROLLER
function task_changed(skillName, index){
    const task = quests[skillName].tasks[index];
    const playerState = {
        globalXP: xp,
        skillXP: skills[skillName].xp,
        streak,
        globalLevel: calculate_level(xp, 10),
        skillLevel: calculate_level(skills[skillName].xp, 5)};
    const xpBundle = apply_task_xp(task.config, playerState);
    
    apply_xp_effects(skillName, xpBundle);
    render_quest_board(get_all_quest_data());
    render_all_skills(get_all_skill_info());
}

function save_task(data){
    switch(data.mode){
        case "milestone":
            save_milestone_task(data.name)
    }
    // persistence save
    task_changed(data);
}

function save_milestone_task(name){
    console.log(name);
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
        if (questData.mode !== "repeated"){
        choose_nameable_tasks_modal(questData);
    } else {
        render_repeated_tasks_modal(questData);
    }
    })

    skill_actions.append(rename_button)
    skill_actions.append(delete_button)
    skill_actions.append(task_manage_button)

    skill_row.append(skill);
    skill_row.append(skill_actions);
    
    return skill_row;
}

//CONTROLLER
function choose_nameable_tasks_modal(questData){
    const popup = clear_container({element: '#tasks-modal', willReveal: true});

    switch (questData.mode){
        case "milestone":
            render_milestone_tasks_modal(questData)
            break;

        case "timed":
            render_timed_tasks_modal(questData);
            break;
    }

    return popup;
}

//COMPONENT
function render_milestone_tasks_modal(questData){
    const popup = document.getElementById('tasks-modal');

    let buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});
    
    let exit_button = create_button("Exit");
    exit_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    let add_button = create_button("+ Add Task");
    add_button.addEventListener('click', () => {
        let create_task_modal = document.getElementById('create-task-modal');
        create_task_modal.replaceChildren();
        create_task_modal.classList.remove('hidden');
        let modal_header = document.createElement('h2');
        let task_name = document.createElement('input');
        let confirm_button = document.createElement('button');
        let cancel_button = document.createElement('button');
        let button_section = document.createElement('div');

        button_section.classList.add('popup-buttons')

        modal_header.textContent = "New Task";
        confirm_button.textContent = "Confirm";
        cancel_button.textContent = "Cancel";

        task_name.value = "Enter Task Name";

        confirm_button.addEventListener('click', () => {
            quest_to_add_task_to = questData.tasks;
            quest_to_add_task_to.push({skillName: questData.tasks[0].skillName, name: title_case(task_name.value), completed: false});
            render_milestone_tasks_modal(questData);
            save_quests();
            render_quest_board(get_all_quest_data());
            create_task_modal.classList.add('hidden');
        })

        cancel_button.addEventListener('click', () => {
            create_task_modal.classList.add('hidden');
        })

        button_section.append(confirm_button);
        button_section.append(cancel_button);

        create_task_modal.append(modal_header);
        create_task_modal.append(task_name);
        create_task_modal.append(button_section);
    })
    
    for (let i = 0; i < questData.tasks.length; i++){
        let task_container = create_section({element: 'div', class_to_add: 'manage-skill-skill-row'})
        let taskName = document.createElement('p');
        let rename_button = create_button("Rename\nTask")
        let remove_button = create_button("Remove\nTask")
        

        if (!questData.tasks[i].name){
            taskName.textContent = "Unnamed Task";
        } else {
            taskName.textContent = questData.tasks[i].name;
        }

        rename_button.addEventListener('click', () => {
            render_rename_task_modal(questData.tasks[i]);
        })
      
        remove_button.addEventListener('click', () => {
            remove_button.parentElement.remove();
            questData.tasks.splice(i, 1);
            save_quests();
            render_quest_board(get_all_quest_data());
        })

        task_container.append(taskName);
        task_container.append(rename_button);
        task_container.append(remove_button);

        popup.append(task_container);
    }
    buttons_section.append(add_button);
    buttons_section.append(exit_button);

    popup.append(buttons_section);
}

//COMPONENT
function render_rename_task_modal(questData){
    const popup = clear_container({element:'#rename-task-modal', willReveal: true})
    let input = create_input({type: 'text', id: 'rename-task-input'});
    let heading = create_text_element({element: 'h2', text: "Rename Skill"});

    let confirm_button = create_button('Confirm')
    let cancel_button = create_button('Cancel')
    let buttons_section = create_section({element: 'div', class_to_add: 'modal-buttons'});

    confirm_button.addEventListener('click', () => {
        popup.classList.add('hidden');
        questData.name = title_case(input.value);
        save_quests();
        render_quest_board(get_all_quest_data());
        choose_nameable_tasks_modal(quests[questData.skillName])
    })

    cancel_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    buttons_section.append(confirm_button);
    buttons_section.append(cancel_button);

    popup.append(heading);
    popup.append(input);
    popup.append(buttons_section);
}

//COMPONENT
function render_timed_tasks_modal(questData){
    const popup = document.getElementById('tasks-modal');
    
    let add_button = create_button("+ Add Task");
    let exit_button = create_button("Exit");
    let buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});

    add_button.addEventListener('click', () => {
        let create_task_modal = clear_container({element: '#create-task-modal', willReveal: true})
        create_task_modal.classList.add('popup-label');

        let modal_header = create_text_element({element: 'h2', text: "New Task"});
        let task_name = create_input({type: 'text', placeholder: "Enter Task Name"});
        let task_duration = create_input({type: 'number', placeholder: 'Min'});
        let confirm_button = create_button("Confirm");
        let cancel_button = create_button("Cancel");
        let button_section = create_section({element: 'div', class_to_add: 'popup-buttons'});

        task_name.addEventListener('focus', (event) => {
            event.target.select();
        })

        confirm_button.addEventListener('click', () => {
            quest_to_add_task_to = questData.tasks;
            quest_to_add_task_to.push({skillName: questData.tasks[0].skillName, name: title_case(task_name.value), duration:task_duration.value, completed: false});
            choose_nameable_tasks_modal(questData);
            save_quests();
            render_quest_board(get_all_quest_data());
            create_task_modal.classList.add('hidden');
        })

        cancel_button.addEventListener('click', () => {
            create_task_modal.classList.add('hidden');
        })

        button_section.append(confirm_button);
        button_section.append(cancel_button);

        create_task_modal.append(modal_header);
        create_task_modal.append(task_name);
        create_task_modal.append(task_duration);
        create_task_modal.append(button_section);

    })

    exit_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    //left off here
    for (let i = 0; i <questData.tasks.length; i++){
        let task_container = create_section({element: 'div', class_to_add: 'manage-skill-skill-row'});
        let task_name = create_text_element({element: 'p', text: questData.tasks[i].name  || "Unnamed Task"})
        let remove_button = create_button("Remove Task");
        let edit_button = create_button("Edit Task");

        task_name.textContent += ` (${questData.tasks[i].duration} min)`

        remove_button.addEventListener('click', () => {
            remove_button.parentElement.remove();
            questData.tasks.splice(i, 1);
            save_quests();
            render_quest_board(get_all_quest_data());
        })

        edit_button.onclick = () => {
            let edit_popup = clear_container({element: '#edit-task-modal', willReveal: true})
            edit_popup.classList.add('popup-label');

            let task_label = create_text_element({element: 'h2', text: questData.tasks[i].name || "Unnamed Task"})
            let task_duration = create_text_element({element: 'p', text: `${questData.tasks[i].duration} min`})
            let new_name = create_input({type: 'text', value: questData.tasks[i].name})
            let new_duration = create_input({type: 'number'})
            let edit_buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});
            let confirm_button = create_button("Confirm");
            let cancel_button = create_button("Cancel");

            confirm_button.addEventListener('click', () => {
                questData.tasks[i].name = title_case(new_name.value);
                questData.tasks[i].duration = new_duration.value;
                save_quests();
                render_quest_board(get_all_quest_data());
                choose_nameable_tasks_modal(quests[questData.tasks[i].skillName])
                edit_popup.classList.add('hidden');
            })

            cancel_button.addEventListener('click', () => {
                edit_popup.classList.add('hidden');
            })

            edit_buttons_section.append(confirm_button);
            edit_buttons_section.append(cancel_button);

            edit_popup.append(task_label);
            edit_popup.append(task_duration);
            edit_popup.append(new_name);
            edit_popup.append(new_duration);
            edit_popup.append(edit_buttons_section);
        }

        task_container.append(task_name);
        task_container.append(remove_button);
        task_container.append(edit_button);

        buttons_section.append(add_button);
        buttons_section.append(exit_button);

        popup.append(task_container);
    }
    popup.append(buttons_section);
}

//COMPONENT
function render_repeated_tasks_modal(questData){
    const popup = clear_container({element: '#tasks-modal', willReveal: true})
    let add_task_button = create_button("+ Add Task");
    let exit_button = create_button("Exit");
    let buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});

    exit_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    add_task_button.addEventListener('click', () => {
        create_new_quest_data(questData.tasks[0].skillName, (questData.tasks.length + 1), questData.mode);
        render_repeated_tasks_modal(quests[questData.tasks[0].skillName])
        save_quests();
        render_quest_board(get_all_quest_data());
    })

    for (let i = 0; i < questData.tasks.length; i++){
        let task_container = create_section({element: 'div', class_to_add: 'manage-skill-skill-row'});
        let task_name = create_text_element({element: 'p', text: questData.tasks[i].name  || "Unnamed Task"})
        let remove_button = create_button("Remove Task");
        let edit_button = create_button("Edit Task");

        remove_button.addEventListener('click', () => {
            remove_button.parentElement.remove();
            questData.tasks.splice(i, 1);
            save_quests();
            render_quest_board(get_all_quest_data());
        })

        edit_button.onclick = () => {
            let edit_popup = clear_container({element: '#edit-task-modal', willReveal: true})
            let task_label = create_text_element({element: 'p', text: questData.tasks[i].name  || "Unnamed Task"})
            let rep_count = create_input({type: 'number', placeholder: 'repetitions'});
            let edit_buttons_section = create_section({element: 'div', class_to_add: 'popup-buttons'});
            let confirm_button = create_button("Confirm");
            let cancel_button = create_button("Cancel");

            confirm_button.addEventListener('click', () => {
                questData.tasks[i].duration = rep_count.value;
                save_quests();
                render_quest_board(get_all_quest_data());
                render_repeated_tasks_modal(quests[questData.tasks[i].skillName])
                edit_popup.classList.add('hidden');
            })

            cancel_button.addEventListener('click', () => {
                edit_popup.classList.add('hidden');
            })

            edit_buttons_section.append(confirm_button);
            edit_buttons_section.append(cancel_button);

            edit_popup.append(task_label);
            edit_popup.append(task_duration);
            edit_popup.append(rep_count);
            edit_popup.append(edit_buttons_section);
        }

        task_container.append(task_name);
        task_container.append(remove_button);
        task_container.append(edit_button);

        popup.append(task_container)
    }

    buttons_section.append(add_task_button);
    buttons_section.append(exit_button);
    popup.append(buttons_section);
}


//COMPONENT
function render_confirm_delete_popup(skillName){
    const popup = clear_container({element: '#confirm-delete', willReveal: true})
    let skillToDelete = create_text_element({element: 'h2', text: "Confirm delete: " + skillName})
    let warning = create_text_element({element: 'p', text: "Once deleted, data cannot be retrieved and must be remade from scratch."})
    let confirm = create_button("Confirm");
    let cancel = create_button("Cancel");
    let buttonsRow = create_section({element: 'div', class_to_add: 'popup-buttons'});

    confirm.addEventListener('click', ()=> {
        delete_skill(skillName);
        popup.classList.add('hidden');
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

//COMPONENT
function render_rename_modal(oldName){
    const popup = document.getElementById('rename-modal');
    const confirm = document.getElementById('confirm-rename-skill');
    const cancel = document.getElementById('cancel-rename-skill');
    let input = document.getElementById('rename-input');

    confirm.onclick = () => {
        let result = validate_skill_name(input.value)
        if (result.success){
            rename_skill(oldName, result.normalizedName)
            render_all_skills(get_all_skill_info())
            render_quest_board(get_all_quest_data())
            initialize_quest_listeners();
            save_skills();
            save_quests();
            popup.classList.add('hidden');
        } else {
            failure_popup(result.reason)
        }
    }

    cancel.onclick = () => {
        popup.classList.add('hidden');
    }

    popup.classList.remove('hidden');
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