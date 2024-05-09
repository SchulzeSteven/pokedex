async function initializeSearch(searchTerm) {
    let content = document.getElementById('pokemon-list');
    content.innerHTML = '';
    if (searchTerm.length === 0) {
        await loadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
        filterIsActive = false;
    } else {
        await searchAndRenderPokemons(searchTerm, content);
        filterIsActive = true;
    }
}


async function searchAndRenderPokemons(searchTerm, content) {
    filteredPokemonIds = [];
    let count = 0;
    for (let i = 1; i <= 151; i++) {
        let pokemonData = await getPokemonData(i);
        if (pokemonData && pokemonData.name.toLowerCase().includes(searchTerm)) {
            content.innerHTML += PokemonRender(pokemonData);
            filteredPokemonIds.push(i);
            count++;
        }
    }
    filterIsActive = true;
}


async function filterByType() {
    const checkedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
    const content = document.getElementById('pokemon-list');
    content.innerHTML = '';

    if (checkedTypes.length === 0) {
        filterIsActive = false;
        loadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
    } else {
        filterIsActive = true;
        document.getElementById('loadMoreButton').style.display = 'none';
        filterAndRenderPokemons(checkedTypes, content);
    }
}


async function filterAndRenderPokemons(checkedTypes, content) {
    filteredPokemonIds = [];
    for (let i = 1; i <= 151; i++) {
        let pokemon = await getPokemonData(i);
        if (pokemon.types.some(type => checkedTypes.includes(type.type.name))) {
            content.innerHTML += PokemonRender(pokemon);
            filteredPokemonIds.push(i);
        }
    }
}