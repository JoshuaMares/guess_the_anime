let topJSON;
let currentAnimeJSON;
let currentAnimeTitlesList = [];
let allAnimeTitlesList = [];
let stage = 1;
let difficulty = 0;
const winsBeforeDifficultyIncrease = 3;
let winCount = winsBeforeDifficultyIncrease;
let currentLeft;
let currentTop;

function shuffle(array) {
    //fisher yates shuffle
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

async function newRound(){
    if(winCount == winsBeforeDifficultyIncrease){
        difficulty++;
        winCount = 0;
        topJSON = shuffle(await getTopAnime());
        getAllTitles(topJSON);
        console.log("new difficulty");
    }
    currentAnimeJSON = topJSON.shift();
    renderImage(currentAnimeJSON);
    getCorrectTitles(currentAnimeJSON);
}

function getAllTitles(animeJSONList){
    allAnimeTitlesList.length = 0;
    for(let i = 0; i < animeJSONList.length; i++){
        for(let j = 0; j < animeJSONList[i].titles.length; j++){
            allAnimeTitlesList.push(animeJSONList[i].titles[j].title);
        }
    }
    console.log(allAnimeTitlesList);
}

function getCorrectTitles(animeJSON){
    currentAnimeTitlesList.length = 0;
    for(let i=0; i < animeJSON.titles.length; i++){
        currentAnimeTitlesList.push(animeJSON.titles[i].title);
    }
    console.log(currentAnimeTitlesList);
}

async function getTopAnime(){
    const temp = await fetch(`https://api.jikan.moe/v4/top/anime?page=${difficulty}&filter=bypopularity`).then(res => res.json());
    console.log(temp.data.length);
    return temp.data;
}

async function getAnimeJSON(){
    const temp = await fetch(`https://api.jikan.moe/v4/anime/52991`).then(res => res.json());
    console.log(temp.data);
    return temp;
}

function renderImage(animeJSON){
    let imageLink = animeJSON.images.jpg.large_image_url;

    const imageContainer = document.getElementById("image-container");
    //let currImageHTML = imageContainer.innerHTML;
    let newImageHTML  = (
        `<figure>
                <img src="${imageLink}" id="image"/>
        </figure>`
    );
    imageContainer.innerHTML = newImageHTML;
    
    //random starting position
    setWindow();
}

function setWindow(){
    let imageCSS = document.getElementById("image").style;
    imageCSS.width = `${6 - stage}00%`;
    imageCSS.height = `${6 - stage}00%`;
    if(stage == 1){
        currentLeft = Math.floor(Math.random() * (266 - 266/5));
        console.log("current left: " + currentLeft);
        currentTop = Math.floor(Math.random() * (400 - 400/5));
        console.log("current top: " + currentTop);
        //since width increases image size we need to adjust
        imageCSS.left = `-${currentLeft * (6 - stage)}px`;
        imageCSS.top = `-${currentTop * (6 - stage)}px`;
        console.log("current left: " + currentLeft);
        console.log("current top: " + currentTop);
    }else if(stage == 5){
        imageCSS.left = '';
        imageCSS.top = '';
    }
    else{
        let leftMax = currentLeft - ((266/(6-stage)) - (266/(6-(stage-1))));
        let leftMin = currentLeft;
        currentLeft = Math.min(266 - 266/(6-stage) , getRandomInt(leftMin, leftMax));
        let topMax = currentTop - ((400/(6-stage)) - (400/(6-(stage-1))));
        let topMin = currentTop;
        currentTop = Math.min(400 - 400/(6-stage) , getRandomInt(topMin, topMax));
        imageCSS.left = `-${currentLeft * (6 - stage)}px`;
        imageCSS.top = `-${currentTop * (6 - stage)}px`;
        console.log("current left: " + currentLeft);
        console.log("current top: " + currentTop);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

let guesses = [];
const guessesList = document.getElementById("guesses");
const guessInput = document.getElementById("text-input");
const guessButton = document.getElementById("submit");
const searchResultsList = document.getElementById("search-results");

guessInput.onkeyup = liveSearch;

function liveSearch(){
    let results = [];
    let guess = guessInput.value;
    if(guess.length){
        results = allAnimeTitlesList.filter((title) =>{
            return title.toLowerCase().includes(guess.toLowerCase());
        });
        console.log(results);
    }
    renderAutoComplete(results);
}

function renderAutoComplete(results){
    const content = results.map((result) => {
        return "<li onclick=selectInput(this)>" + result + "</li>";
    });
    searchResultsList.innerHTML = "<ul>" + content.join('') + "</ul>"; 
}

function selectInput(listItem){
    guessInput.value = listItem.innerHTML;
    searchResultsList.innerHTML = "";
}

guessButton.addEventListener("click", submitGuess);

function submitGuess(e){
    e.preventDefault();
    let currentGuess = guessInput.value;
    if(currentAnimeTitlesList.includes(currentGuess)){
        console.log("Correct Guess!!!");
        /*guesses.length = 0;
        guessesList.innerHTML = "";
        renderGuesses();*/
        stage = 5;
        winCount++;
        renderImage(currentAnimeJSON);
        renderNewGuess(currentGuess, "win");
        renderEndScreen("win");
        guessInput.value = "";
    }else if(stage == 5){
        renderImage(currentAnimeJSON);
        renderNewGuess(currentGuess, "loss");
        renderEndScreen("loss");
    }else{
        console.log(guessInput.value);
        /*guesses.push(guessInput.value);
        guessesList.innerHTML = "";
        renderGuesses();*/
        stage++;
        renderImage(currentAnimeJSON);
        renderNewGuess(currentGuess, "guess");
        guessInput.value = "";
    }
}

function renderEndScreen(outcome){
    //hide search bar and add new game button
    let enterGuessCSS = document.getElementById("enter-guess").style;
    enterGuessCSS.display = 'none';
    //enterGuessCSS.position = 'absolute';
    //enterGuessCSS.visibility = 'hidden';
    document.getElementById("end-screen").innerHTML = 
    `
    <section id="anime-description-container"><p>${currentAnimeJSON.synopsis}</p></section>
    <section id="new-game-button-container">
        <button type="button" id="new-game-button" class="${outcome == "win" ? "win-button" : "loss-button"}">Next Game</button>
    </section>
    `;
    document.getElementById("new-game-button").addEventListener("click", ()=> {
        stage = 1;
        enterGuessCSS.display = '';
        //enterGuessCSS.position = '';
        //enterGuessCSS.visibility = '';
        document.getElementById("guesses").innerHTML = ``;
        document.getElementById("end-screen").innerHTML = ``;
        /*document.getElementById("enter-guess").innerHTML = `
            <form action="">
                <input type="text" id="text-input" placeholder="Search..." autocomplete="off">
                <button type="input" id="submit">Submit</button>
            </form>
            <section id="search-results"></section>`;
        guessButton.addEventListener("click", submitGuess);
        guessInput.onkeyup = liveSearch();*/
        newRound();
    });
}

function renderNewGuess(guess, guessClass){
    if(guessClass == "win"){
        guessesList.innerHTML = (
            `<div class="guessItem winningGuess">
            <a href="${currentAnimeJSON.url}" target="_blank"><p>${guess} <i class="fa-solid fa-up-right-from-square"></i></p></a>
            </div>`
        );
    }else if(guessClass == "guess"){
        guessesList.innerHTML += (
            `<div class="guessItem">
                <p>${guess}</p>
                <!--
                <div class="hints">
                    <i class="fa-brands fa-github github-icon"></i>
                    <i class="fa-brands fa-github github-icon"></i>
                </div>
                -->
            </div>`
        );
    }else if(guessClass == "loss"){
        guessesList.innerHTML = (
            `<div class="guessItem losingGuess">
            <a href="${currentAnimeJSON.url}" target="_blank"><p>${currentAnimeJSON.titles[0].title} <i class="fa-solid fa-up-right-from-square"></i></p></a>
            </div>`
        );
    }
}

/*
function renderGuesses(){
    guesses.forEach((guess, i) => {
        let currentHTML = guessesList.innerHTML;
        let newHTML = (
            `<div class="guessItem">
                <p>${i+1}. ${guess}</p>
                <!--
                <div class="hints">
                    <i class="fa-brands fa-github github-icon"></i>
                    <i class="fa-brands fa-github github-icon"></i>
                </div>
                -->
            </div>`
        );

        let amendedHTML = currentHTML + newHTML;
        guessesList.innerHTML = amendedHTML;
    });
}
*/


newRound();
