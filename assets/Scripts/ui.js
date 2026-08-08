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

//dynamic skill creation
function render_skill(skillInfo){
    let skillCard = document.createElement('div');
    skillCard.classList.add('skill-card');
    let skillName = document.createElement('h2');
    let skillXP = document.createElement('p');
    let skillLevel = document.createElement('p');

    skillName.textContent = title_case_skill_name(skillInfo.name);
    skillXP.textContent = "XP: " + skillInfo.xp;
    skillLevel.textContent = "Level: " + skillInfo.level;

    skillCard.append(skillName);
    skillCard.append(skillXP);
    skillCard.append(skillLevel);
    
    return skillCard;
}

function render_all_skills(skillCollection){
    let skillsContainer = document.querySelector('#skills-container');
    skillsContainer.replaceChildren();
    for (let i = 0; i < skillCollection.length; i++){
        skillsContainer.append(render_skill(skillCollection[i]));
    }
}

function render_quest_checkbox(isChecked){
    let questContainer = document.createElement('li');
    let questBox = document.createElement('input');

    questBox.type = 'checkbox';
    questBox.checked = isChecked;
    if (isChecked){
        questBox.disabled = true;
    }
    questContainer.append(questBox);

    return questContainer;
}

function render_quest_section(questdata){
    let questSection = document.createElement('section');
    questSection.classList.add('quest-section');

    let questTitle = document.createElement('h2');
    questTitle.textContent = title_case_skill_name(questdata.name);

    let questboxesSection = document.createElement('ul');
    questboxesSection.classList.add('quest-boxes');
    for(let i = 0; i < questdata.checkboxStates.length; i++){
        questboxesSection.append(render_quest_checkbox(questdata.checkboxStates[i]))
    };

    questSection.append(questTitle);
    questSection.append(questboxesSection);

    return questSection;
}

function render_quest_board(questCollection){
    let questContainer = document.querySelector('#quests-container')
    questContainer.replaceChildren();
    for (let i = 0; i < questCollection.length; i++){
        questContainer.append(render_quest_section(questCollection[i]));
    }
}

function failure_popup(reason){
    let failure_popup = document.getElementById('failed-to-add-skill');
    let fail_reason = document.getElementById('fail-reason');

    failure_popup.classList.remove('hidden');
    fail_reason.classList.remove('hidden');

    fail_reason.textContent = reason;
}