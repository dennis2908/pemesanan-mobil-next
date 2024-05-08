import { Redis } from '@upstash/redis';

export const RedisConfig = () => {
  return new Redis({
    url: 'https://us1-precious-goose-37986.upstash.io',
    token: 'AZRiASQgNGI1MWI1NmItZTY2Ni00NmMwLTg3NGQtMjQ1NTNjZTY0YTZiYjk2MjAzNDE2MDE5NGFhMDliYWM1Zjc5MTdjZWNlMDM=',
  });
};
