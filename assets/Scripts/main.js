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
load_skills();
add_skills_logic();
render_all_skills(get_all_skill_info(skills));
ensure_quest_data_exists(skills);
render_quest_board(get_all_quest_data(quests));
initialize_quest_listeners();

load_checkbox_states();

