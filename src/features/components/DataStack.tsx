import { VStack, Text, Skeleton } from '@chakra-ui/react';

interface Props {
  className: string;
  value: string | number;
  title: string;
  loading: boolean;
}

function DataStack({ className, value, title, loading }: Props) {
  return (
    <VStack>
      <Text fontSize="md">{title}</Text>
      <Skeleton loading={loading}>
        <Text fontSize="md" className={className}>
          {value}
        </Text>
      </Skeleton>
    </VStack>
  );
}
export default DataStack;
