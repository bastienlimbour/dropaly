import { IconCheckbox, IconPlus, IconTrash } from "@tabler/icons-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, FlatList, View } from "react-native";

import { Badge } from "@dropaly/ui-mobile/components/badge";
import { Button } from "@dropaly/ui-mobile/components/button";
import { Checkbox } from "@dropaly/ui-mobile/components/checkbox";
import { Icon } from "@dropaly/ui-mobile/components/icon";
import { Input } from "@dropaly/ui-mobile/components/input";
import { Spinner } from "@dropaly/ui-mobile/components/spinner";
import { Surface } from "@dropaly/ui-mobile/components/surface";
import { Text } from "@dropaly/ui-mobile/components/text";

import { ScrollViewContainer } from "@/components/container";
import { SignIn, SignUp } from "@/features/auth";
import { todoMutations, todoQueries } from "@/features/todo/todo.api";
import { authClient } from "@/lib/auth-client";

export default function TodosRoute() {
  const [newTodoText, setNewTodoText] = useState("");
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user);

  const todos = useQuery({ ...todoQueries.list(), enabled: isAuthenticated });
  const createMutation = useMutation(
    todoMutations.create(queryClient, {
      onSuccess: () => {
        setNewTodoText("");
      },
    }),
  );
  const updateMutation = useMutation(todoMutations.update(queryClient));
  const deleteMutation = useMutation(todoMutations.delete(queryClient));

  function handleAddTodo() {
    if (newTodoText.trim() && isAuthenticated) {
      createMutation.mutate({ data: { text: newTodoText } });
    }
  }

  function handleToggleTodo(id: string, completed: boolean) {
    updateMutation.mutate({ id, data: { completed: !completed } });
  }

  function handleDeleteTodo(id: string) {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  }

  if (!isAuthenticated) {
    return (
      <ScrollViewContainer
        scrollViewProps={{ contentContainerClassName: "p-6 gap-4" }}
      >
        <Text className="text-foreground text-2xl font-semibold">
          Sign in to manage your tasks
        </Text>
        <SignIn />
        <SignUp />
      </ScrollViewContainer>
    );
  }

  const isLoading = todos.isLoading;
  const data = todos.data ?? [];
  const completedCount = data.filter((todo) => todo.completed).length;
  const totalCount = data.length;

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, gap: 8 }}
      contentInsetAdjustmentBehavior="automatic"
      data={data}
      keyExtractor={(todo) => todo.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View className="mb-2 gap-4">
          {totalCount > 0 && (
            <View className="items-end">
              <Badge variant="secondary">
                <Text>
                  {completedCount}/{totalCount}
                </Text>
              </Badge>
            </View>
          )}

          <Surface variant="default" className="rounded-lg p-3">
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
                  <Icon
                    as={IconPlus}
                    className={
                      !newTodoText.trim()
                        ? "text-muted-foreground size-5"
                        : "text-primary-foreground size-5"
                    }
                  />
                )}
              </Button>
            </View>
          </Surface>

          {isLoading && (
            <View className="items-center justify-center py-12">
              <Spinner size="lg" />
              <Text className="text-muted-foreground mt-3 text-sm">
                Loading tasks...
              </Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        !isLoading ? (
          <Surface
            variant="secondary"
            className="items-center justify-center rounded-lg py-10"
          >
            <Icon as={IconCheckbox} className="text-muted-foreground size-10" />
            <Text className="text-foreground mt-3 font-medium">No tasks yet</Text>
            <Text className="text-muted-foreground mt-1 text-xs">
              Add your first task to get started
            </Text>
          </Surface>
        ) : null
      }
      renderItem={({ item }) => (
        <Surface variant="default" className="rounded-lg p-3">
          <View className="flex-row items-center gap-3">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => handleToggleTodo(item.id, item.completed)}
            />
            <View className="flex-1">
              <Text
                className={`text-sm ${
                  item.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item.text}
              </Text>
            </View>
            <Button
              size="icon"
              className="size-9"
              variant="ghost"
              onPress={() => handleDeleteTodo(item.id)}
            >
              <Icon as={IconTrash} className="text-destructive size-4" />
            </Button>
          </View>
        </Surface>
      )}
    />
  );
}
