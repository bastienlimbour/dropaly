import { todoMutations, todoQueries } from "@/features/todos/api";

import { IconCheckbox, IconPlus, IconTrash } from "@tabler/icons-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, FlatList, View } from "react-native";

import { ScrollViewContainer } from "@/components/container";
import { Badge } from "@dropaly/ui-native/components/badge";
import { Button } from "@dropaly/ui-native/components/button";
import { Checkbox } from "@dropaly/ui-native/components/checkbox";
import { Icon } from "@dropaly/ui-native/components/icon";
import { Input } from "@dropaly/ui-native/components/input";
import { Spinner } from "@dropaly/ui-native/components/spinner";
import { Surface } from "@dropaly/ui-native/components/surface";
import { Text } from "@dropaly/ui-native/components/text";
import { SignIn, SignUp } from "@/features/auth";
import { authClient } from "@/lib/auth-client";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodosRoute() {
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
      <ScrollViewContainer
        scrollViewProps={{ contentContainerClassName: "p-6 gap-4" }}
      >
        <Text className="text-2xl font-semibold text-foreground">
          Sign in to manage your tasks
        </Text>
        <SignIn />
        <SignUp />
      </ScrollViewContainer>
    );
  }

  const isLoading = todos.isLoading;
  const data = (todos.data ?? []) as Todo[];
  const completedCount = data.filter((todo) => todo.completed).length;
  const totalCount = data.length;

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, gap: 8 }}
      contentInsetAdjustmentBehavior="automatic"
      data={data}
      keyExtractor={(todo) => String(todo.id)}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View className="gap-4 mb-2">
          {totalCount > 0 && (
            <View className="items-end">
              <Badge variant="secondary">
                <Text>
                  {completedCount}/{totalCount}
                </Text>
              </Badge>
            </View>
          )}

          <Surface variant="default" className="p-3 rounded-lg">
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
                      createMutation.isPending || !newTodoText.trim()
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
              <Text className="text-muted-foreground text-sm mt-3">
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
            className="items-center justify-center py-10 rounded-lg"
          >
            <Icon as={IconCheckbox} className="text-muted-foreground size-10" />
            <Text className="text-foreground font-medium mt-3">
              No tasks yet
            </Text>
            <Text className="text-muted-foreground text-xs mt-1">
              Add your first task to get started
            </Text>
          </Surface>
        ) : null
      }
      renderItem={({ item }) => (
        <Surface variant="default" className="p-3 rounded-lg">
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
