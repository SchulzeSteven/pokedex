/** 
 * Caches evolution images for quick access and reuse.
 * @type {Object.<string, HTMLImageElement>}
 */
let evolutionImagesCache = {};


/**
 * Fetches the evolution chain for a given Pokémon ID.
 * @param {number} pokemonId - The ID of the Pokémon to fetch the evolution chain for.
 * @returns {Promise<Array<Object>|null>} An array of evolution details or null if failed.
 */
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


/**
 * Recursively filters and flattens the evolution chain data into a usable format.
 * Only includes Pokémon with IDs <= 151.
 * @param {Object} chain - The evolution chain node.
 * @param {Array<Object>} [collectedData=[]] - Accumulator for evolution details.
 * @returns {Array<Object>} Array of evolution objects with name, id, and artwork URL.
 */
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


/**
 * Displays the evolution tab for a specific Pokémon.
 * Fetches and renders evolution data if not already visible.
 * @param {number} pokemonId - ID of the Pokémon whose evolution should be shown.
 */
async function showEvo(pokemonId) {
    const evoTab = document.getElementById(`evoTab${pokemonId}`);
    if (activeTab === 'evo' && evoTab.style.display === 'flex') {
        return;
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


/**
 * Generates HTML for all stages of a Pokémon's evolution chain.
 * Highlights the currently viewed Pokémon.
 * @param {Array<Object>} evolutionDetails - List of evolution data objects.
 * @param {number} currentActivePokemonId - ID of the Pokémon currently selected.
 * @returns {string} HTML for the full evolution chain.
 */
function generateEvolutionChainDetails(evolutionDetails, currentActivePokemonId) {
    let detailContent = '';
    let activePokemonType = '';

    const activePokemonDetail = evolutionDetails.find(detail => parseInt(detail.id) === parseInt(currentActivePokemonId));
    if (activePokemonDetail) {
        activePokemonType = activePokemonDetail.type;
    }

    const borderColor = typeColors[activePokemonType] || '#000000';

    evolutionDetails.forEach((detail, index) => {
        const isActive = parseInt(detail.id) === parseInt(currentActivePokemonId);
        detailContent += generateEvolutionHtml(detail, isActive, borderColor);
        if (index < evolutionDetails.length - 1) {
            detailContent += generateArrowHtml();
        }
    });

    return detailContent;
}


/**
 * Builds the complete evolution chain section HTML.
 * @param {Array<Object>} evolutionDetails - Array of evolution objects.
 * @param {number} currentActivePokemonId - ID of the currently viewed Pokémon.
 * @returns {string} HTML for the evolution chain section.
 */
function buildEvolutionChainContent(evolutionDetails, currentActivePokemonId) {
    if (!evolutionDetails || evolutionDetails.length === 0) {
        return '<div>No evolution data available.</div>';
    }

    let htmlContent = '<div class="evolution-chain">';
    htmlContent += generateEvolutionChainDetails(evolutionDetails, currentActivePokemonId);
    htmlContent += '</div>';
    return htmlContent;
}


/**
 * Preloads evolution images into memory for faster loading later.
 * Only preloads for Pokémon IDs from 1 to 30.
 */
async function preloadEvolutionImages() {
    for (let i = 1; i <= 30; i++) {
        if (!pokemonCache[i]) {
            let evolutionData = await fetchEvolutionChain(i);
            if (evolutionData) {
                evolutionData.forEach(evolution => {
                    if (!evolutionImagesCache[evolution.id]) {
                        const img = new Image();
                        img.onload = () => {
                            evolutionImagesCache[evolution.id] = img;
                        };
                        img.src = evolution.artwork;
                    }
                });
            }
        }
    }
}


/**
 * Shows the Pokémon detail overlay directly from evolution chain (click on image).
 * @param {number} pokemonId - The ID of the Pokémon to display.
 */
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

    activeTab = 'evo';
    setActiveTab(activeTab, pokemonId);
    showEvo(pokemonId);
}