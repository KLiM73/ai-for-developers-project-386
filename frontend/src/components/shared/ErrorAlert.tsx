import { Alert } from '@mantine/core';
import { isApiError } from '../../types/api';

interface ErrorAlertProps {
  error: unknown;
  title?: string;
}

export function ErrorAlert({ error, title = 'Error' }: ErrorAlertProps) {
  const message = isApiError(error)
    ? error.message
    : 'An unexpected error occurred.';

  return (
    <Alert color="red" title={title}>
      {message}
    </Alert>
  );
}
