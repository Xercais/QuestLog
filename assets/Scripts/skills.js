//===========================
//Data
//===========================

let skills = {
    art: {
        xp: 0,
        level: 1
    },
    guitar: {
        xp: 0,
        level: 1,
    },
    coding: {
        xp: 0,
        level: 1
    },
    workout: {
        xp: 0,
        level: 1
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

function get_all_skill_info(skills){
    let skill_data = [];
    let keys = Object.keys(skills);
    for (skillName of keys){
        skill_entry = {};
        skill_entry.name = skillName;
        skill_entry.xp = skills[skillName].xp;
        skill_entry.level = calculate_level(skills[skillName].xp, 5);
        skill_data.push(skill_entry);
    }
    return skill_data;
}
