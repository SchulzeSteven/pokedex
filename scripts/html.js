function generatePokemonHeader(currentPokemon, pokemonName) {
    return `
    <div class="header-card">
        <h3 id="pokemon-name" class="card-title">${pokemonName}</h3>
        <span id="pokemon-id"><b>#${currentPokemon.id}</b></span>
    </div>
    `;
}

function generatePokemonBody(currentPokemon, species1Color, species2Color) {
    return `
    <img id="pokemon-image" class="card-img-top pokemon-image image-size" src="${currentPokemon.sprites.other['official-artwork'].front_default}" alt="...">
    <div class="card-body">
        <div class="species">
            <div class="flex-direction">
                <div class="species-bubble" style="background-color: ${species1Color}">${getSpecies(currentPokemon, 0)}</div>
                ${currentPokemon.types.length > 1 ? `<div class="species-bubble" style="background-color: ${species2Color}">${getSpecies(currentPokemon, 1)}</div>` : ''}
            </div>
        </div>
    </div>
    `;
}