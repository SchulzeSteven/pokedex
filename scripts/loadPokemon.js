async function getPokemonData(id) {
    if (!pokemonCache[id]) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            pokemonCache[id] = data;
        } catch (e) {
            console.error('Error fetching data:', e);
            return null;
        }
    }
    return pokemonCache[id];
}


async function loadInitialPokemons(content) {
    content.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        let currentPokemon = await getPokemonData(i);
        content.innerHTML += PokemonRender(currentPokemon);
    }
    document.getElementById('loadMoreButton').style.display = 'block';
    filterIsActive = false;
}


async function renderPokemon(id, content) {
    let pokemonData = await getPokemonData(id);
    if (pokemonData) {
        content.innerHTML += PokemonRender(pokemonData);
    } else {
        console.error(`Failed to load data for Pokemon ID ${id}`);
    }
}


function PokemonRender(currentPokemon) {
    if (!currentPokemon || !currentPokemon.name) {
        console.error('Invalid Pokemon data', currentPokemon);
        return '';
    }
    let pokemonName = currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1);
    let { species1Color, species2Color } = getSpeciesColors(currentPokemon);
    let cardBackgroundColor = typeColors[currentPokemon.types[0].type.name];
    let headerHTML = generatePokemonHeader(currentPokemon, pokemonName);
    let bodyHTML = generatePokemonBody(currentPokemon, species1Color, species2Color);

    return generatePokemonCardHtml(currentPokemon.id, pokemonName, cardBackgroundColor, headerHTML, bodyHTML, currentPokemon);
}