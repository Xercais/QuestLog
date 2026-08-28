function update_xp_display(){
    xpDisplay.textContent = "XP: " + xp;
}

function update_level_display(level){
    levelDisplay.textContent = "Level: " + level;
}

//function that sets skill name to title case and returns it to be used for the display
function title_case_skill_name(skillName){
    firstLetter = skillName.charAt(0).toUpperCase();
    restOfWord = skillName.slice(1);
    return firstLetter + restOfWord;
}

function update_streak_display(){
    streakDisplay.textContent = "Streak: " + streak;
}

function update_bestStreak_display(){
    bestStreakDisplay.textContent = "Best Streak: " + bestStreak;
}

// ============================
//Skill Summary Rendering
// ============================
function render_skill(skillInfo){
    let skillCard = document.createElement('div');
    skillCard.classList.add('skill-card');
    let skillName = document.createElement('h2');
    let skillXP = document.createElement('p');
    let skillLevel = document.createElement('p');

    skillName.textContent = title_case_skill_name(skillInfo.name);
    skillXP.textContent = "XP: " + skillInfo.xp;
    skillLevel.textContent = "Level: " + skillInfo.level;

    skillCard.append(skillName);
    skillCard.append(skillXP);
    skillCard.append(skillLevel);
    
    return skillCard;
}

function render_all_skills(skillCollection){
    let skillsContainer = document.querySelector('#skills-container');
    skillsContainer.replaceChildren();
    for (let i = 0; i < skillCollection.length; i++){
        skillsContainer.append(render_skill(skillCollection[i]));
    }
}

// ============================
//Quest Board Rendering
// ============================
function render_quest_checkbox(isChecked, task){
    let questContainer = document.createElement('li');
    let questBox = document.createElement('input');
    let taskLabel = document.createElement('span');

    questBox.type = 'checkbox';
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
    } else {
        taskLabel.textContent = `Task ${task.number}`
    }

    if (Object.hasOwn(task, "duration")){
            taskLabel.textContent += ` (${task.duration} min)`;
    }

    questContainer.append(questBox);
    questContainer.append(taskLabel);

    return questContainer;
}

function render_quest_section(questdata){
    let questSection = document.createElement('section');
    questSection.classList.add('quest-section');

    let questTitle = document.createElement('h2');
    questTitle.textContent = title_case_skill_name(questdata.name);

    let questboxesSection = document.createElement('ul');
    questboxesSection.classList.add('quest-boxes');
    for(let i = 0; i < questdata.tasks.length; i++){
        questboxesSection.append(render_quest_checkbox(questdata.tasks[i].completed, questdata.tasks[i]))
    };

    questSection.append(questTitle);
    questSection.append(questboxesSection);

    return questSection;
}

function render_quest_board(questCollection){
    let questContainer = document.querySelector('#quests-container')
    questContainer.replaceChildren();
    for (let i = 0; i < questCollection.length; i++){
        questContainer.append(render_quest_section(questCollection[i]));
    }
}

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
function render_manage_skills_modal(skillInfo){
    let popup = document.getElementById('manage-skills-popup')
    const overlay = document.getElementById('manage-skills-overlay')
    popup.replaceChildren();

    for (let i = 0; i < skillInfo.length; i++){
        popup.append(render_manage_skill_row(skillInfo[i]))
    };
    popup.append(render_manage_modal_buttons());

    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function render_manage_skill_row(skillInfo){
    let skill_row = document.createElement('div');
    let skill = document.createElement('p');
    let skill_actions = document.createElement('div')
    let rename_button = document.createElement('button');
    let delete_button = document.createElement('button');
    let task_manage_button = document.createElement('button');

    skill_row.classList.add('manage-skill-skill-row');
    skill_actions.classList.add('skill-actions')

    skill.textContent = title_case_skill_name(skillInfo.name);
    rename_button.textContent = "Rename";
    delete_button.textContent = "Delete";
    task_manage_button.textContent = "Tasks";
    

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

function choose_nameable_tasks_modal(questData){
    const popup = document.getElementById('tasks-modal');
    popup.classList.remove('hidden');
    popup.replaceChildren();

    switch (questData.mode){
        case "custom":
            render_custom_tasks_modal(questData)
            break;
    }
}

function render_custom_tasks_modal(questData){
    const popup = document.getElementById('tasks-modal');
    popup.replaceChildren();

    let buttons_section = document.createElement('div');
    buttons_section.classList.add('popup-buttons');
    
    let exit_button = document.createElement('button');
    exit_button.textContent = "Exit"
    exit_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    let add_button = document.createElement('button');
    add_button.textContent = "+ Add Task";
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
            quest_to_add_task_to.push({skillName: questData.tasks[0].skillName, name: task_name.value, completed: false});
            render_custom_tasks_modal(questData);
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
        let task_container = document.createElement('div');
        let taskName = document.createElement('p');
        let rename_button = document.createElement('button');
        let remove_button = document.createElement('button');
        
        task_container.classList.add('manage-skill-skill-row')

        if (!questData.tasks[i].name){
            taskName.textContent = "Unnamed Task";
        } else {
            taskName.textContent = questData.tasks[i].name;
        }

        rename_button.textContent = "Rename\nTask"
        rename_button.addEventListener('click', () => {
            render_rename_task_modal(questData.tasks[i]);
        })

        
        remove_button.textContent = "Remove\nTask";       
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

function render_rename_task_modal(questData){
    const popup = document.getElementById('rename-task-modal');
    popup.replaceChildren();
    popup.classList.remove('hidden');

    let input = document.createElement('input');
    let heading = document.createElement('h2');

    input.type = 'text';
    input.id = 'rename-task-input';
    heading.textContent = "Rename Skill";

    let confirm_button = document.createElement('button');
    let cancel_button = document.createElement('button');
    let buttons_section = document.createElement('div')

    buttons_section.classList.add('modal-buttons')

    confirm_button.textContent = "Confirm";
    cancel_button.textContent = "Cancel";

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

function title_case(text){
    return text.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function render_repeated_tasks_modal(questData){
    const popup = document.getElementById('tasks-modal');
    popup.classList.remove('hidden');
    popup.replaceChildren();
    
    let exit_button = document.createElement('button');
    exit_button.textContent = "Exit";
    exit_button.addEventListener('click', () => {
        popup.classList.add('hidden');
    })

    let add_task_button = document.createElement('button');
    add_task_button.textContent = "+ Add Task";
    add_task_button.addEventListener('click', () => {
        create_new_quest_data(questData.tasks[0].skillName, (questData.tasks.length + 1), questData.mode);
        render_repeated_tasks_modal(quests[questData.tasks[0].skillName])
        save_quests();
        render_quest_board(get_all_quest_data());
    })

    let buttons_section = document.createElement('div');
    buttons_section.classList.add('popup-buttons');

    for (let i = 0; i < questData.tasks.length; i++){
        let task_container = document.createElement('div');
        let task_name = document.createElement('p')
        let remove_button = document.createElement('button')
        let edit_button = document.createElement('button');
    
        task_name.textContent = `Task ${(i + 1)}`;
        remove_button.textContent = 'Remove';
        edit_button.textContent = "Edit Task";

        task_container.classList.add('manage-skill-skill-row');

        remove_button.addEventListener('click', () => {
            remove_button.parentElement.remove();
            questData.tasks.splice(i, 1);
            save_quests();
            render_quest_board(get_all_quest_data());
        })

        edit_button.onclick = () => {
            let edit_popup = document.getElementById('edit-task-modal');
            edit_popup.classList.remove('hidden');
            edit_popup.replaceChildren();

            let task_label = document.createElement('h2');
            let task_duration = document.createElement('p');
            let new_duration = document.createElement('input');
            let edit_buttons_section = document.createElement('div');
            let confirm_button = document.createElement('button');
            let cancel_button = document.createElement('button');

            task_label.textContent = `Task ${(i + 1)}`;
            task_duration.textContent = `${questData.tasks[i].duration} min`;
            new_duration.type = 'number'
            confirm_button.textContent = "Confirm";
            cancel_button.textContent = "Cancel";

            edit_buttons_section.classList.add('popup-buttons');

            confirm_button.addEventListener('click', () => {
                questData.tasks[i].duration = new_duration.value;
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
            edit_popup.append(new_duration);
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



function render_confirm_delete_popup(skillName){
    const popup = document.getElementById('confirm-delete');
    popup.replaceChildren();
    let skillToDelete = document.createElement('h2');
    let warning = document.createElement('p');
    let confirm = document.createElement('button');
    let cancel = document.createElement('button');
    let buttonsRow = document.createElement('div');

    popup.classList.remove('hidden');
    buttonsRow.classList.add('popup-buttons');

    skillToDelete.textContent = "Confirm delete: " + skillName;
    warning.textContent = "Once deleted, data cannot be retrieved and must be remade from scratch.";
    confirm.textContent = "Confirm";
    cancel.textContent = "Cancel";

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

function render_manage_modal_buttons(){
    let button_row = document.createElement('div');
    let add_skills = document.createElement('button')
    let close_manage_modal = document.createElement('button')
    let overlay = document.getElementById('manage-skills-overlay')
    let popup = document.getElementById('manage-skills-popup')

    button_row.classList.add('modal-buttons')

    add_skills.textContent = "+ Add Skill";
    close_manage_modal.textContent = "Close";

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