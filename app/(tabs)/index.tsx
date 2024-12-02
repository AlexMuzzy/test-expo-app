import { Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useQuery } from "@tanstack/react-query";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const fetchPokemon = async (pokemonName: string) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
  );

  if (!response.ok) {
    throw new Error("Pokemon not found");
  }

  return response.json();
};

export default function HomeScreen() {
  const [inputPokemon, setInputPokemon] = useState("ditto");
  const [currentPokemon, setCurrentPokemon] = useState("ditto");

  const color = useThemeColor({ light: "black", dark: "white" }, "text");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pokemon", currentPokemon],
    queryFn: () => fetchPokemon(currentPokemon),
    // Enable retrying on error
    retry: 1,
    // Only run the query when currentPokemon changes
    enabled: !!currentPokemon,
  });

  const handleSubmit = () => {
    setCurrentPokemon(inputPokemon);
  };

  return (
    <>
      {isLoading && <ThemedText>Loading...</ThemedText>}
      {isError && (
        <ThemedText>
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </ThemedText>
      )}

      {data && (
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
          headerImage={
            <Image
              source={{ uri: data.sprites.front_default }}
              style={styles.reactLogo}
            />
          }
        >
          <>
            <ThemedView style={styles.searchContainer}>
              <TextInput
                value={inputPokemon}
                onChangeText={setInputPokemon}
                placeholder="Enter Pokemon Name"
                style={{ color, ...styles.input }}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <ThemedText style={styles.submitButtonText}>Search</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <ThemedView>
              <ThemedText style={{ fontWeight: "bold", fontSize: 24 }}>
                {data.name}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
              <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
                Abilities
              </ThemedText>
              {data.abilities.map((ability: any) => (
                <ThemedText key={ability.ability.name}>
                  {ability.ability.name}
                </ThemedText>
              ))}
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
              <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
                HP Stat: {data.stats[0].base_stat}
              </ThemedText>
            </ThemedView>
          </>
        </ParallaxScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
