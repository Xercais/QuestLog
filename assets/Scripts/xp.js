//===========================
//Calculations
//===========================

//function that increases global xp
function increase_XP(xp_to_add){
    xp += xp_to_add;
    update_xp_display();
    save_xp();
    update_global_level(xp);
}

//function that calculates global and skill level, then returns it
function calculate_level(current_total_xp, scalingFactor){
    let calculated_level = (Math.floor(Math.sqrt(current_total_xp) / scalingFactor)) + 1;
    return calculated_level;
}

//function that updates adventurer level display
function update_global_level(xp){
    level = calculate_level(xp, 10);
    update_level_display(level);
}

function apply_task_xp(task, playerState){
    let baseGlobal = 10;
    let baseSkill = 20;

    if (5 < playerState.streak < 10) {
        baseGlobal += 5;
    }

    if (playerState.globalLevel < 3) {
        baseGlobal *= 1.5;
    }
    return {
        globalXPtoAdd: Math.floor(baseGlobal),
        skillXPtoAdd: Math.floor(baseSkill)
    }
}

function apply_xp_effects(skillName, xpBundle){
    increase_XP(xpBundle.globalXPtoAdd);
    increase_skill_xp(skillName, xpBundle.skillXPtoAdd);
}
