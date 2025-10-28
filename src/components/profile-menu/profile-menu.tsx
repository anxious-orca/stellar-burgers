import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { logoutUser, selectIsLoading } from '../../services/slices/userSlice';
import { clearOrders } from '../../services/slices/ordersSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector<boolean>(selectIsLoading);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearOrders());
    navigate('/feed', { replace: true });
  };

  return (
    <ProfileMenuUI
      handleLogout={handleLogout}
      pathname={pathname}
      loading={loading}
    />
  );
};
