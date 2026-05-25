import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { withUniwind } from "uniwind";

import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Surface } from "@/components/ui/surface";
import { Text } from "@/components/ui/text";
import { SignIn, SignUp } from "@/features/auth";
import { authClient } from "@/lib/auth-client";
import { todoMutations, todoQueries } from "./api";

const StyledIonicons = withUniwind(Ionicons);

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
              <Badge variant="secondary">
                <Text>
                  {completedCount}/{totalCount}
                </Text>
              </Badge>
            )}
          </View>
        </View>

        <Surface variant="secondary" className="mb-4 p-3 rounded-lg">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Input
                value={newTodoText}
                onChangeText={setNewTodoText}
                placeholder="Add a new task..."
                editable={!createMutation.isPending}
                onSubmitEditing={handleAddTodo}
                returnKeyType="done"
              />
            </View>
            <Button
              size="icon"
              className="size-9"
              variant={
                createMutation.isPending || !newTodoText.trim()
                  ? "secondary"
                  : "default"
              }
              disabled={createMutation.isPending || !newTodoText.trim()}
              onPress={handleAddTodo}
            >
              {createMutation.isPending ? (
                <Spinner size="sm" color="default" />
              ) : (
                <StyledIonicons
                  name="add"
                  size={20}
                  className={
                    createMutation.isPending || !newTodoText.trim()
                      ? "text-muted-foreground"
                      : "text-primary-foreground"
                  }
                />
              )}
            </Button>
          </View>
        </Surface>

        {isLoading && (
          <View className="items-center justify-center py-12">
            <Spinner size="lg" />
            <Text className="text-muted-foreground text-sm mt-3">Loading tasks...</Text>
          </View>
        )}

        {todos.data && todos.data.length === 0 && !isLoading && (
          <Surface
            variant="secondary"
            className="items-center justify-center py-10 rounded-lg"
          >
            <StyledIonicons
              name="checkbox-outline"
              size={40}
              className="text-muted-foreground"
            />
            <Text className="text-foreground font-medium mt-3">No tasks yet</Text>
            <Text className="text-muted-foreground text-xs mt-1">
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
                    checked={todo.completed}
                    onCheckedChange={() =>
                      handleToggleTodo(todo.id, todo.completed)
                    }
                  />
                  <View className="flex-1">
                    <Text
                      className={`text-sm ${
                        todo.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </Text>
                  </View>
                  <Button
                    size="icon"
                    className="size-9"
                    variant="ghost"
                    onPress={() => handleDeleteTodo(todo.id)}
                  >
                    <StyledIonicons
                      name="trash-outline"
                      size={16}
                      className="text-destructive"
                    />
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
