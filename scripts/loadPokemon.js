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
    let loader = document.getElementById("dialog");
    loader.classList.remove("d-none");
    pokemonAmount += id;
    content.innerHTML = ''; 
    for (let i = 1; i <= 30; i++) {
        let currentPokemon = await getPokemonData(i);
        content.innerHTML += PokemonRender(currentPokemon);
    }
    loader.classList.add("d-none");
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


function loadingSpinner() {
    let loader = document.getElementById('loader');

    loader.remove('d-none');
    setTimeout(function () {
        loader.classList.add('d-none');
    }, 2000);
}