import React, { useEffect, useState } from "react";
import "../styles.css";

type TPokemon = Partial<Record<string, string>>;

interface IPokemonItemProps {
  pokemon: TPokemon;
  isShiny: boolean;
}

export default function PokemonItem({ pokemon, isShiny }: IPokemonItemProps) {
  const [isFront, setIsFront] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoBackUrl, setPhotoBackUrl] = useState("");
  const [imgIsLoaded, setImgIsLoaded] = useState(false);

  const toTurnHandleClick = (item: TPokemon) => {
    if (!photoBackUrl) return;
    setIsFront(!isFront);
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgIsLoaded(true);
    };
    img.src = photoUrl;
  }, [photoUrl]);

  useEffect(() => {
    const imgBack = new Image();
    imgBack.src = photoBackUrl;
  }, [photoBackUrl]);

  useEffect(() => {
    const front = isShiny ? pokemon.frontShiny : pokemon.frontPhoto;
    const back = isShiny ? pokemon.backShiny : pokemon.backPhoto;
    const photo = (isFront ? front : back) ?? "";
    const photoBack = back ?? "";
    setPhotoUrl(photo);
    setPhotoBackUrl(photoBack);
  }, [isFront, isShiny, pokemon]);

  return (
    <div
      className="pokemon"
      onClick={() => toTurnHandleClick(pokemon)}
      key={pokemon.url}
      style={{
        textAlign: "center",
        transition: "0.3s",
        cursor: "pointer",
      }}
    >
      <img
        style={{
          width: "100px",
          height: "100px",
          opacity: !imgIsLoaded ? 0 : 1,
          transition: "0.5s",
        }}
        src={photoUrl}
        alt={pokemon.name}
      />

      <h3
        style={{
          margin: 0,
          marginBottom: "15px",
          opacity: !imgIsLoaded ? 0 : 1,
          transition: "0.5s",
        }}
      >
        {pokemon.name}
      </h3>
    </div>
  );
}
