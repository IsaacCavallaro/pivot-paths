import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Card } from '@/utils/ui-components/Card';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';

describe('shared ui components', () => {
  it('renders card children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card content</Text>
      </Card>
    );

    expect(getByText('Card content')).toBeTruthy();
  });

  it('calls primary button press handler when enabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Continue" onPress={onPress} />
    );

    fireEvent.press(getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call primary button press handler when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Disabled" onPress={onPress} disabled />
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders sticky header title and progress UI', () => {
    const { getByText } = render(
      <StickyHeader onBack={jest.fn()} title="Path Title" progress={0.5} />
    );

    expect(getByText('Path Title')).toBeTruthy();
  });
});
