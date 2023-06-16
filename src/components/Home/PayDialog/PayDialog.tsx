import React, {useEffect} from 'react';
import {MoneyInput} from './MoneyInput';
import {useAppDispatch, useAppSelector} from '../../../data/store';
import {
  activeChildDetailsSelector,
  activeChildSelector,
  settingsSelector,
} from '../../../data/children/childSelectors';
import {amountOwedSelector} from '../../../data/payments/paymentSelectors';
import actions from '../../../data/actions';
import {formatDate} from '../../../data/utils';
import {Payment} from '../../../data/types';
import {ActionSheet} from '../../shared/ActionSheet';
import {generateUUID} from '../../../utils/uuid';
import {getCurrentPayment} from '../../../data/settings/selectors';

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
  const amount = useAppSelector(getCurrentPayment);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actions.setCurrentPayment(owed));
  }, [owed, dispatch]);

  const onDone = () => {
    const payload: Payment = {
      id: generateUUID('PAYMENT'),
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
        owed={owed}
        step={settings.pocketMoneyPerWeek / 2}
      />
    </ActionSheet>
  );
};
