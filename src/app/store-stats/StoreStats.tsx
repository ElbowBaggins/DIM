import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import type { DimStore, DimVault } from 'app/inventory/store-types';
import { PowerFormula, LoadoutStats } from '../store-stats/CharacterStats';
import D1CharacterStats from './D1CharacterStats';
import AccountCurrencies from './AccountCurrencies';
import VaultCapacity from './VaultCapacity';
import styles from './StoreStats.m.scss';
import { isPhonePortraitSelector } from 'app/inventory/selectors';

function isVault(store: DimStore): store is DimVault {
  return store.isVault;
}

function shouldShowCapacity(isPhonePortrait: boolean) {
  if (!isPhonePortrait) {
    return true;
  }
  return !$featureFlags.unstickyStats;
}

/** Render the store stats for any store type (character or vault) */
export default function StoreStats({
  store,
  style,
}: {
  store: DimStore;
  style?: React.CSSProperties;
}) {
  const isPhonePortrait = useSelector(isPhonePortraitSelector);
  return (
    <div className={clsx({ ['store-cell']: Boolean(style), vault: store.isVault })} style={style}>
      {isVault(store) ? (
        <div className={styles.vaultStats}>
          <AccountCurrencies store={store} />
          {shouldShowCapacity(isPhonePortrait) && <VaultCapacity store={store} />}
        </div>
      ) : store.destinyVersion === 1 ? (
        <D1CharacterStats stats={store.stats} />
      ) : (
        <div className="stat-bars destiny2">
          <PowerFormula stats={store.stats} storeId={store.id} />
          <LoadoutStats stats={store.stats} storeId={store.id} />
        </div>
      )}
    </div>
  );
}
