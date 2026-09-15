function assertEqual(actual, expected, description){
    if(actual === expected){
        console.log(`✅ ${description}`);
    } else {
        console.error(
            `❌ ${description}
            Expected: ${expected}
            Received: ${actual}`)
    }
}

assertEqual(2 + 2, 4, "Basic math works")
assertEqual(2 + 2, 5, "Basic math fails correctly")