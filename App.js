import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Простой генератор ID вместо uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Типы сортировки
const SORT_TYPES = {
  DATE: 'date',
  TITLE: 'title',
  STATUS: 'status'
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [sortType, setSortType] = useState(SORT_TYPES.DATE);
  const [sortAscending, setSortAscending] = useState(true);

  // Загрузка задач при запуске
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить задачи');
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить задачи');
    }
  };

  // Функция сортировки задач
  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortType) {
        case SORT_TYPES.DATE:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case SORT_TYPES.TITLE:
          comparison = a.title.localeCompare(b.title);
          break;
        case SORT_TYPES.STATUS:
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      return sortAscending ? comparison : -comparison;
    });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Ошибка', 'Введите название задачи');
      return;
    }

    const newTask = {
      id: generateId(),
      title: newTaskTitle.trim(),
      description: '',
      dueDate: new Date().toISOString(),
      location: '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskTitle('');
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      'Удалить задачу',
      'Вы уверены?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
          }
        }
      ]
    );
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in_progress': return 'В процессе';
      case 'cancelled': return 'Отменено';
      default: return 'Ожидание';
    }
  };

  const getSortIcon = (type) => {
    if (sortType !== type) return '↕️';
    return sortAscending ? '⬆️' : '⬇️';
  };

  const handleSortPress = (type) => {
    if (sortType === type) {
      setSortAscending(!sortAscending);
    } else {
      setSortType(type);
      setSortAscending(true);
    }
  };

  const sortedTasks = getSortedTasks();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Менеджер задач</Text>
      
      {/* Форма добавления */}
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="Введите новую задачу..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Панель сортировки */}
      <View style={styles.sortPanel}>
        <Text style={styles.sortLabel}>Сортировка:</Text>
      <TouchableOpacity 
  style={[styles.sortButton, sortType === SORT_TYPES.DATE && styles.activeSortButton]}
  onPress={() => handleSortPress(SORT_TYPES.DATE)}
>
  <Text style={[
    styles.sortButtonText, 
    sortType === SORT_TYPES.DATE && { color: 'white' }
  ]}>
    Дата {getSortIcon(SORT_TYPES.DATE)}
  </Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[styles.sortButton, sortType === SORT_TYPES.TITLE && styles.activeSortButton]}
  onPress={() => handleSortPress(SORT_TYPES.TITLE)}
>
  <Text style={[
    styles.sortButtonText, 
    sortType === SORT_TYPES.TITLE && { color: 'white' }
  ]}>
    Название {getSortIcon(SORT_TYPES.TITLE)}
  </Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[styles.sortButton, sortType === SORT_TYPES.STATUS && styles.activeSortButton]}
  onPress={() => handleSortPress(SORT_TYPES.STATUS)}
>
  <Text style={[
    styles.sortButtonText, 
    sortType === SORT_TYPES.STATUS && { color: 'white' }
  ]}>
    Статус {getSortIcon(SORT_TYPES.STATUS)}
  </Text>
</TouchableOpacity>
      </View>

      {/* Список задач */}
      <FlatList
        data={sortedTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            
            <View style={styles.taskDetails}>
              <Text style={styles.taskDate}>
                📅 {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                {' • '}
                🕒 {new Date(item.createdAt).toLocaleTimeString('ru-RU')}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
            </View>

            <View style={styles.taskActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => updateTaskStatus(item.id, 'in_progress')}
              >
                <Text style={styles.actionText}>🔄</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => updateTaskStatus(item.id, 'completed')}
              >
                <Text style={styles.actionText}>✅</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Задач пока нет. Добавьте первую!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, top: 20,  padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  
  addForm: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  input: { 
    flex: 1, 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  addButton: { 
    backgroundColor: '#007AFF', 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  
  // Стили для панели сортировки
  sortPanel: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 8
  },
  sortLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#666',
    marginRight: 8
  },
  sortButton: { 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#e0e0e0'
  },
  activeSortButton: { 
    backgroundColor: '#007AFF' 
  },
  sortButtonText: { 
    fontSize: 12, 
    fontWeight: '500',
    color: '#666'
  },
  activeSortButtonText: { 
    color: '#fff' 
  },
  
  taskCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  taskDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  taskDate: { fontSize: 12, color: '#666', flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  
  taskActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  actionButton: { padding: 8, borderRadius: 8, backgroundColor: '#f0f0f0' },
  actionText: { fontSize: 16 },
  
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' }
});