import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

interface Props {
  label: string;
  type: string;
}

function LocationInput({ label, type }: Props) {
  return (
    <FormControl>
      <FormLabel htmlFor={label}>{label}</FormLabel>
      <Input id={label} type={type} />
    </FormControl>
  );
}

export default LocationInput;
