import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';

import theme from '../../global/styles/theme';
import { Register } from '.';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn()
  }
})

const Providers: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('Register Screen', () => {
  it('Should be open category modal when user click on the button', async () => {
    const { getByTestId } = render(
      <Register />,
      {
        wrapper: Providers
      }
    );

    const categoryModal = getByTestId('category-modal');
    const buttonCategory = getByTestId('button-category');

    fireEvent.press(buttonCategory);

    await waitFor(() => {
      expect(categoryModal.props.visible).toBeTruthy();
    })
  })
})