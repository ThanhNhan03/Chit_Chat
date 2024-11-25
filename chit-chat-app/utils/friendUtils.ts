import { generateClient } from 'aws-amplify/api';
import { listContacts, getUser } from '../src/graphql/queries';

const client = generateClient();

export const getFriendPushTokens = async (userId: string): Promise<string[]> => {
  try {
    const friendsResponse = await client.graphql({
      query: listContacts,
      variables: {
        filter: {
          user_id: { eq: userId }
        }
      }
    });

    if (!friendsResponse.data?.listContacts?.items) {
      return [];
    }

    const friendIds = friendsResponse.data.listContacts.items.map(
      contact => contact.contact_user_id
    );

    const tokenPromises = friendIds.map(async (friendId) => {
      const userResponse = await client.graphql({
        query: getUser,
        variables: { id: friendId }
      });
      return userResponse.data?.getUser?.push_token;
    });

    const tokens = await Promise.all(tokenPromises);
    
    // Lọc bỏ các token null/undefined
    return tokens.filter(token => token) as string[];
  } catch (error) {
    console.error('Error getting friend tokens:', error);
    return [];
  }
}; 