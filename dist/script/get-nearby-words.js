// Puzzle to generate suggested words on a touch-device keyboard.
// For instance: when 'test' is entered, I would expect a list of nearby words that
// include 'rest'.
// Assume getNearbyChars and isWord are implemented.
// Implement nearbyWords(word).

function getNearbyChars(character) {
    switch (character) {
        case 'a':
            return ['q', 'w', 's', 'z', 'a'];
        case 'g':
            return ['r','t','y','f','h','v','b','g'];
        case 't':
            return ['r','y','f','g','h', 't'];
        case 'e':
            return ['r','w','s','d','f', 'e'];
        case 's':
            return ['q','w','e','a','d', 'z', 'x', 's'];
        case 'i':
            return ['u','o','l','k','j', 'i'];
        default:
            return ['a','e','o','u','i']
    }
}

function isWord(word) {
    // Stub
    return false;
}

function nearbyWords(word) {
    var permutations = [];

    var getPermutations = function(word, index, result) {
        var set = [];

        if(index === word.length) return result;

        var char = word[index];
        console.log(char);
        console.log(set);
        var nearbyChars = getNearbyChars(char);
        console.log(nearbyChars);
        nearbyChars.forEach(function(nearbyChar) {
            if(!result || !result.length) {
                set.push(nearbyChar);
            } else {
                result.forEach(function(partial) {
                    set.push(partial + nearbyChar);
                })
            }
        });
        return getPermutations(word, index + 1, set);

    };

    permutations = getPermutations(word, 0)

    console.log('permutations: ', permutations);
}

nearbyWords('git');
