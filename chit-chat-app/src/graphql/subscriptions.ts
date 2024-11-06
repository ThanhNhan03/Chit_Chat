/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateGroupChat = /* GraphQL */ `subscription OnCreateGroupChat($filter: ModelSubscriptionGroupChatFilterInput) {
  onCreateGroupChat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateGroupChatSubscriptionVariables,
  APITypes.OnCreateGroupChatSubscription
>;
export const onUpdateGroupChat = /* GraphQL */ `subscription OnUpdateGroupChat($filter: ModelSubscriptionGroupChatFilterInput) {
  onUpdateGroupChat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateGroupChatSubscriptionVariables,
  APITypes.OnUpdateGroupChatSubscription
>;
export const onDeleteGroupChat = /* GraphQL */ `subscription OnDeleteGroupChat($filter: ModelSubscriptionGroupChatFilterInput) {
  onDeleteGroupChat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteGroupChatSubscriptionVariables,
  APITypes.OnDeleteGroupChatSubscription
>;
export const onCreateFriendChat = /* GraphQL */ `subscription OnCreateFriendChat(
  $filter: ModelSubscriptionFriendChatFilterInput
) {
  onCreateFriendChat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFriendChatSubscriptionVariables,
  APITypes.OnCreateFriendChatSubscription
>;
export const onUpdateFriendChat = /* GraphQL */ `subscription OnUpdateFriendChat(
  $filter: ModelSubscriptionFriendChatFilterInput
) {
  onUpdateFriendChat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFriendChatSubscriptionVariables,
  APITypes.OnUpdateFriendChatSubscription
>;
export const onDeleteFriendChat = /* GraphQL */ `subscription OnDeleteFriendChat(
  $filter: ModelSubscriptionFriendChatFilterInput
) {
  onDeleteFriendChat(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFriendChatSubscriptionVariables,
  APITypes.OnDeleteFriendChatSubscription
>;
export const onCreateMessages = /* GraphQL */ `subscription OnCreateMessages($filter: ModelSubscriptionMessagesFilterInput) {
  onCreateMessages(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMessagesSubscriptionVariables,
  APITypes.OnCreateMessagesSubscription
>;
export const onUpdateMessages = /* GraphQL */ `subscription OnUpdateMessages($filter: ModelSubscriptionMessagesFilterInput) {
  onUpdateMessages(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMessagesSubscriptionVariables,
  APITypes.OnUpdateMessagesSubscription
>;
export const onDeleteMessages = /* GraphQL */ `subscription OnDeleteMessages($filter: ModelSubscriptionMessagesFilterInput) {
  onDeleteMessages(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMessagesSubscriptionVariables,
  APITypes.OnDeleteMessagesSubscription
>;
export const onCreateContact = /* GraphQL */ `subscription OnCreateContact($filter: ModelSubscriptionContactFilterInput) {
  onCreateContact(filter: $filter) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateContactSubscriptionVariables,
  APITypes.OnCreateContactSubscription
>;
export const onUpdateContact = /* GraphQL */ `subscription OnUpdateContact($filter: ModelSubscriptionContactFilterInput) {
  onUpdateContact(filter: $filter) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateContactSubscriptionVariables,
  APITypes.OnUpdateContactSubscription
>;
export const onDeleteContact = /* GraphQL */ `subscription OnDeleteContact($filter: ModelSubscriptionContactFilterInput) {
  onDeleteContact(filter: $filter) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteContactSubscriptionVariables,
  APITypes.OnDeleteContactSubscription
>;
export const onCreateFriendRequests = /* GraphQL */ `subscription OnCreateFriendRequests(
  $filter: ModelSubscriptionFriendRequestsFilterInput
) {
  onCreateFriendRequests(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFriendRequestsSubscriptionVariables,
  APITypes.OnCreateFriendRequestsSubscription
>;
export const onUpdateFriendRequests = /* GraphQL */ `subscription OnUpdateFriendRequests(
  $filter: ModelSubscriptionFriendRequestsFilterInput
) {
  onUpdateFriendRequests(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFriendRequestsSubscriptionVariables,
  APITypes.OnUpdateFriendRequestsSubscription
>;
export const onDeleteFriendRequests = /* GraphQL */ `subscription OnDeleteFriendRequests(
  $filter: ModelSubscriptionFriendRequestsFilterInput
) {
  onDeleteFriendRequests(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFriendRequestsSubscriptionVariables,
  APITypes.OnDeleteFriendRequestsSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
