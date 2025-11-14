import { Tabs } from 'expo-router';
import { Chrome as Home, BookOpen, Play, User, Notebook } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#E2DED0',
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#4E4F50',
        tabBarInactiveTintColor: '#928490',
        tabBarLabelStyle: {
          fontFamily: 'Montserrat-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="paths"
        options={{
          title: 'Paths',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ size, color }) => (
            <Play size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ size, color }) => (
            <Notebook size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories/[id]"
        options={{
          href: null, // Hide from tab bar
          title: 'Category',
        }}
      />
      <Tabs.Screen
        name="paths/[categoryId]/[pathId]"
        options={{
          href: null, // Hide from tab bar
          title: 'Path',
        }}
      />
    </Tabs>
  );
}
