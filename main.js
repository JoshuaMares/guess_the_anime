let guesses = ["Neon Genesis Evangelion", "SoulEater"];
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

    renderGuesses();