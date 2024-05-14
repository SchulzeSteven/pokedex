let evolutionImagesCache = {};


async function fetchEvolutionChain(pokemonId) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        if (!speciesResponse.ok) throw new Error('Failed to fetch species data');
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) throw new Error('Failed to fetch evolution data');
        const evolutionData = await evolutionResponse.json();
        return filterEvolutionData(evolutionData.chain);
    } catch (error) {
        console.error('Error fetching evolution data:', error);
        return null;
    }
}


function filterEvolutionData(chain, collectedData = []) {
    if (!chain) return collectedData;

    const speciesId = chain.species.url.split("/").filter(Boolean).pop();
    if (parseInt(speciesId) <= 151) {
        collectedData.push({
            name: chain.species.name,
            id: speciesId,
            artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`
        });
    }
    chain.evolves_to.forEach(evolution => {
        filterEvolutionData(evolution, collectedData);
    });
    return collectedData;
}


async function showEvo(pokemonId) {
    const evoTab = document.getElementById(`evoTab${pokemonId}`);
    if (activeTab === 'evo' && evoTab.style.display === 'flex') {
        return; // Wenn der Tab bereits aktiv und sichtbar ist, tue nichts.
    }
    activeTab = 'evo';
    setActiveTab(activeTab, pokemonId);
    updateActiveTab(pokemonId);
    const evolutionData = await fetchEvolutionChain(pokemonId);
    const currentActivePokemonId = pokemonId;
    const evoContent = buildEvolutionChainContent(evolutionData, currentActivePokemonId);
    evoTab.innerHTML = evoContent;
    evoTab.style.display = 'flex';
    setActiveTab(activeTab, pokemonId);
    updateActiveTab(pokemonId);
}


function generateEvolutionChainDetails(evolutionDetails, currentActivePokemonId) {
    let detailContent = '';
    let activePokemonType = '';
    const activePokemonDetail = evolutionDetails.find(detail => parseInt(detail.id) === parseInt(currentActivePokemonId));
    if (activePokemonDetail) {
        activePokemonType = activePokemonDetail.type;
    }
    const borderColor = typeColors[activePokemonType] || '#000000'; // Standardfarbe, falls Typ nicht gefunden wird
    evolutionDetails.forEach((detail, index) => {
        const isActive = parseInt(detail.id) === parseInt(currentActivePokemonId);
        detailContent += generateEvolutionHtml(detail, isActive, borderColor);
        if (index < evolutionDetails.length - 1) {
            detailContent += generateArrowHtml();
        }
    });
    return detailContent;
}


function buildEvolutionChainContent(evolutionDetails, currentActivePokemonId) {
    if (!evolutionDetails || evolutionDetails.length === 0) {
        return '<div>No evolution data available.</div>';
    }

    let htmlContent = '<div class="evolution-chain">';
    htmlContent += generateEvolutionChainDetails(evolutionDetails, currentActivePokemonId);
    htmlContent += '</div>';
    return htmlContent;
}


async function preloadEvolutionImages() {
    for (let i = 1; i <= 30; i++) {
        if (!pokemonCache[i]) { // Überprüfe, ob das Pokémon bereits im Cache ist
            let evolutionData = await fetchEvolutionChain(i);
            if (evolutionData) {
                evolutionData.forEach(evolution => {
                    if (!evolutionImagesCache[evolution.id]) {
                        const img = new Image();
                        img.onload = () => {
                            evolutionImagesCache[evolution.id] = img; // Speichert das geladene Image-Objekt im Cache
                        };
                        img.src = evolution.artwork; // Startet das Laden des Bildes
                    }
                });
            }
        }
    }
}


async function showPokemonDetail(pokemonId) {
    const pokemonData = await getPokemonData(pokemonId);
    if (!pokemonData) {
        console.error('No data available for Pokemon ID:', pokemonId);
        return;
    }
    removeActiveOverlay();
    const overlay = createPokemonDetailOverlay(pokemonData);
    document.body.appendChild(overlay);
    showBackgroundBlur();
    // Bleibe im Evolution-Tab anstatt zu wechseln
    activeTab = 'evo';
    setActiveTab(activeTab, pokemonId);
    showEvo(pokemonId);
}