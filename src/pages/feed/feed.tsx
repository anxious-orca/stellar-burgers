import styles from './feed.module.css';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  selectFeedsError,
  selectFeedsIsLoading,
  selectOrders
} from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector<TOrder[]>(selectOrders);
  const isLoading = useSelector<boolean>(selectFeedsIsLoading);
  const error = useSelector<string | null>(selectFeedsError);

  if (error) {
    return (
      <p className={`${styles.error} text text_type_main-default pb-6`}>
        {error}
      </p>
    );
  }

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
