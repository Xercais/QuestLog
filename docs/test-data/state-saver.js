const saveData = {};

for (let i = 0; i < localStorage.length; i++){
    const key = localStorage.key(i);
    saveData[key] = localStorage.getItem(key);
}

console.log(JSON.stringify(saveData, null, 2));