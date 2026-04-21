import '@testing-library/jest-native/extend-expect';

jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('react-native-youtube-iframe', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockYoutubePlayer(props: Record<string, unknown>) {
    return React.createElement(Text, props, 'YoutubePlayer');
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return new Proxy(
    {},
    {
      get: (_, iconName) => {
        return function MockIcon(props: Record<string, unknown>) {
          return React.createElement(Text, props, String(iconName));
        };
      },
    }
  );
});
