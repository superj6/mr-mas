import React, {createContext, useContext} from 'react';
import {LOOKS, Look, LookId} from './looks';

const Ctx = createContext<Look>(LOOKS.ink);

export const LookProvider: React.FC<{look: LookId | Look; children: React.ReactNode}> = ({look, children}) => (
  <Ctx.Provider value={typeof look === 'string' ? LOOKS[look] : look}>{children}</Ctx.Provider>
);

export const useLook = () => useContext(Ctx);
