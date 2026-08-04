//===========================
//Calculations
//===========================

function increase_XP(xp_to_add){
    xp += xp_to_add;
    xpDisplay.textContent = "XP: " + xp;
    localStorage.setItem('current_xp', xp)
    update_global_level(xp);
}

function calculate_level(current_total_xp, scalingFactor){
    let calculated_level = (Math.floor(Math.sqrt(current_total_xp) / scalingFactor)) + 1;
    return calculated_level;
}

function update_global_level(xp){
    level = calculate_level(xp, 10);
    levelDisplay.textContent = "Level: " + level;
}

//===========================
//Load
//===========================

function load_xp(){
    let stored_xp = localStorage.getItem('current_xp')
    if (stored_xp !== null){
        xp = parseInt(stored_xp, 10);
        update_global_level(xp);
    }
}
