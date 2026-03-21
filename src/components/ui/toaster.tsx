'use client';

import {
  Toaster as ChakraToaster,
  Toast,
  createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <Toast.Root>
          {toast.title && <Toast.Title />}
          {toast.description && <Toast.Description />}
          <Toast.CloseTrigger />
        </Toast.Root>
      )}
    </ChakraToaster>
  );
}
