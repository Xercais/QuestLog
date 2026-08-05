//===========================
// Display
//===========================
let levelDisplay = document.querySelector('#level-display');
let xpDisplay = document.querySelector('#xp-display');
let streakDisplay = document.querySelector('#streak-display');
let bestStreakDisplay = document.querySelector('#best-streak')
let checkbox_states = localStorage.getItem('checkbox_state');

//===========================
//Level
//===========================
let level = 1;

//===========================
//XP
//===========================
let xp = 0;
load_xp();
update_xp_display();

//===========================
//Streak
//===========================
let streak = 0;
let bestStreak = 0;
load_streak();
check_for_reset();
update_streak_display();
update_bestStreak_display();

 
//===========================
//Startup
//===========================
initialize_quest_listeners();
load_skills();
load_checkbox_states();

