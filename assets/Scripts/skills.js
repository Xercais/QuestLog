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

//MODEL
function create_skill_data(skillName){
    return {
        name: skillName,
        xp: skills[skillName].xp,
        level: calculate_level(skills[skillName].xp, 5)
    };
}

//MODEL
function add_skill(skillName){
    construct_new_skill(skillName)
    
}

//MODEL
function rename_skill(oldName, newName){
    skills[newName] = skills[oldName];
    quests[newName] = quests[oldName];
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

//MODEL
function construct_new_skill(skillName){
    skills[skillName] = {xp: 0}
}

//MODEL
function remove_skill_data(skillName){
    delete skills[skillName];
    delete quests[skillName];
}

//MODEL
function delete_skill(skillName){
    if (skills[skillName]){
        remove_skill_data(skillName);
        return {success: true,}
    } else {
        return{success: false, 
            reason: "Not a Valid Skill Entry. Please wait/refresh and try again."
        }
    }
}

function set_skills_for_testing(testSkills){
    skills = testSkills;
}

if (typeof module !== "undefined"){
    module.exports = {
        validate_skill_name,
        set_skills_for_testing
    }
}