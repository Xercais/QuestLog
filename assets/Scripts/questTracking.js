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
                this.disabled = true;
                let skillName = ((this.closest('section').querySelector('h2')).textContent.toLowerCase());
                let quest_boxes = Array.from(this.closest('section').querySelectorAll('.quest-boxes input'));
                let index = quest_boxes.indexOf(this);
                quests[skillName].tasks[index].completed = true;
                save_quests();
                increase_skill_xp(skillName, 20);
                render_all_skills(get_all_skill_info());
            }
        });
    });
}

function ensure_quest_data_exists(skillName, task_count){
    if (quests?.[skillName]?.tasks){
        return;
    } else {
        create_new_quest_data(skillName, task_count);
    }
}

function create_new_quest_data(skillName, taskCount, taskMode){
    let tasks = [];

    switch (taskMode){
        case "repeated":
            for (let i = 0; i < taskCount; i++){
                tasks.push({completed: false});
            }
            break;

        case "custom":
            for (let i = 0; i < taskCount; i++){
                tasks.push({name: "", completed: false});
            }
            break;
    }

    quests[skillName] = {mode: taskMode, tasks};
}

function get_all_quest_data(){
    let quest_data = [];
    for (skillName of iterate_through_skills()){
        ensure_quest_data_exists(skillName);
        quest_data.push(record_quest_data(skillName))
    }

    return quest_data;
}

function record_quest_data(skillName){
    return {
        name: skillName,
        tasks: quests[skillName].tasks
    };
}