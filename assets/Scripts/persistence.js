//function that loads global xp and updates the display
function load_xp(){
    let stored_xp = localStorage.getItem('current_xp')
    if (stored_xp !== null){
        xp = parseInt(stored_xp, 10);
        update_global_level(xp);
    }
}

function save_xp(){
    localStorage.setItem('current_xp', xp)
}

function load_skills(){
    stored_skills = localStorage.getItem('skills')
    if (stored_skills !== null){
        skills = JSON.parse(stored_skills)
    }
}

function save_skills(){
    localStorage.setItem('skills', JSON.stringify(skills))
}

//saves current state of checkboxes. function is called everytime a box is checked
function save_quests(){
    localStorage.setItem('quests', JSON.stringify(quests))
}

//retrieves the saved state of checkboxes if the save state exists and restores it
function load_quests(){
    let saved_quests = localStorage.getItem('quests')
    if (saved_quests !== null){
        quests = JSON.parse(saved_quests)
    }    
} 

function save_current_streak(streak){
    localStorage.setItem('current_streak', streak);
}

function save_current_bestStreak(streak){
    localStorage.setItem('best_streak', streak)
}

function save_task_completion(skillName, index){
    quests[skillName].tasks[index].completed = true;
}