import { setupServer } from 'msw/node';

// This configures a Service Worker with the given request handlers.
export const mockServer = setupServer();
