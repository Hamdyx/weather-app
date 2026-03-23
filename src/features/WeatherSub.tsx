'use client';

import { Drawer, Button } from '@chakra-ui/react';
import { useState } from 'react';

import WeatherDrawerContent from './components/WeatherDrawerContent';

function WeatherSub() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button colorPalette="blue" onClick={() => setOpen(true)} m="auto 0">
        Details
      </Button>
      <Drawer.Root
        open={open}
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        size="xs"
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">Day Details</Drawer.Header>
            <Drawer.Body>
              <WeatherDrawerContent />
            </Drawer.Body>
            <Drawer.CloseTrigger />
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}

export default WeatherSub;
