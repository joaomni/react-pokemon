import api from './services/api'
//import TrainerController from './controllers/TrainerController'
import { useState, useEffect } from "react"

export default function Home() {
  const [pokemons, setPokemons] = useState([])
  const [sprite, setSprite] = useState('')
  const [types, setTypes] = useState([])
  const [evolutionChain, setEvolutionChain] = useState(null)

  useEffect(() => {
    const loadPokes = async () => {
      const res = await api.get('/pokemon?limit=100000&offset=0')
      
      setPokemons(res.data.results)
    }

    loadPokes()
  }, [])

  const fetchEvolutionChain = async (link) => {
    const res = await api.get(`${link}`)
    
    setEvolutionChain(res.data.chain)
  }

  const getEvolutionId = async (id) => {
    const res = await api.get(`/pokemon-species/${id}`)
    
    fetchEvolutionChain(res.data.evolution_chain.url)
  }

  const renderEvolution = (evolution, index) => (
    <div key={index}>
      <p key={index}>Evolução 1:</p>
      {evolution.evolution_details.map((details, index) => (
        <>
          <p key={index}>Evolui para: {evolution.species.name}</p>
          <p key={index}>Min Level: {details.min_level}</p>
        </>
      ))}
      {evolution.evolves_to.length > 0 && (
        <div key={index}>
          <p key={index}>Próxima Evolução:</p>
          {evolution.evolves_to.map((nextEvolution, nextIndex) => (
            <>
              <p key={nextIndex}>Evolui para: {nextEvolution.species.name}</p>
              <p key={nextIndex}>Min Level: {nextEvolution.evolution_details[0].min_level}</p>
            </>
          ))}
        </div>
      )}
    </div>
  );

  const handlePokemonChange = async (event) => {
    const pokemon = event.target.value
    const res = await api.get(`/pokemon/${pokemon}`)

    setSprite(res.data.sprites)
    setTypes(res.data.types)
    getEvolutionId(res.data.id)
  }

  return (
    <div>
      <h1>Lista de Pokemons</h1>
      <select value='' onChange={handlePokemonChange}>
        <option disabled value="">
          Selecione um Pokémon
        </option>
        {pokemons.map((pokemon, index) => (
          <>
            <option key={index} value={pokemon.id}>
              {pokemon.name}
            </option>
          </>
        ))}
      </select>

      {sprite && pokemons && (
        <div>
          <h2>Detalhes do Pokémon</h2>
          <p>Name: {pokemons.name}</p>
          <img
            src={sprite.front_default}
            alt={pokemons.name}
            width={100}
            height={100}
          ></img>
          <img
            src={sprite.front_shiny}
            alt={pokemons.name}
            width={100}
            height={100}
          ></img>
          {types.map((type, index) => (
            <div key={index}>
              <p key={index}>Tipo: {type.type.name}</p>
            </div>
          ))}
        </div>
      )}
      {evolutionChain && (
        <div>
          {evolutionChain.evolves_to.map((evolution, index) => (
            <div key={index}>
              {renderEvolution(evolution, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
