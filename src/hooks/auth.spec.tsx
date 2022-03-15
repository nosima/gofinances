import { renderHook, act } from '@testing-library/react-hooks';
import { startAsync } from 'expo-auth-session';
import fetchMock from 'jest-fetch-mock';
import { mocked } from 'ts-jest/utils';
import { AuthProvider, useAuth } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-auth-session');

//Coloque no inicio do arquivo para habilitar o mock do fetch.
fetchMock.enableMocks();

describe('Auth Hook', () => {
  beforeEach(async () => {
    const userCollectionKey = '@gofinances:user'
    await AsyncStorage.removeItem(userCollectionKey)
 })

  it('should be able to sign in with existing Google Account', async() => {

    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
        type: 'success',
        params: {
            access_token: 'any_token',
        }
    });

    const userTest = {
      id: 'any_id',
      email: 'teste@email.com',
      name: 'Teste',
      photo: 'any_photo.png'
    };

    fetchMock.mockResponseOnce(JSON.stringify(userTest));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    //console.log("HOOK DE AUTENTICAÇÃO");
    //console.log(result.current);

    // act porque dentro da funcao salva estado
    await act(() => result.current.signInWithGoogle());

    // Você até pode usar esse console.log para visualizar os dados.
    //await console.log("USER PROFILE =>", result.current.user);

    expect(result.current.user.email)
    .toBe('teste@email.com');

  });

  it('user should should not connect if cancel authentication with Google', async() => {

    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'cancel',
    });
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // act porque dentro da funcao salva estado
    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty('id');
    
  });

  it('should be error with incorrectly Google parameters', async () => {
    const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider
    });

    try {
        await act(() => result.current.signInWithGoogle());
    } catch (error) {
        expect(result.current.user).toEqual({});
    }
  });

  it('should be error with incorrectly Google parameters', async () => {
   
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    try {
      // act porque dentro da funcao salva estado
      await act(() => result.current.signInWithGoogle());
    } catch {
      expect(result.current.user).toEqual({});
    }

  });
  
});