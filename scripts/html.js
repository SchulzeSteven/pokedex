function generatePokemonCardHtml(id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon) {
    // Achte darauf, dass currentPokemon alle benötigten Daten enthält, einschließlich currentPokemon.sprites
    return `
    <div id="pokemon-card-${id}" class="card" onclick="toggleActiveClass(this)" style="background-color: ${cardBackgroundColor};">
        <div class="card__face card__front">
            ${headerHTML}
            ${bodyHTML}
        </div>
        <div class="card__face card__back">
            <h2>${pokemonName}</h2>
            <img id="pokemon-image-back-${id}" class="image-back" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${pokemonName}">
            <div class="second-area"></div>
        </div>
    </div>
    `;
}


function generatePokemonHeader(currentPokemon, pokemonName) {
    let formattedId = ("000" + currentPokemon.id).slice(-3); // Formatieren der ID auf 3 Stellen
    return `
    <div class="header-card">
        <h3 id="pokemon-name" class="card-title">${pokemonName}</h3>
        <span id="pokemon-id"><b>#${formattedId}</b></span>
    </div>
    `;
}


function generatePokemonBody(currentPokemon, species1Color, species2Color) {
    return `
    <img src="img/2.svg" class="pokeball-bg align-self-center" alt="">
    <img id="pokemon-image" class="card-img-top pokemon-image image-size" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="...">
    <div class="card-body">
        <div class="species">
            <div class="species-direction">
                <div class="species-bubble" style="background-color: ${species1Color}">${getSpecies(currentPokemon, 0)}</div>
                ${currentPokemon.types.length > 1 ? `<div class="species-bubble" style="background-color: ${species2Color}">${getSpecies(currentPokemon, 1)}</div>` : ''}
            </div>
        </div>
    </div>
    `;
}