//===========================
//Data
//===========================

let skills = {
    art: {
        xp: 0
    },
    guitar: {
        xp: 0
    },
    coding: {
        xp: 0
    },
    workout: {
        xp: 0
    }
}

//===========================
//Calculations
//===========================

//skillName is acquired from the checkboxes, function can be found in initialize_quest_listeners() in questTracking.js
function increase_skill_xp(skillName, xp_to_add){
    skills[skillName].xp += xp_to_add;
    save_skills();
}

function iterate_through_skills(){
    let keys = Object.keys(skills)
    return keys
}

function get_all_skill_info(){
    let skill_data = [];
    for (skillName of iterate_through_skills()){
        skill_data.push(create_skill_data(skillName));
    }
    return skill_data;
}

function create_skill_data(skillName){
    return {
        name: skillName,
        xp: skills[skillName].xp,
        level: calculate_level(skills[skillName].xp, 5)
    };
}

function add_skill(skillName){
    let normalizedName = skillName.toLowerCase();
    let return_data = {};

    if (normalizedName.trim().length === 0){
        return_data.success = false;
        return_data.reason = "Skill Name Cannot Be Empty or WhiteSpace";

        return return_data;
    }
    if (skills[normalizedName]){
        return_data.success = false;
        return_data.reason = "Skill Already Exists";

        return return_data;
    } else {
        construct_new_skill(normalizedName)

        return_data.success = true;
        return return_data;
    }
}

function construct_new_skill(skillName){
    skills[skillName] = {xp: 0}
}

function add_skills_logic(){
    const content = document.getElementById('add-skill-popup');
    let fail_popup = document.getElementById('failed-to-add-skill');
    let fail_reason = document.getElementById('fail-reason');
    const overlay = document.getElementById('popup-overlay');
    const add = document.getElementById('confirm-add-skill');
    const cancel = document.getElementById('cancel-add-skill');
    let input = document.getElementById('skill-input');

    content.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    cancel.addEventListener('click', () => {
        content.classList.add('hidden');
        overlay.classList.add('hidden');

        fail_popup.classList.add('hidden');
        fail_reason.classList.add('hidden');
    })

    add.addEventListener('click', () => {
        let result = add_skill(input.value)
        if (result.success){
            create_new_quest_data(input.value)
            render_all_skills(get_all_skill_info(skills))
            render_quest_board(get_all_quest_data(quests))
            save_skills();
            content.classList.add('hidden');
            overlay.classList.add('hidden');
        } else {
            failure_popup(result.reason)
        }
    })
}

function manage_skills_logic(questData){
    const button = document.getElementById('manage-skills');
    const overlay = document.getElementById('manage-skills-overlay')
    const popup = document.getElementById('manage-skills-popup')

    button.addEventListener('click', () => {
        popup.replaceChildren()
        for (let i = 0; i < questData.length; i++){
            popup.append(render_manage_skill_row(questData[i]))
        }
        popup.append(render_manage_modal_buttons())
        popup.classList.remove('hidden')
        overlay.classList.remove('hidden')
    })
}

function render_manage_skill_row(questData){
    let skill_row = document.createElement('div');
    let skill = document.createElement('p');
    let skill_actions = document.createElement('div')
    let rename_skill = document.createElement('button');
    let delete_skill = document.createElement('button');
    let linebreak = document.createElement('br');

    skill_row.classList.add('manage-skill-skill-row');
    skill_actions.classList.add('skill-actions')

    skill.textContent = title_case_skill_name(questData.name);
    rename_skill.textContent = "Rename";
    delete_skill.textContent = "Delete";

    skill_actions.append(rename_skill)
    skill_actions.append(delete_skill)

    skill_row.append(skill);
    skill_row.append(skill_actions);
    
    return skill_row;
}

function render_manage_modal_buttons(){
    let button_row = document.createElement('div');
    let linebreak = document.createElement('br');
    let skills_modal_button = document.createElement('button')
    let close_manage_modal_button = document.createElement('button')
    let overlay = document.getElementById('manage-skills-overlay')
    let popup = document.getElementById('manage-skills-popup')

    button_row.classList.add('modal-buttons')

    skills_modal_button.textContent = "+ Add Skill";
    close_manage_modal_button.textContent = "Close";

    skills_modal_button.addEventListener('click', ()=>{
        add_skills_logic();
    })

    close_manage_modal_button.addEventListener('click', ()=>{
        overlay.classList.add('hidden');
        popup.classList.add('hidden');
    })

    button_row.append(skills_modal_button);
    button_row.append(close_manage_modal_button);
    
    return button_row;
}

