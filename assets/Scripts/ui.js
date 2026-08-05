function update_xp_display(){
    xpDisplay.textContent = "XP: " + xp;
}

function update_level_display(level){
    levelDisplay.textContent = "Level: " + level;
}

//function that sets skill name to title case and returns it to be used for the display
function title_case_skill_name(skillName){
    firstLetter = skillName.charAt(0).toUpperCase();
    restOfWord = skillName.slice(1);
    return firstLetter + restOfWord;
}



function update_streak_display(){
    streakDisplay.textContent = "Streak: " + streak;
}

function update_bestStreak_display(){
    bestStreakDisplay.textContent = "Best Streak: " + bestStreak;
}