import '../../index.css';
import { Routes, Route, useLocation } from 'react-router-dom';

import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/slices/burgerSlice';
import { getFeeds } from '../../services/slices/feedsSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getFeeds());
  }, [dispatch]);

  return (
    <Routes>
      <Route path='/' element={<AppHeader />}>
        <Route index element={<ConstructorPage />} />
        <Route path='*' element={<NotFound404 />} />
        <Route path='feed' element={<Feed />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/orders' element={<ProfileOrders />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password' element={<ResetPassword />} />

        {/* <Route
          path='/feed/:number'
          element={
            <Modal title={''} onClose={() => null}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title={''} onClose={() => null}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title={''} onClose={() => null}>
              <OrderInfo />
            </Modal>
          }
        /> */}
      </Route>
    </Routes>
  );
};

export default App;
