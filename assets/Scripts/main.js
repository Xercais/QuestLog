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
levelDisplay.textContent = "Level: " + level;

//===========================
//XP
//===========================
let xp = 0;
load_xp();
xpDisplay.textContent = "XP: " + xp;

//===========================
//Streak
//===========================
let streak = 0;
let bestStreak = 0;
load_streak();
check_for_reset();
streakDisplay.textContent = "Streak: " + streak;
bestStreakDisplay.textContent = "Best Streak: " + bestStreak;
 
//===========================
//Startup
//===========================
initialize_quest_listeners();
load_skills();
load_checkbox_states();

