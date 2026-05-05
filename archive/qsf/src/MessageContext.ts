import { createContext, useContext } from 'react';

export type MessageType = 'info' | 'error' | 'success';

interface MessageContextType {
  showMessage: (text: string, type?: MessageType, duration?: number) => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};