//===========================
//Streak logic
//===========================

//logic for checking if the streak increments
//MODEL
function check_if_streak_increments(){
    let yesterday = JSON.parse(localStorage.getItem('task_completion_snapshot'));
    if (yesterday === null){
        return
    } 
    const completed = yesterday.filter(Boolean).length;
    streak_handling(completed === yesterday.length);
}

//logic for handling streaks. if streak increments, also compares current streak to best streak
//MODEL
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
//MODEL
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
//MODEL
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