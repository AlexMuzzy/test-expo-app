import { Image, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useQuery } from "@tanstack/react-query";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const fetchPokemon = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

  if (!response.ok) {
    throw new Error("Pokemon not found");
  }

  return response.json();
};

export default function HomeScreen() {
  const {
    data: pokemonData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pokemon"],
    queryFn: fetchPokemon,
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      {isLoading && <ThemedText>Loading...</ThemedText>}
      {isError && <ThemedText>Error: {error.message}</ThemedText>}
      {pokemonData && (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={{ fontWeight: "bold", fontSize: 24 }}>
              {pokemonData.name}
            </ThemedText>
            <Image
              source={{ uri: pokemonData.sprites.front_default }}
              style={{ width: 100, height: 100 }}
            />
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
              Abilities
            </ThemedText>
            {pokemonData.abilities.map((ability) => (
              <ThemedText key={ability.ability.name}>
                {ability.ability.name}
              </ThemedText>
            ))}
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
              HP Stat: {pokemonData.stats[0].base_stat}
            </ThemedText>
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
