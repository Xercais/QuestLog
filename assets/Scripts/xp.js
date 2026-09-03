//===========================
//Calculations
//===========================

//function that increases global xp
//MODEL
function increase_XP(xp_to_add){
    xp += xp_to_add;
    update_xp_display();
    save_xp();
    update_global_level(xp);
}

//MODEL
function calculate_level(current_total_xp, scalingFactor){
    let calculated_level = (Math.floor(Math.sqrt(current_total_xp) / scalingFactor)) + 1;
    return calculated_level;
}

//function that updates adventurer level display
//MODEL
function update_global_level(xp){
    level = calculate_level(xp, 10);
    update_level_display(level);
}

//MODEL
function apply_task_xp(task, playerState){
    let baseGlobal = get_base_global_xp(task);

    let globalXPToAdd = xp_calculation(baseGlobal, playerState, task);
    const skillXPToAdd = globalXPToAdd * 2;

    return {
        globalXPtoAdd: Math.floor(globalXPToAdd),
        skillXPtoAdd: Math.floor(skillXPToAdd)
    }
}

//MODEL
function get_base_global_xp(config){
    let base_xp = 0;
    switch (config.taskMode){
        case "repeated":
            base_xp = 10
            break;
        case "milestone":
            base_xp = 50;
            break;
        case "timed":
            base_xp = 25;
            break;
    }
    return base_xp
}

//CONTROLLER
function xp_calculation(xp, playerState, config){
    let final_xp = xp;

    if (config.duration){
        final_xp = apply_duration_multiplier(final_xp, config)
    }
    
    if (config.repetitions){
        final_xp = apply_repetition_multiplier(final_xp, config)
    }
    
    final_xp = apply_low_level_multiplier(final_xp, playerState)
    final_xp = apply_streak_bonus(final_xp, playerState)
    final_xp = milestone_bonus(final_xp, config)
    final_xp = apply_difficulty_multiplier(final_xp, config)

    return final_xp;
}

//MODEL
function apply_duration_multiplier(xp, config){
    return xp + config.duration * 2;
}

//MODEL
function apply_difficulty_multiplier(xp, config){
    xp_to_return = xp;
    switch (config.difficulty){
        case "easy":
            xp_to_return *= 1;
            break;
        case "normal":
            xp_to_return *= 1.5;
            break;
        case "hard":
            xp_to_return *= 2;
            break;
    }

    return xp_to_return;
}

//MODEL
function apply_repetition_multiplier(xp, config){
    return xp * config.repetitions;
}

//MODEL
function apply_low_level_multiplier(xp, playerState){
    if (playerState.globalLevel < 3) {
        return xp * 1.5;
    } else {
        return xp;
    }
}

//MODEL
function apply_streak_bonus(xp, playerState){
    return xp + (1.5 * playerState.streak)
}

//MODEL
function milestone_bonus(xp, config){
    if (config.taskMode === "milestone"){
        return xp * 5;
    } else {
        return xp;
    }
}

//MODEL
function apply_xp_effects(skillName, xpBundle){
    increase_XP(xpBundle.globalXPtoAdd);
    increase_skill_xp(skillName, xpBundle.skillXPtoAdd);
}
