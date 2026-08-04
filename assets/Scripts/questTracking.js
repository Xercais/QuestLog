//===========================
//Data
//===========================

const checkboxes = document.querySelectorAll('.quest-boxes input')

//===========================
//Initialize
//===========================

function initialize_quest_listeners(){
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(event){
            if (this.checked){
                increase_XP(10);
                save_checkbox_states();
                checkbox.disabled = true;
                let skillName = ((checkbox.closest('section').querySelector('h3')).textContent.toLowerCase());
                increase_skill_xp(skillName, 20);
            }
        });
    });
}

//===========================
//Save/Load
//===========================

function save_checkbox_states(){
    let checkbox_saves = [];
    checkboxes.forEach(checkbox =>{
        checkbox_saves.push(checkbox.checked)
    })
    let checkbox_states = JSON.stringify(checkbox_saves);
    localStorage.setItem('checkbox_state', checkbox_states)
}

function load_checkbox_states(){
    let saved_states = JSON.parse(localStorage.getItem('checkbox_state'))
    if (saved_states === null){
            return
    } 

    for (let i = 0; i < saved_states.length; i++){
        if (saved_states[i]){
            checkboxes[i].checked = true;
            checkboxes[i].disabled = true;
        }
    }
} 

//===========================
//Daily Reset
//===========================

function save_date(date){
    localStorage.setItem('last_reset_day', date)
}

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

function daily_reset(){
    let fresh_checkboxes = [];
    for (let i = 0; i < checkboxes.length; i++){
        fresh_checkboxes.push(false);
    }
    check_if_streak_increments();
    localStorage.setItem('checkbox_state', JSON.stringify(fresh_checkboxes));
}

//===========================
//Streak logic
//===========================

function check_if_streak_increments(){
    let last_day = JSON.parse(localStorage.getItem('checkbox_state'));
    if (last_day === null){
        return
    } else {
        let counter = 0;
        for (let i = 0; i < last_day.length; i++){
        if(last_day[i]){
            counter++;
            }
        } if (counter === last_day.length){
            streak_handling(true)
        } else {
            streak_handling(false)
        }
        
    }
    
}

function streak_handling(isIncrementing){
    if (isIncrementing){
        streak += 1;
        compare_to_best_streak(streak);
        localStorage.setItem('current_streak', streak);
    } else {
        streak = 0;
        localStorage.setItem('current_streak', streak);
    }
    
}

function compare_to_best_streak(streak){
    let best_streak = localStorage.getItem('best_streak')
    if (best_streak === null){
        localStorage.setItem('best_streak', streak)
    } else if (parseInt(best_streak) < streak) {
        localStorage.setItem('best_streak', streak)
    } else {
        return
    }
}

function load_streak(){
    let current_streak = localStorage.getItem('current_streak')
    let best_streak = localStorage.getItem('best_streak')
    if (current_streak !== null && bestStreak !== null){
        streak = parseInt(current_streak);
        bestStreak = parseInt(best_streak);
    }
}