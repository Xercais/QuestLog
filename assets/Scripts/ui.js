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
function render_quest_checkbox(isChecked){
    let questContainer = document.createElement('li');
    let questBox = document.createElement('input');

    questBox.type = 'checkbox';
    questBox.checked = isChecked;
    if (isChecked){
        questBox.disabled = true;
    }
    questContainer.append(questBox);

    return questContainer;
}

function render_quest_section(questdata){
    let questSection = document.createElement('section');
    questSection.classList.add('quest-section');

    let questTitle = document.createElement('h2');
    questTitle.textContent = title_case_skill_name(questdata.name);

    let questboxesSection = document.createElement('ul');
    questboxesSection.classList.add('quest-boxes');
    for(let i = 0; i < questdata.checkboxStates.length; i++){
        questboxesSection.append(render_quest_checkbox(questdata.checkboxStates[i]))
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
    let input = document.getElementById('skill-input');

    content.classList.remove('hidden');
    
    cancel.addEventListener('click', () => {
        content.classList.add('hidden');

        fail_popup.classList.add('hidden');
        fail_reason.classList.add('hidden');
    })

    add.addEventListener('click', () => {
        let result = validate_skill_name(input.value)
        if (result.success){
            add_skill(result.normalizedName)
            create_new_quest_data(result.normalizedName)
            render_all_skills(get_all_skill_info())
            render_quest_board(get_all_quest_data())
            initialize_quest_listeners()
            render_manage_skills_modal(get_all_skill_info())
            save_skills();
            save_quests();
            content.classList.add('hidden');
        } else {
            failure_popup(result.reason)
        }
    })
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
    let linebreak = document.createElement('br');

    skill_row.classList.add('manage-skill-skill-row');
    skill_actions.classList.add('skill-actions')

    skill.textContent = title_case_skill_name(skillInfo.name);
    rename_button.textContent = "Rename";
    delete_button.textContent = "Delete";

    rename_button.addEventListener('click', () =>{
        render_rename_modal(skillInfo.name)
        
    })

    delete_button.addEventListener('click', ()=> {
        render_confirm_delete_popup(skillInfo.name)
    })

    skill_actions.append(rename_button)
    skill_actions.append(delete_button)

    skill_row.append(skill);
    skill_row.append(skill_actions);
    
    return skill_row;
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
    let linebreak = document.createElement('br');
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