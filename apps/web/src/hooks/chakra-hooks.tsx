import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/toast';

export interface UseToastProps extends UseToastOptions {
  title: string;
}

export const useToast = (options?: UseToastOptions) => useChakraToast({ isClosable: true, ...options });
