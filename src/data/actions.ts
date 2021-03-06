import {createAction} from '@reduxjs/toolkit';
import {Payment, Child} from './types';

export const payment = createAction<Payment>('payment');
export const editChild = createAction<Child>('editChild');
export const addChild = createAction<Child>('addChild');
export const switchChild = createAction<Child>('switchChild');
