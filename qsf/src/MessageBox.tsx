type Message = {
  text: string;
  type: 'info' | 'error' | 'success';
};

type Props = {
  message: Message | null;
  onClose: () => void;
};

export function MessageBox({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className={`message-box message-box-${message.type}`}>
      <div className="message-box-content">
        {message.text}
      </div>
      <button className="message-box-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}