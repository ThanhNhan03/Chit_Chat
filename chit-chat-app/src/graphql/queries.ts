/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getGroupChat = /* GraphQL */ `query GetGroupChat($id: ID!) {
  getGroupChat(id: $id) {
    id
    group_name
    created_by
    members
    created_at
    last_mesage
    updated_at
    group_picture
    description
    userID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGroupChatQueryVariables,
  APITypes.GetGroupChatQuery
>;
export const listGroupChats = /* GraphQL */ `query ListGroupChats(
  $filter: ModelGroupChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listGroupChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      group_name
      created_by
      members
      created_at
      last_mesage
      updated_at
      group_picture
      description
      userID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGroupChatsQueryVariables,
  APITypes.ListGroupChatsQuery
>;
export const groupChatsByUserID = /* GraphQL */ `query GroupChatsByUserID(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelGroupChatFilterInput
  $limit: Int
  $nextToken: String
) {
  groupChatsByUserID(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      group_name
      created_by
      members
      created_at
      last_mesage
      updated_at
      group_picture
      description
      userID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GroupChatsByUserIDQueryVariables,
  APITypes.GroupChatsByUserIDQuery
>;
export const getFriendChat = /* GraphQL */ `query GetFriendChat($id: ID!) {
  getFriendChat(id: $id) {
    id
    chat_id
    user_ids
    created_at
    last_message
    update_at
    userID
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFriendChatQueryVariables,
  APITypes.GetFriendChatQuery
>;
export const listFriendChats = /* GraphQL */ `query ListFriendChats(
  $filter: ModelFriendChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listFriendChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      chat_id
      user_ids
      created_at
      last_message
      update_at
      userID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFriendChatsQueryVariables,
  APITypes.ListFriendChatsQuery
>;
export const friendChatsByUserID = /* GraphQL */ `query FriendChatsByUserID(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFriendChatFilterInput
  $limit: Int
  $nextToken: String
) {
  friendChatsByUserID(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      chat_id
      user_ids
      created_at
      last_message
      update_at
      userID
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FriendChatsByUserIDQueryVariables,
  APITypes.FriendChatsByUserIDQuery
>;
export const getMessages = /* GraphQL */ `query GetMessages($id: ID!) {
  getMessages(id: $id) {
    id
    message_id
    chat_type
    chat_id
    group_id
    sender_id
    content
    timestamp
    status
    attchments
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMessagesQueryVariables,
  APITypes.GetMessagesQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessagesFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      message_id
      chat_type
      chat_id
      group_id
      sender_id
      content
      timestamp
      status
      attchments
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const getContact = /* GraphQL */ `query GetContact($id: ID!) {
  getContact(id: $id) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetContactQueryVariables,
  APITypes.GetContactQuery
>;
export const listContacts = /* GraphQL */ `query ListContacts(
  $filter: ModelContactFilterInput
  $limit: Int
  $nextToken: String
) {
  listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      contact_list
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListContactsQueryVariables,
  APITypes.ListContactsQuery
>;
export const getFriendRequests = /* GraphQL */ `query GetFriendRequests($id: ID!) {
  getFriendRequests(id: $id) {
    id
    request_id
    from_user_id
    to_user_id
    status
    timestamp
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetFriendRequestsQueryVariables,
  APITypes.GetFriendRequestsQuery
>;
export const listFriendRequests = /* GraphQL */ `query ListFriendRequests(
  $filter: ModelFriendRequestsFilterInput
  $limit: Int
  $nextToken: String
) {
  listFriendRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      request_id
      from_user_id
      to_user_id
      status
      timestamp
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFriendRequestsQueryVariables,
  APITypes.ListFriendRequestsQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    password
    profile_picture
    status
    last_seen
    FriendChats {
      nextToken
      __typename
    }
    GroupChats {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
