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
//Load
//===========================

function load_skills(){
    stored_skills = localStorage.getItem('skills')
    if (stored_skills !== null){
        skills = JSON.parse(stored_skills)
        let keys = Object.keys(skills)
        for (skillName of keys){
            update_skill_levels(skillName)
        }
    }
}

//===========================
//Calculations
//===========================

function increase_skill_xp(skillName, xp_to_add){
    skills[skillName].xp += xp_to_add;
    localStorage.setItem('skills', JSON.stringify(skills))
    update_skill_levels(skillName);
}

function update_skill_levels(skillName){
    skills[skillName].level = calculate_level(skills[skillName].xp, 5)
    document.querySelector("#" + skillName + "-level").textContent = `${title_case_skill_name(skillName)}: lvl ${skills[skillName].level}`
}

function title_case_skill_name(skillName){
    firstLetter = skillName.charAt(0).toUpperCase();
    restOfWord = skillName.slice(1);
    return firstLetter + restOfWord;
}
