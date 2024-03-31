const fs   = require( "fs" );

//Read the dictionary txt files, split them by newlines to make a list of all words.
const dictionaries = 
{
  "Scrabble":fs.readFileSync("dictionaries/scrabble.txt", { encoding: 'utf8', flag: 'r' }).split(/\r?\n/),
  "MIT":fs.readFileSync("dictionaries/mit2.txt", { encoding: 'utf8', flag: 'r' }).split(/\r?\n/)
}

//Creates a set of all allowed letters.
const lettersString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lettersSet = new Set(lettersString.split(""));

/*
Given a string, returns the upper case version with only the letters. 
This will help to build the letter data object.
*/
function sanitize(string){
    var newString = "";
    for(var i = 0; i < string.length; i++){
      var letter = string.charAt(i).toUpperCase();
      if(lettersSet.has(letter)){
        newString+=letter;
      }
    }
    return newString;
}
  
/*
Returns a JSON object with keys corresponding to each letter and values corresponding to the number of
times each letter occurs in the string.

Assumes string is already sanitized. If not it will throw an error.
*/
function getLetterData(string){
    var obj = {};
    for(var i = 0; i < lettersString.length; i++){
      var letter = lettersString.charAt(i);
      obj[letter]=0;
    }
    for(var i = 0; i < string.length; i++){
      obj[string.charAt(i)]++;
    }
    return obj;
}

/*
Calculates the "difference" in letters between two words. If the small word contains letters that
the big word doesn't, it returns false. Otherwise, it returns the letters that would remain if the
small word's letters were removed from the big word.
*/
function getLetterDataMatch(ldBig,ldSmall){
    var overlap = {};
    for(const letter in ldSmall){
      if(!(letter in ldBig) || ldBig[letter] < ldSmall[letter]){
        return false;
      }
      overlap[letter] = ldBig[letter] - ldSmall[letter];
    }
    return overlap;
}
  
/*
Builds a dictionary list that both contains each word and its letter counts so that they don't need
to be re-calculated. It also filters out all words that cannot possibly be used in an anagram of the
given string.
*/
function buildLetterDictionary(dict,letterData){
    var output = [];
    for(var i = 0; i < dict.length; i++){
        var ld = getLetterData(dict[i]);
        if(!getLetterDataMatch(letterData,ld)){
            continue;
        }
        output.push({word:dict[i],ld:ld});
    }
    return output;
}

/*
Determines if a letter data object has no letters remaining. If so, the anagram is done!
*/
function isEmpty(letterData){
    for(const letter in letterData){
      if(letterData[letter]>0){
        return false;
      }
    }
    return true;
}

/*
Gets a single anagram by performing a depth-first search of the dictionary.
*/
function getAnagram(letterData, dict){
    //We modify our dictionary by removing words, which helps in recursive calls. 
    //But that also means we need to copy it.
    let dictCopy = [...dict];
    while(dictCopy.length > 0){
      let match = getLetterDataMatch(letterData,dictCopy[0].ld);
      if(match){
        if(isEmpty(match)){
            //Base case: There are no letters left!
            return [dictCopy[0].word];
        }
        //Recursive step: if we use this word, how can we fill the rest of the letters?
        var call = getAnagram(match,dictCopy);
        if(call.length !== 0){
          //We've found a set of words that fill in the rest of the letters!
          //So, we tack on the current word and continue upward.
          return [dictCopy[0].word].concat(call);
        }
      }
      dictCopy.splice(0,1);
    }
    return [];
}

//Used the fisher-yates shuffle as described here. I implemented it myself from pseudocode. 
//https://www.geeksforgeeks.org/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/
function shuffle(list){
    for(var i = list.length-1; i >= 0; i--){
        var j = Math.floor(Math.random()*i);
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
}

module.exports = {
    /*
    Take an unsanitized string, sanitize it, build a letter data object, build a dictionary,
    and return a given number of anagrams (if they exist). If no anagrams exist, it returns
    an empty list.
    */
    getAnagrams: function(str, dictName, numAnagrams){
        var ld = getLetterData(sanitize(str));
        console.log(dictName);
        var dict = buildLetterDictionary(dictionaries[dictName],ld);
        var output = [];
        for(var i = 0; i < numAnagrams; i++){
            //Technically it's not guaranteed that these anagrams are unique.
            //That's ok in my book, because it's unlikely there's overlap unless there are very few
            //anagrams total. As long as the algorithm is guaranteed to find anagrams if they exist,
            //which it is, I'm happy enough.
            shuffle(dict);
            var anagram = getAnagram(ld,dict).join(" ").toLowerCase();
            //If there are no anagrams, still push an empty string, because this will cause the 
            //tabular data to be entered properly.
            output.push(anagram);
        }
        return output;
    }
    
}