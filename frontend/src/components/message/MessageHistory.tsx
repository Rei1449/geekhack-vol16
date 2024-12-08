import styled from 'styled-components';

export function MessageHistory({
  isOpen,
  onClickOutside,
  onClose,
}: {
  isOpen: boolean;
  onClickOutside: () => void;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <DialogOverlay onClick={onClickOutside}>
      <DialogWrapper>
        <Dialog>
          <button onClick={onClose}>X</button>
        </Dialog>
      </DialogWrapper>
    </DialogOverlay>
  );
}

const DialogOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const DialogWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Dialog = styled.div`
  background-color: white;
  border-radius: 8px;
  height: 100%;
  width: 400px;
  max-width: 100%;
`;
