//===========================
//Data
//===========================


let quests = {};

//===========================
//Initialize
//===========================

function initialize_quest_listeners(){
    const checkboxes = document.querySelectorAll('.quest-boxes input')
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(event){
            if (this.checked){
                increase_XP(10);
                save_checkbox_states();
                checkbox.disabled = true;
                let skillName = ((checkbox.closest('section').querySelector('h3')).textContent.toLowerCase());
                increase_skill_xp(skillName, 20);
                render_all_skills(get_all_skill_info());
            }
        });
    });
}

function ensure_quest_data_exists(){
    for (skillName of iterate_through_skills()){
        if (quests?.[skillName]?.checkboxStates){
            continue;
        } else {
            create_new_quest_data(skillName);
        }
    }
}

function create_new_quest_data(skillName){
    let checkbox_states = [false, false, false, false, false, false];
    let quest_entry = {[skillName] : {checkboxStates: checkbox_states}};
    Object.assign(quests, quest_entry);
}

function get_all_quest_data(){
    let quest_data = [];
    for (skillName of iterate_through_skills()){
        quest_data.push(record_quest_data(skillName))
    }

    return quest_data;
}

function record_quest_data(skillName){
    return {
        name: skillName,
        checkboxStates: quests[skillName].checkboxStates
    };
}