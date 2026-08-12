'use client';

import { Drawer, Button, CloseButton } from '@chakra-ui/react';
import { useState } from 'react';

import WeatherDrawerContent from './WeatherDrawerContent';

function WeatherSub() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button colorPalette="blue" onClick={() => setOpen(true)} m="auto 0">
        Details
      </Button>
      <Drawer.Root
        open={open}
        onOpenChange={(e: Drawer.OpenChangeDetails) => setOpen(e.open)}
        size="xs"
        lazyMount
        unmountOnExit
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title fontSize="inherit" fontWeight="inherit">
                Day Details
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <WeatherDrawerContent />
            </Drawer.Body>
            <Drawer.CloseTrigger
              asChild
              position="absolute"
              top="2"
              insetEnd="2"
            >
              <CloseButton aria-label="Close" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}

export default WeatherSub;
