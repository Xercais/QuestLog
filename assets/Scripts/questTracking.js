//===========================
//Data
//===========================

const checkboxes = document.querySelectorAll('.quest-boxes input')

//===========================
//Initialize
//===========================

function initialize_quest_listeners(){
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(event){
            if (this.checked){
                increase_XP(10);
                save_checkbox_states();
                checkbox.disabled = true;
                let skillName = ((checkbox.closest('section').querySelector('h3')).textContent.toLowerCase());
                increase_skill_xp(skillName, 20);
            }
        });
    });
}