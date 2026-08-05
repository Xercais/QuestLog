//===========================
//Streak logic
//===========================

//logic for checking if the streak increments
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

//logic for handling streaks. if streak increments, also compares current streak to best streak
function streak_handling(isIncrementing){
    if (isIncrementing){
        streak += 1;
        compare_to_best_streak(streak);
        save_current_streak(streak)
    } else {
        streak = 0;
        save_current_streak(streak)
    }
    
}

//logic for comparing and storing best streak
function compare_to_best_streak(streak){
    let best_streak = localStorage.getItem('best_streak')
    if (best_streak === null){
        save_current_bestStreak(streak)
    } else if (parseInt(best_streak) < streak) {
        save_current_bestStreak(streak)
    } else {
        return
    }
}

//function for loading saved streak and best streak and updating the display with those loaded values
function load_streak(){
    let current_streak = localStorage.getItem('current_streak')
    let best_streak = localStorage.getItem('best_streak')
    if (current_streak !== null){
        streak = parseInt(current_streak);
    }

    if (best_streak !== null){
        bestStreak = parseInt(best_streak);
    }
}