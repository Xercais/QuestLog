//===========================
//Data
//===========================

let skills = {}

//===========================
//Calculations
//===========================

//skillName is acquired from the checkboxes, function can be found in initialize_quest_listeners() in questTracking.js
function increase_skill_xp(skillName, xp_to_add){
    skills[skillName].xp += xp_to_add;
    save_skills();
}

function iterate_through_skills(){
    let keys = Object.keys(skills).sort()
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
    construct_new_skill(skillName)
    
}

function rename_skill(oldName, newName){
    skills[newName] = skills[oldName];
    quests[newName] = quests[oldName];

    remove_skill_data(oldName);
    save_skills();
    render_manage_skills_modal(get_all_skill_info(skills));
    render_all_skills(get_all_skill_info(skills));
    render_quest_board(get_all_quest_data(quests));
    
}

function validate_skill_name(skillName){
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
        return_data.success = true;
        return_data.normalizedName = normalizedName;
        return return_data;
    }
    
}

function construct_new_skill(skillName){
    skills[skillName] = {xp: 0}
}

function manage_skills_coordinator(skillInfo){
    const button = document.getElementById('manage-skills');

    button.addEventListener('click', () => {
        render_manage_skills_modal(skillInfo)
    })
}

function remove_skill_data(skillName){
    delete skills[skillName];
    delete quests[skillName];
}

function delete_skill(skillName){
    if (skills[skillName]){
        remove_skill_data(skillName)
        save_skills();
        save_quests();

        render_all_skills(get_all_skill_info(skills));
        render_quest_board(get_all_quest_data(quests));
        initialize_quest_listeners();
        render_manage_skills_modal(get_all_skill_info(skills))
        return {success: true,}
    } else {
        return{success: false, 
            reason: "Not a Valid Skill Entry. Please wait/refresh and try again."
        }
    }
}