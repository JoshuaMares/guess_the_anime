async function newGame(){
    const animeJSON = await getAnimeJSON();
    renderImage(animeJSON);
}

//pull image from MAL
async function getAnimeJSON(){
    const temp = await fetch(`https://api.jikan.moe/v4/anime/52991`).then(res => res.json());
    console.log(temp.data);
    return temp;
}

async function renderImage(animeJSON){
    let imageLink = animeJSON.data.images.jpg.large_image_url;

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
    console.log(guessInput.value);
    guesses.push(guessInput.value);
    guessesList.innerHTML = "";
    renderGuesses();
    guessInput.value = "";
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