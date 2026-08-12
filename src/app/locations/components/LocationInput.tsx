import { Field, Input } from '@chakra-ui/react';

interface Props {
  label: string;
  type: string;
}

function LocationInput({ label, type }: Props) {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Input type={type} />
    </Field.Root>
  );
}

export default LocationInput;
