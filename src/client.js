import { createClient } from 'urql';

export const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/graphql';

export default createClient({ url: API_ENDPOINT });
