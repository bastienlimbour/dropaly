import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Chip,
  Spinner,
  Surface,
  Input,
  TextField,
  useThemeColor,
} from "heroui-native";
import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";

import { Container } from "@/components/container";
import { SignIn, SignUp } from "@/features/auth";
import { authClient } from "@/lib/auth-client";
import { todoMutations, todoQueries } from "./api";

export function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);

  const todos = useQuery({
    ...todoQueries.list(),
    enabled: isAuthenticated,
  });
  const createMutation = useMutation(
    todoMutations.create(queryClient, {
      onSuccess: () => {
        setNewTodoText("");
      },
    }),
  );
  const toggleMutation = useMutation(todoMutations.toggle(queryClient));
  const deleteMutation = useMutation(todoMutations.delete(queryClient));

  const mutedColor = useThemeColor("muted");
  const dangerColor = useThemeColor("danger");
  const foregroundColor = useThemeColor("foreground");

  const handleAddTodo = () => {
    if (newTodoText.trim() && isAuthenticated) {
      createMutation.mutate({ text: newTodoText });
    }
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <Container className="p-6">
        <Text className="text-2xl font-semibold text-foreground mb-4">
          Sign in to manage your tasks
        </Text>
        <SignIn />
        <SignUp />
      </Container>
    );
  }

  const isLoading = todos.isLoading;
  const completedCount = todos.data?.filter((todo) => todo.completed).length ?? 0;
  const totalCount = todos.data?.length ?? 0;

  return (
    <Container>
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="py-4 mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-foreground tracking-tight">
              Tasks
            </Text>
            {totalCount > 0 && (
              <Chip variant="secondary" color="accent" size="sm">
                <Chip.Label>
                  {completedCount}/{totalCount}
                </Chip.Label>
              </Chip>
            )}
          </View>
        </View>

        <Surface variant="secondary" className="mb-4 p-3 rounded-lg">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <TextField>
                <Input
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  placeholder="Add a new task..."
                  editable={!createMutation.isPending}
                  onSubmitEditing={handleAddTodo}
                  returnKeyType="done"
                />
              </TextField>
            </View>
            <Button
              isIconOnly
              variant={
                createMutation.isPending || !newTodoText.trim()
                  ? "secondary"
                  : "primary"
              }
              isDisabled={createMutation.isPending || !newTodoText.trim()}
              onPress={handleAddTodo}
              size="sm"
            >
              {createMutation.isPending ? (
                <Spinner size="sm" color="default" />
              ) : (
                <Ionicons
                  name="add"
                  size={20}
                  color={
                    createMutation.isPending || !newTodoText.trim()
                      ? mutedColor
                      : foregroundColor
                  }
                />
              )}
            </Button>
          </View>
        </Surface>

        {isLoading && (
          <View className="items-center justify-center py-12">
            <Spinner size="lg" />
            <Text className="text-muted text-sm mt-3">Loading tasks...</Text>
          </View>
        )}

        {todos.data && todos.data.length === 0 && !isLoading && (
          <Surface
            variant="secondary"
            className="items-center justify-center py-10 rounded-lg"
          >
            <Ionicons name="checkbox-outline" size={40} color={mutedColor} />
            <Text className="text-foreground font-medium mt-3">No tasks yet</Text>
            <Text className="text-muted text-xs mt-1">
              Add your first task to get started
            </Text>
          </Surface>
        )}

        {todos.data && todos.data.length > 0 && (
          <View className="gap-2">
            {todos.data.map((todo) => (
              <Surface key={todo.id} variant="secondary" className="p-3 rounded-lg">
                <View className="flex-row items-center gap-3">
                  <Checkbox
                    isSelected={todo.completed}
                    onSelectedChange={() =>
                      handleToggleTodo(todo.id, todo.completed)
                    }
                  />
                  <View className="flex-1">
                    <Text
                      className={`text-sm ${
                        todo.completed
                          ? "text-muted line-through"
                          : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </Text>
                  </View>
                  <Button
                    isIconOnly
                    variant="ghost"
                    onPress={() => handleDeleteTodo(todo.id)}
                    size="sm"
                  >
                    <Ionicons name="trash-outline" size={16} color={dangerColor} />
                  </Button>
                </View>
              </Surface>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}
