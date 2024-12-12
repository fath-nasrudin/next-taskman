import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from '@tanstack/react-query';
import { serialize, deserialize } from '@/lib/transformer';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      hydrate: {
        deserializeData: deserialize,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',

        serializeData: serialize,
      },
    },
  });
}

let browserQuerClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQuerClient) browserQuerClient = makeQueryClient();
    return browserQuerClient;
  }
}
