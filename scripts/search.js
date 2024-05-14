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
    const footer = document.getElementById('footer');
    footer.style.display = 'none';
    const loader = document.getElementById("dialog");
    content.innerHTML = '';
    loader.classList.remove("d-none");
    if (checkedTypes.length === 0) {
        filterIsActive = false;
        await resetAndReloadInitialPokemons(content);
        document.getElementById('loadMoreButton').style.display = 'block';
    } else {
        filterIsActive = true;
        document.getElementById('loadMoreButton').style.display = 'none';
        await filterAndRenderPokemons(checkedTypes, content);
    }
    loader.classList.add("d-none");
    document.getElementById('footer').style.display = 'block';
}


async function resetAndReloadInitialPokemons(content) {
    pokemonCache = {};
    let loader = document.getElementById("dialog");
    loader.classList.remove("d-none");
    content.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        let currentPokemon = await getPokemonData(i);
        if (currentPokemon) {
            content.innerHTML += PokemonRender(currentPokemon);
        }
    }
    loader.classList.add("d-none");
    document.getElementById('loadMoreButton').style.display = 'block';
    filterIsActive = false;
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