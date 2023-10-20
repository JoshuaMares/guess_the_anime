let currentAnimeJSON;
let currentAnimeTitlesList = [];
let allAnimeTitlesList = [];

async function newGame(){
    const topJSON = await getTopAnime();
    console.log(topJSON);
    getAllTitles(topJSON);
    let randomNum = Math.floor(Math.random() * topJSON.length);
    console.log(randomNum);
    currentAnimeJSON = topJSON[randomNum];
    //console.log(animeJSON);
    //const animeJSON = await getAnimeJSON();
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
    const temp = await fetch(`https://api.jikan.moe/v4/top/anime`).then(res => res.json());
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
}

let guesses = [];
const guessesList = document.getElementById("guesses");
const guessInput = document.getElementById("text-input");
const guessButton = document.getElementById("submit");
const searchResultsList = document.getElementById("search-results");

guessInput.onkeyup = function(){
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

function submitGuess(e){
    e.preventDefault();
    let currentGuess = guessInput.value;
    if(currentAnimeTitlesList.includes(currentGuess)){
        console.log("Correct Guess!!!");
        guesses.length = 0;
        guessesList.innerHTML = "";
        renderGuesses();
        guessInput.value = "";
    }else{
        console.log(guessInput.value);
        guesses.push(guessInput.value);
        guessesList.innerHTML = "";
        renderGuesses();
        guessInput.value = "";
    }
}
guessButton.addEventListener("click", submitGuess);

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

newGame();
