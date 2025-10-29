import { FC, useState, SyntheticEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  selectAuthError,
  selectIsAuthenticated,
  selectAuthIsLoading
} from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector<boolean>(selectIsAuthenticated);
  const loading = useSelector<boolean>(selectAuthIsLoading);
  const error = useSelector<string | null>(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      });
  };

  if (isAuthenticated) {
    return <Navigate to={'/profile'} />;
  }

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      loading={loading}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
