import GenericLookupModal from './GenericLookupModal';
import { useLookup } from '../../context/LookupContext';
import { LOOKUP_CONFIGS } from './lookupConfigs';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const EMPTY_STATE = {
  data: [],
  loading: false,
  error: null
};

const emptySelector = () => EMPTY_STATE;

export default function LookupProviderRenderer() {
  const { lookupConfig, closeLookup } = useLookup();
  const dispatch = useDispatch();

  const config = lookupConfig ? LOOKUP_CONFIGS[lookupConfig.type] : null;

  const { data, loading, error } = useSelector(config?.selector || emptySelector);

  useEffect(() => {
    if (!lookupConfig?.open || !config) return;

    if (lookupConfig.loadParams !== undefined) {
      dispatch(config.loadAction(lookupConfig.loadParams));
    } else if (!data?.length) {
      dispatch(config.loadAction());
    }
  }, [lookupConfig?.open, lookupConfig?.loadParams, config, data?.length, dispatch]);

  if (!lookupConfig || !config) return null;

  return (
    <GenericLookupModal
      {...config}
      {...lookupConfig}
      data={data}
      loading={loading}
      error={error}
      open={lookupConfig.open}
      onClose={closeLookup}
    />
    
  );
}
