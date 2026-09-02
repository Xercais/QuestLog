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
        checkbox.addEventListener('change', () => {
            if (this.checked){
                this.disabled = true;
                let skillName = ((this.closest('section').querySelector('h2')).textContent.toLowerCase());
                let quest_boxes = Array.from(this.closest('section').querySelectorAll('.quest-boxes input'));
                let index = quest_boxes.indexOf(this);
                save_task_completion(skillName, index)
                save_quests();
                task_changed(skillName, index)
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
            let quest_data = create_repeated_quest_data(i, taskMode);
            tasks.push(quest_data)
        }
        break;

        case "milestone":
            for (let i = 0; i < taskCount; i++){
            let quest_data = create_milestone_quest_data(skillName, taskMode);
            tasks.push(quest_data)
            }
            break;

        case "timed":
            for (let i = 0; i < taskCount; i++){
                let quest_data = create_timed_quest_data(skillName, taskMode)
                tasks.push(quest_data)
            }
            break;
    }

    quests[skillName] = {mode: taskMode, tasks};
}

function create_repeated_quest_data(i, taskMode){
    return {taskMode, number: (i + 1), duration: 0, completed: false, getXPInfo(){
            return {
                taskMode: this.taskMode,
                duration: this.duration,
                difficulty: "easy",
                repetitions: 1,
                isMilestone: false
        }
    }};
}

function create_milestone_quest_data(skillName, taskMode){
    return {taskMode, skillName, name: "", completed: false, getXPInfo(){
            return {
                taskMode: this.taskMode,
                duration: 0,
                difficulty: "easy",
                repetitions: 0,
                isMilestone: true
        }
    }}
}

function create_timed_quest_data(skillName, taskMode){
    return {taskMode, skillName, name: "", duration: 0, completed: false, getXPInfo(){
            return {
                taskMode: this.taskMode,
                duration: this.duration,
                difficulty: "easy",
                repetitions: 0,
                isMilestone: false
        }
    }}
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