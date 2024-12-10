import { WritableDraft } from 'immer/dist/internal';
import Dict from '../../Dict';
import Async from '../State/Async';

export const mutate = <B, T>(values: Dict<Async<B, T>>, id: string, recipe: (draft: WritableDraft<T>) => void) => ({
  ...values,
  [id]: Async.mutate(values[id], recipe),
});

