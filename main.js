let currentAnimeJSON;
let currentAnimeTitleList = [];

async function newGame(){
    const topJSON = await getTopAnime();
    console.log(topJSON)
    let randomNum = Math.floor(Math.random() * topJSON.length);
    console.log(randomNum);
    currentAnimeJSON = topJSON[randomNum];
    //console.log(animeJSON);
    //const animeJSON = await getAnimeJSON();
    renderImage(currentAnimeJSON);
    getAllTitles(currentAnimeJSON);
}

function getAllTitles(animeJSON){
    currentAnimeTitleList.length = 0;
    for(let i=0; i < animeJSON.titles.length; i++){
        currentAnimeTitleList.push(animeJSON.titles[i].title);
    }
    console.log(currentAnimeTitleList);
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

async function renderImage(animeJSON){
    let imageLink = animeJSON.images.jpg.large_image_url;

    const imageContainer = document.getElementById("image");
    //let currImageHTML = imageContainer.innerHTML;
    let newImageHTML  = (
        `<figure>
                <img src="${imageLink}" />
        </figure>`
    );
    imageContainer.innerHTML = newImageHTML;
}

let guesses = [];
const guessesList = document.getElementById("guesses");
const guessInput = document.getElementById("text-input");
const guessButton = document.getElementById("submit");

function submitGuess(e){
    e.preventDefault();
    let currentGuess = guessInput.value;
    if(currentAnimeTitleList.includes(currentGuess)){
        console.log("Correct Guess!!!");
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
renderGuesses();