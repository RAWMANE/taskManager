export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const getStatusText = (status) => {
  const statusMap = {
    [TaskStatus.PENDING]: 'Ожидание',
    [TaskStatus.IN_PROGRESS]: 'В процессе',
    [TaskStatus.COMPLETED]: 'Завершено', 
    [TaskStatus.CANCELLED]: 'Отменено'
  };
  return statusMap[status] || 'Ожидание';
};

export const getStatusColor = (status) => {
  const colorMap = {
    [TaskStatus.PENDING]: '#2196F3',
    [TaskStatus.IN_PROGRESS]: '#FF9800',
    [TaskStatus.COMPLETED]: '#4CAF50',
    [TaskStatus.CANCELLED]: '#F44336'
  };
  return colorMap[status] || '#2196F3';
};