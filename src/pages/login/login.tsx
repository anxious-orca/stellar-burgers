import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectError,
  selectIsAuthenticated,
  selectIsLoading
} from '../../services/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const isAuthenticated = useSelector<boolean>(selectIsAuthenticated);
  const error = useSelector<string | null>(selectError);
  const loading = useSelector<boolean>(selectIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    const userData = {
      email: email,
      password: password
    };
    dispatch(loginUser(userData));
  };

  if (isAuthenticated) {
    return <Navigate to={'/profile'} />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};
