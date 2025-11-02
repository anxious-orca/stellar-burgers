import {
  user,
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
  setAuthChecked,
  initialState,
  TUserState
} from './userSlice';
import {
  mockUser,
  userRegisterData,
  userLoginData,
  newMockUser
} from '../../__mocks__/user';
import { TApiError } from '@utils-types';

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса loginUser', () => {
  test('должен установить isLoading = true при loginUser.pending', () => {
    const nextState = user(initialState, loginUser.pending('', userLoginData));
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('должен установить данные пользователя authenticated и authChecked при loginUser.fulfilled', () => {
    const nextState = user(
      initialState,
      loginUser.fulfilled(mockUser, '', userLoginData)
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.data).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
  });

  test('должен записать ошибку, отметить authChecked и установить isLoading = false при loginUser.rejected', () => {
    const action = loginUser.rejected(null, '', userLoginData, {
      success: false,
      message: 'Ошибка входа'
    } as TApiError);
    const nextState = user(initialState, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Ошибка входа');
    expect(nextState.isAuthChecked).toBe(true);
  });

  test('loginUser.rejected без payload, устанавливается сообщение по умолчанию', () => {
    const nextState = user(
      initialState,
      loginUser.rejected(null, '', userLoginData)
    );
    expect(nextState.error).toBe('Ошибка входа');
  });
});

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса registerUser', () => {
  test('должен установить isLoading = true при registerUser.pending', () => {
    const nextState = user(
      initialState,
      registerUser.pending('', userRegisterData)
    );
    expect(nextState.loading).toBe(true);
  });

  test('должен установить данные пользователя authenticated и authChecked при registerUser.fulfilled', () => {
    const nextState = user(
      initialState,
      registerUser.fulfilled(mockUser, '', userRegisterData)
    );
    expect(nextState.data).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
  });

  test('должен записать ошибку, отметить authChecked и установить isLoading = false при registerUser.rejected', () => {
    const action = registerUser.rejected(null, '', userRegisterData, {
      success: false,
      message: 'Ошибка регистрации'
    } as TApiError);
    const nextState = user(initialState, action);
    expect(nextState.error).toBe('Ошибка регистрации');
    expect(nextState.isAuthChecked).toBe(true);
  });

  test('registerUser.rejected без payload, устанавливается сообщение по умолчанию', () => {
    const nextState = user(
      initialState,
      registerUser.rejected(null, '', userRegisterData)
    );
    expect(nextState.error).toBe('Ошибка регистрации');
  });
});

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса logoutUser', () => {
  test('должен установить isLoading = true при logoutUser.pending', () => {
    const nextState = user(initialState, logoutUser.pending('', undefined));
    expect(nextState.loading).toBe(true);
  });

  test('должен установить данные пользователя authenticated и authChecked при logoutUser.fulfilled', () => {
    const prevState: TUserState = {
      ...initialState,
      data: mockUser,
      isAuthenticated: true,
      isAuthChecked: true,
      loading: true
    };
    const nextState = user(
      prevState,
      logoutUser.fulfilled(undefined, '', undefined)
    );
    expect(nextState.data).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.loading).toBe(false);
  });
});

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса getUser и updateUser', () => {
  test('должен установить данные пользователя authenticated и authChecked при getUser.fulfilled', () => {
    const nextState = user(
      initialState,
      getUser.fulfilled(mockUser, '', undefined)
    );
    expect(nextState.data).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isAuthChecked).toBe(true);
  });

  test('обновляет данные пользователя при updateUser.fulfilled', () => {
    const prevState: TUserState = {
      ...initialState,
      data: newMockUser,
      isAuthenticated: true
    };
    const nextState = user(
      prevState,
      updateUser.fulfilled(mockUser, '', { name: 'Боб' })
    );
    expect(nextState.data).toEqual(mockUser);
  });
});

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса forgotPassword и resetPassword', () => {
  // forgotPassword
  test('должен установить isLoading = true при forgotPassword.pending', () => {
    const nextState = user(
      initialState,
      forgotPassword.pending('', { email: '' })
    );
    expect(nextState.loading).toBe(true);
  });

  test('должен установить isLoading = false при forgotPassword.fulfilled', () => {
    const prevState = { ...initialState, loading: true, error: 'Ошибка' };
    const nextState = user(
      prevState,
      forgotPassword.fulfilled(undefined, '', { email: '' })
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('должен записать ошибку при forgotPassword.rejected', () => {
    const action = forgotPassword.rejected(null, '', { email: '' }, {
      success: false,
      message: 'Ошибка восстановления пароля'
    } as TApiError);
    const nextState = user(initialState, action);
    expect(nextState.error).toBe('Ошибка восстановления пароля');
  });

  test('если rejected без payload, устанавливается сообщение по умолчанию', () => {
    const nextState = user(
      initialState,
      forgotPassword.rejected(null, '', { email: '' })
    );
    expect(nextState.error).toBe('Ошибка восстановления пароля');
  });

  // resetPassword
  test('должен установить isLoading = true при resetPassword.pending', () => {
    const nextState = user(
      initialState,
      resetPassword.pending('', { password: '', token: '' })
    );
    expect(nextState.loading).toBe(true);
  });

  test('должен установить isLoading = false при resetPassword.fulfilled', () => {
    const prevState = { ...initialState, loading: true, error: 'Ошибка' };
    const nextState = user(
      prevState,
      resetPassword.fulfilled(undefined, '', { password: '', token: '' })
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  test('должен записать ошибку при resetPassword.rejected', () => {
    const action = resetPassword.rejected(
      null,
      '',
      { password: '', token: '' },
      {
        success: false,
        message: 'Ошибка сброса пароля'
      } as TApiError
    );
    const nextState = user(initialState, action);
    expect(nextState.error).toBe('Ошибка сброса пароля');
  });

  test('если rejected без payload, устанавливается сообщение по умолчанию', () => {
    const nextState = user(
      initialState,
      resetPassword.rejected(null, '', { password: '', token: '' })
    );
    expect(nextState.error).toBe('Ошибка сброса пароля');
  });

  // setAuthChecked reducer
  test('setAuthChecked устанавливает isAuthChecked = true', () => {
    const nextState = user(initialState, setAuthChecked(true));
    expect(nextState.isAuthChecked).toBe(true);
  });
});
