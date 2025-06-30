import * as Dialog from "@radix-ui/react-dialog";
import "./styles.css";

type PropertiesModalProps = {
  children: React.ReactNode;
};

export const PropertiesModal = ({ children }: PropertiesModalProps) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet">Some</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>

        {children}

        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            X
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
