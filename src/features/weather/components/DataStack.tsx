import { VStack, Text, Skeleton } from '@chakra-ui/react';

interface Props {
  value: string | number;
  title: string;
  loading: boolean;
}

function DataStack({ value, title, loading }: Props) {
  return (
    <VStack>
      <Text fontSize="md">{title}</Text>
      <Skeleton loading={loading}>
        <Text fontSize="md">{value}</Text>
      </Skeleton>
    </VStack>
  );
}
export default DataStack;
