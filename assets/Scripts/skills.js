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
    skill_entry = {};
    skill_entry.name = skillName;
    skill_entry.xp = skills[skillName].xp;
    skill_entry.level = calculate_level(skills[skillName].xp, 5);
    return skill_entry;
}

function add_skill(skillName){
    let normalizedName = skillName.toLowerCase();
    let return_data = {};

    if (skills[normalizedName]){
        return_data.success = false;
        return_data.reason = "Skill Already Exists"

        return return_data;
    } else {
        construct_new_skill(normalizedName)

        return_data.success = true;
        return return_data
    }
}

function construct_new_skill(skillName){
    skills[skillName] = {xp: 0}
}

function add_skills_logic(){
    const content = document.getElementById('add-skill-popup');
    const overlay = document.getElementById('popup-overlay');
    const button = document.getElementById('add-skill-button');
    const add = document.getElementById('confirm-add-skill');
    const cancel = document.getElementById('cancel-add-skill');
    let input = document.getElementById('skill-input');
    

    button.addEventListener('click', () => {
        content.classList.remove('hidden');
        overlay.classList.remove('hidden');
    })

    cancel.addEventListener('click', () => {
        content.classList.add('hidden');
        overlay.classList.add('hidden');
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


