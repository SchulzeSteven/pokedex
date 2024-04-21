function generatePokemonCardHtml(id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon) {
    const pokemonTypesHtml = generatePokemonTypesHtml(currentPokemon.types);
    const formattedId = id.toString().padStart(3, '0');
    return `
    <div id="pokemon-card-${id}" class="card" onclick="toggleActiveClass(this)" style="background-color: ${cardBackgroundColor};">
        <div class="card__face card__front">
            ${headerHTML}
            ${bodyHTML}
        </div>
        <div class="card__face card__back">
            <div class="h2-back"><h2>${pokemonName}</h2><span>#${formattedId}</span></div> <!-- Name und ID zusammen anzeigen -->
            <img id="pokemon-image-back-${id}" class="image-back" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="${pokemonName}">
            <div class="second-area">
                <div class="types-back">
                    ${pokemonTypesHtml} <!-- Pokémon-Typen hier anzeigen -->
                </div>
            </div>
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


function generatePokemonTypesHtml(types) {
    return types.map(typeInfo => {
        // Erster Buchstabe groß, der Rest klein
        const typeName = typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1).toLowerCase();
        return `<span class="pokemon-type" style="background-color: ${typeColors[typeInfo.type.name]}">${typeName}</span>`;
    }).join(' ');
}