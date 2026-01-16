import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

interface Employee {
  id: string;
  name: string;
  role: string;
  status: string;
}

// DYNAMIC DATA (From API or local storage)
const EMPLOYEES = [
  { id: 1, name: 'John Doe', role: 'Lead Developer', status: 'online' },
  { id: 2, name: 'Jane Smith', role: 'UI Designer', status: 'offline' },
  { id: 3, name: 'Sam Wilson', role: 'Junior Developer', status: 'online' },
  { id: 4, name: 'Alex Reed', role: 'DevOps', status: 'online' },
];

export default function HomeScreen() {
  const renderItem = ({ item }: { item: Employee }) => {
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push({
          pathname: '/detail',
          params: {
            name: item.name,
            role: item.role,
          },
        })}
      >
        <View style={styles.avatarPlaceholder} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.role}</Text>
        </View>
        <View style={[ styles.statusBadge, { backgroundColor: item.status === 'online' ? '#4CAF50' : '#9e9e9e'}]} />
      </TouchableOpacity>
    );
  };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => {
        const formattedData = json.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          role: user.company.name,
          status: 'online',
        }));
        setEmployees(formattedData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={employees}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Team Members</Text>}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1e4e8',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
