import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { Button, StyleSheet, TextInput, TouchableOpacity } from "react-native";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TestScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({
    id: 0,
    text: "",
    completed: false,
  });

  const color = useThemeColor({ light: "black", dark: "white" }, "text");

  const handleAddTodo = () => {
    if (newTodo?.text.trim() !== "" && newTodo !== undefined) {
      setTodos([...todos, newTodo]);
      setNewTodo({
        id: Math.max(...todos.map((todo) => todo.id)) + 1,
        text: "",
        completed: false,
      });
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">List of Todos</ThemedText>
      {todos.map((todo, index) => (
        <ThemedView style={styles.todoRow}>
          <ThemedText style={styles.todoText} key={index}>
            {todo.text}
          </ThemedText>
          <TouchableOpacity
            style={styles.todoDeleteButton}
            onPress={() => handleDeleteTodo(todo.id)}
          >
            <ThemedText>Delete</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ))}

      <TextInput
        value={newTodo?.text}
        onChangeText={(text) => setNewTodo({ ...newTodo, text })}
        placeholder="Enter a new todo"
        placeholderTextColor={"gray"}
        style={{ height: 40, color: color }}
      />

      <Button title="Add Todo" onPress={handleAddTodo} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    marginTop: 100,
    gap: 16,
    overflow: "hidden",
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  todoText: {
    flex: 1,
  },
  todoDeleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 4,
  },
});
