import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectError,
  selectIsAuthenticated,
  selectIsLoading
} from '../../services/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const isAuthenticated = useSelector<boolean>(selectIsAuthenticated);
  const error = useSelector<string | null>(selectError);
  const loading = useSelector<boolean>(selectIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password || !userName) {
      return;
    }
    const userData = {
      name: userName,
      email: email,
      password: password
    };
    dispatch(registerUser(userData));
  };

  if (isAuthenticated) {
    return <Navigate to={'/profile'} />;
  }

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};
