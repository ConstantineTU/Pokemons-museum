import { useEffect, useState } from "react";

type TPokemon = Record<string, string | undefined>;
type TSprites = Record<string, string | null>;

interface IPokemonData {
  results: TPokemon[];
  count: number;
  next: string;
  previous: string;
}

interface IFormsItem {
  name: string;
  url: string;
}

export const getPokemonsData = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

export const getAllPokemonsWithPhotos = async (pokemon: TPokemon) => {
  if (pokemon.url) {
    const { forms }: { forms: IFormsItem[] } = await getPokemonsData(
      pokemon.url
    );
    const currentPokemon = forms.find((el) => el.name === pokemon.name);
    if (currentPokemon) {
      const { sprites }: { sprites: TSprites } = await getPokemonsData(
        currentPokemon.url
      );
      const { front_default, back_default, front_shiny, back_shiny } = sprites;
      return {
        ...pokemon,
        frontPhoto: front_default || undefined,
        backPhoto: back_default || undefined,
        frontShiny: front_shiny || undefined,
        backShiny: back_shiny || undefined,
      };
    }
  }
  return pokemon;
};

export default function useFetch({ fetchUrl }: { fetchUrl: string }) {
  const [pokemonsData, setPokemonsData] = useState<IPokemonData>({
    results: [],
    count: 0,
    next: "",
    previous: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const pokemonsFetchData: IPokemonData = await getPokemonsData(fetchUrl);
        const { results = [] } = pokemonsFetchData;
        const resultsWithPhotos: TPokemon[] =
          (await Promise.all(results.map(getAllPokemonsWithPhotos))).filter(
            (el) => el.frontPhoto
          ) || [];

        setPokemonsData({
          ...pokemonsFetchData,
          results: resultsWithPhotos,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchUrl]);

  return { pokemonsData, isLoading };
}
