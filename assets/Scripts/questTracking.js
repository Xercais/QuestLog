//===========================
//Data
//===========================


let quests = {};

//===========================
//Initialize
//===========================

//CONTROLLER
function initialize_quest_listeners(){
    const checkboxes = document.querySelectorAll('.quest-boxes input')
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', event => {
            const checkbox = event.currentTarget;
            if (checkbox.checked){
                checkbox.disabled = true;
                let skillName = ((checkbox.closest('section').querySelector('h2')).textContent.toLowerCase());
                let quest_boxes = Array.from(checkbox.closest('section').querySelectorAll('.quest-boxes input'));
                let index = quest_boxes.indexOf(checkbox);
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
            let quest_data = create_repeated_quest_data({skillName, name: "", repetitions: 1, difficulty: "normal"});
            tasks.push(quest_data)
        }
        break;

        case "milestone":
            for (let i = 0; i < taskCount; i++){
            let quest_data = create_milestone_quest_data({skillName, name: "", difficulty: "normal"});
            tasks.push(quest_data)
            }
            break;

        case "timed":
            for (let i = 0; i < taskCount; i++){
                let quest_data = create_timed_quest_data({skillName, name: "", duration: 1, difficulty: "normal"})
                tasks.push(quest_data)
            }
            break;
    }

    quests[skillName] = {mode: taskMode, tasks};
}

//MODEL
function create_repeated_quest_data(name, repetitions, skillName, difficulty){
    repetitions = Number(repetitions)
    if (!Number.isFinite(repetitions) || repetitions < 1){
        throw new Error (
            "create_repeated_quest_data: repetitions must be >= 1"
        )
    }

    const valid_difficulties = ["easy", "normal", "hard"];
    if (!valid_difficulties.includes(difficulty)){
        throw new Error(
            `Invalid difficulty: ${difficulty}`
        )
    }

    return {skillName, name, completed: false,
        config:{
            taskMode: "repeated",
            difficulty,
            repetitions,
        }
    }
}

//MODEL
function create_milestone_quest_data(name, skillName, difficulty){
    const valid_difficulties = ["easy", "normal", "hard"];
    if (!valid_difficulties.includes(difficulty)){
        throw new Error(
            `Invalid difficulty: ${difficulty}`
        )
    }
    return {skillName, name, completed: false,
        config: {
            taskMode: "milestone",
            difficulty,
        }
    }
}

//MODEL
function create_timed_quest_data(name, skillName, duration, difficulty){
    duration = Number(duration)
    if (!Number.isFinite(duration) || duration < 1){
        throw new Error (
            "create_repeated_quest_data: repetitions must be >= 1"
        )
    }

    const valid_difficulties = ["easy", "normal", "hard"];
    if (!valid_difficulties.includes(difficulty)){
        throw new Error(
            `Invalid difficulty: ${difficulty}`
        )
    }
    return {name, skillName, completed: false, 
        config: {
            taskMode: "timed",
            duration,
            difficulty,
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