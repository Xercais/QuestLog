//===========================
//Daily Reset
//===========================

//saves the date in local storage
function save_date(date){
    localStorage.setItem('last_reset_day', date)
}


//determines if a daily reset if necessary
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


//function for daily reset, clearing the checkboxes and making them clickable again
//also checks if the user successfully completed a day and earns a streak increment
function daily_reset(){
    let fresh_checkboxes = [];
    for (let i = 0; i < checkboxes.length; i++){
        fresh_checkboxes.push(false);
    }
    check_if_streak_increments();
    localStorage.setItem('checkbox_state', JSON.stringify(fresh_checkboxes));
}