//===========================
//Daily Reset
//===========================

//saves the date in local storage
function save_date(date){
    localStorage.setItem('last_reset_day', date)
}

function get_all_task_completion_states(){
    let completions = [];

    Object.values(quests).forEach(quest => {
        quest.tasks.forEach(task => {
            completions.push(task.completed);
        })
    })

    return completions;
}

//determines if a daily reset if necessary
//MODEL
function check_for_reset(){
    let today = new Date().toDateString();
    let last_reset = localStorage.getItem('last_reset_day')
    if (last_reset === null){
        save_date(today);
        return;
    } if(last_reset === today){
        return;
    } else {
        daily_reset();
        save_date(today);
    }

}

//MODEL
function daily_reset(){
    localStorage.setItem("task_completion_snapshot", JSON.stringify(get_all_task_completion_states()))
    check_if_streak_increments();
    
    Object.values(quests).forEach(quest => {
        quest.tasks.forEach(task => {
            task.completed = false;
        });
    });

    save_quests();
}