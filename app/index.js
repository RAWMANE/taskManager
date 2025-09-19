import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTasks } from '../context/TaskContext';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { tasks, addTask, deleteTask } = useTasks();
  const router = useRouter();

  const handleAddTestTask = () => {
    const newTask = {
      id: uuidv4(),
      title: 'Тестовая задача ' + (tasks.length + 1),
      description: 'Это тестовая задача',
      dueDate: new Date().toISOString(),
      location: 'Тестовое местоположение',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    addTask(newTask);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Менеджер задач</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleAddTestTask}>
        <Text style={styles.buttonText}>Добавить тестовую задачу</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  task: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  taskTitle: { fontWeight: 'bold', marginBottom: 5 },
  delete: { color: 'red', marginTop: 10 }
});