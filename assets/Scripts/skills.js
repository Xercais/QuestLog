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
