//function that loads global xp and updates the display
function load_xp(){
    let stored_xp = localStorage.getItem('current_xp')
    if (stored_xp !== null){
        xp = parseInt(stored_xp, 10);
        update_global_level(xp);
    }
}

function save_xp(){
    localStorage.setItem('current_xp', xp)
}

function load_skills(){
    stored_skills = localStorage.getItem('skills')
    if (stored_skills !== null){
        skills = JSON.parse(stored_skills)
    }
}

function save_skills(){
    localStorage.setItem('skills', JSON.stringify(skills))
}

//saves current state of checkboxes. function is called everytime a box is checked
function save_checkbox_states(){
    let checkbox_saves = [];
    let checkboxes = document.querySelectorAll('.quest-boxes input')
    checkboxes.forEach(checkbox =>{
        checkbox_saves.push(checkbox.checked)
    })
    let checkbox_states = JSON.stringify(checkbox_saves);
    localStorage.setItem('checkbox_state', checkbox_states)
}

//retrieves the saved state of checkboxes if the save state exists and restores it
function load_checkbox_states(){
    let saved_states = JSON.parse(localStorage.getItem('checkbox_state'))
    let checkboxes = document.querySelectorAll('.quest-boxes input')
    if (saved_states === null){
            return
    } 

    for (let i = 0; i < saved_states.length; i++){
        if (saved_states[i]){
            checkboxes[i].checked = true;
            checkboxes[i].disabled = true;
        }
    }
} 

function save_current_streak(streak){
    localStorage.setItem('current_streak', streak);
}

function save_current_bestStreak(streak){
    localStorage.setItem('best_streak', streak)
}