import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./styles.css";
import useFetch from "./hooks/useFetch";
import PokemonItem from "./components/pokemonItem";
import { Loader, DebouncedInput } from "../../common";

type TPokemon = Record<string, string | undefined>;

interface IPokemonData {
  results: TPokemon[];
  count: number;
  next: string;
  previous: string;
}

interface IUseFetch {
  pokemonsData: IPokemonData;
  isLoading: boolean;
}

const DEFAULT_URL = "https://pokeapi.co/api/v2/pokemon?limit=5&offset=0";

const mockPokemonData: IPokemonData = {
  results: [],
  count: 0,
  next: "",
  previous: "",
};

const getParamsCount = (url: string, param: string) => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const count = params.get(param) ?? "0";
  return count;
};

export default function PokemonPage() {
  const [fetchUrl, setFetchUrl] = useState(DEFAULT_URL);
  const [count, setCount] = useState(0);
  const [isShiny, setIsShiny] = useState(false);

  const { pokemonsData = mockPokemonData, isLoading }: IUseFetch = useFetch({
    fetchUrl,
  });

  useEffect(() => {
    if (pokemonsData.count) setCount(pokemonsData.count);
  }, [pokemonsData.count]);

  const countPokemonsOnPage = useMemo(
    () => getParamsCount(fetchUrl, "limit"),
    [fetchUrl]
  );

  const pageNumber = useMemo(() => {
    const offsetNumber = Number(getParamsCount(fetchUrl, "offset"));
    const limitNumber = Number(getParamsCount(fetchUrl, "limit"));
    const result = Math.ceil(offsetNumber / limitNumber);
    const validResult = result === Infinity || !result ? 0 : result;
    return String(validResult);
  }, [fetchUrl]);

  const changeLimitHandler = useCallback(
    (value: string) => {
      const url = new URL(fetchUrl);
      const params = url.searchParams;
      params.set("limit", value);
      const newUrl = url.toString();
      setFetchUrl(newUrl);
    },
    [fetchUrl]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1>Музей покемонов</h1>
          <h2>Количество {count}</h2>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "300px",
                height: "110px",
                backgroundColor: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <div
                className="button"
                style={{
                  width: "250px",
                  height: "70px",
                  backgroundColor: "yellow",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  borderRadius: "15px",
                  transition: "0.3s",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => setCount((prev: number) => prev + 1)}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "24px",
                  }}
                >
                  Add pokemon
                </p>
                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                  <rect x="14" y="0" width="12" height="40" fill="black" />
                  <rect x="0" y="14" width="40" height="12" fill="black" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button
              className="footer-button"
              onClick={() => setFetchUrl(pokemonsData.previous)}
              disabled={!pokemonsData.previous || isLoading}
            >
              ← Prev
            </button>
            <button
              className="footer-button"
              onClick={() => setIsShiny(!isShiny)}
              disabled={isLoading}
            >
              →Shiny←
            </button>
            <button
              className="footer-button"
              onClick={() => setFetchUrl(pokemonsData.next)}
              disabled={!pokemonsData.next || isLoading}
            >
              Next →
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <h3>Количество покемонов на странице</h3>
              <DebouncedInput
                style={{
                  width: "70px",
                  height: "30px",
                }}
                type="text"
                value={countPokemonsOnPage}
                onChange={changeLimitHandler}
                disabled={isLoading}
              />
              <h3>{`Страница № ${pageNumber}`}</h3>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            minHeight: "50%",
            gap: "20px",
            marginBottom: "10px",
          }}
        >
          {isLoading ? (
            <Loader />
          ) : (
            pokemonsData.results?.map((pokemon: TPokemon) => {
              return (
                <PokemonItem
                  key={pokemon.url}
                  pokemon={pokemon}
                  isShiny={isShiny}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
