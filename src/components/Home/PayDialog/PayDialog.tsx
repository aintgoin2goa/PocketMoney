import React, {useState} from 'react';
import {MoneyInput} from './MoneyInput';
import {useAppDispatch, useAppSelector} from '../../../data/store';
import {
  activeChildDetailsSelector,
  activeChildSelector,
  settingsSelector,
} from '../../../data/children/childSelectors';
import {amountOwedSelector} from '../../../data/payments/paymentSelectors';
import actions from '../../../data/actions';
import {formatDate, uid} from '../../../data/utils';
import {Payment} from '../../../data/types';
import {ActionSheet} from '../../shared/ActionSheet';

export type PayDialogProps = {
  showPayDialog: boolean;
  setShowPayDialog: (show: boolean) => void;
};

export const PayDialog: React.FC<PayDialogProps> = ({
  showPayDialog,
  setShowPayDialog,
}) => {
  const settings = useAppSelector(settingsSelector);
  const owed = useAppSelector(amountOwedSelector);
  const activeChildName = useAppSelector(activeChildSelector);
  const activeChild = useAppSelector(activeChildDetailsSelector);
  const [amount, setAmount] = useState(owed);
  const dispatch = useAppDispatch();
  const onDone = () => {
    const payload: Payment = {
      id: uid('PAYMENT'),
      date: formatDate(new Date()),
      owed,
      paid: amount,
      remaining: owed - amount,
      child: activeChildName,
      childId: activeChild.id,
    };
    dispatch(actions.makePayment(payload));
  };
  return (
    <ActionSheet
      show={showPayDialog}
      setShow={setShowPayDialog}
      onDone={onDone}>
      <MoneyInput
        currency={settings.currency}
        pocketMoneyPerWeek={settings.pocketMoneyPerWeek}
        amount={amount}
        owed={owed}
        step={settings.pocketMoneyPerWeek / 2}
        setAmount={setAmount}
      />
    </ActionSheet>
  );
};
