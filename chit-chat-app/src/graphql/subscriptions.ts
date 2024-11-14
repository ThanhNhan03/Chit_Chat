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
    members {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    group_picture
    description
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
    members {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    group_picture
    description
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
    members {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    group_picture
    description
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
    users {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
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
    users {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
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
    users {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
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
    chat_type
    chat_id
    sender_id
    content
    timestamp
    status
    attachments
    reactions {
      nextToken
      __typename
    }
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
    chat_type
    chat_id
    sender_id
    content
    timestamp
    status
    attachments
    reactions {
      nextToken
      __typename
    }
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
    chat_type
    chat_id
    sender_id
    content
    timestamp
    status
    attachments
    reactions {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMessagesSubscriptionVariables,
  APITypes.OnDeleteMessagesSubscription
>;
export const onCreateReactions = /* GraphQL */ `subscription OnCreateReactions($filter: ModelSubscriptionReactionsFilterInput) {
  onCreateReactions(filter: $filter) {
    id
    message_id
    user_id
    icon
    created_at
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateReactionsSubscriptionVariables,
  APITypes.OnCreateReactionsSubscription
>;
export const onUpdateReactions = /* GraphQL */ `subscription OnUpdateReactions($filter: ModelSubscriptionReactionsFilterInput) {
  onUpdateReactions(filter: $filter) {
    id
    message_id
    user_id
    icon
    created_at
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateReactionsSubscriptionVariables,
  APITypes.OnUpdateReactionsSubscription
>;
export const onDeleteReactions = /* GraphQL */ `subscription OnDeleteReactions($filter: ModelSubscriptionReactionsFilterInput) {
  onDeleteReactions(filter: $filter) {
    id
    message_id
    user_id
    icon
    created_at
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteReactionsSubscriptionVariables,
  APITypes.OnDeleteReactionsSubscription
>;
export const onCreateContact = /* GraphQL */ `subscription OnCreateContact($filter: ModelSubscriptionContactFilterInput) {
  onCreateContact(filter: $filter) {
    id
    user_id
    contact_user_id
    created_at
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
    user_id
    contact_user_id
    created_at
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
    user_id
    contact_user_id
    created_at
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
    from_user_id
    to_user_id
    status
    created_at
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
    from_user_id
    to_user_id
    status
    created_at
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
    from_user_id
    to_user_id
    status
    created_at
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
    Contacts {
      nextToken
      __typename
    }
    SentFriendRequests {
      nextToken
      __typename
    }
    ReceivedFriendRequests {
      nextToken
      __typename
    }
    Reactions {
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
    Contacts {
      nextToken
      __typename
    }
    SentFriendRequests {
      nextToken
      __typename
    }
    ReceivedFriendRequests {
      nextToken
      __typename
    }
    Reactions {
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
    Contacts {
      nextToken
      __typename
    }
    SentFriendRequests {
      nextToken
      __typename
    }
    ReceivedFriendRequests {
      nextToken
      __typename
    }
    Reactions {
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
export const onCreateUserGroupChat = /* GraphQL */ `subscription OnCreateUserGroupChat(
  $filter: ModelSubscriptionUserGroupChatFilterInput
) {
  onCreateUserGroupChat(filter: $filter) {
    id
    user_id
    group_chat_id
    user {
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
    groupChat {
      id
      group_name
      created_by
      created_at
      last_message
      updated_at
      group_picture
      description
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserGroupChatSubscriptionVariables,
  APITypes.OnCreateUserGroupChatSubscription
>;
export const onUpdateUserGroupChat = /* GraphQL */ `subscription OnUpdateUserGroupChat(
  $filter: ModelSubscriptionUserGroupChatFilterInput
) {
  onUpdateUserGroupChat(filter: $filter) {
    id
    user_id
    group_chat_id
    user {
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
    groupChat {
      id
      group_name
      created_by
      created_at
      last_message
      updated_at
      group_picture
      description
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserGroupChatSubscriptionVariables,
  APITypes.OnUpdateUserGroupChatSubscription
>;
export const onDeleteUserGroupChat = /* GraphQL */ `subscription OnDeleteUserGroupChat(
  $filter: ModelSubscriptionUserGroupChatFilterInput
) {
  onDeleteUserGroupChat(filter: $filter) {
    id
    user_id
    group_chat_id
    user {
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
    groupChat {
      id
      group_name
      created_by
      created_at
      last_message
      updated_at
      group_picture
      description
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserGroupChatSubscriptionVariables,
  APITypes.OnDeleteUserGroupChatSubscription
>;
export const onCreateUserFriendChat = /* GraphQL */ `subscription OnCreateUserFriendChat(
  $filter: ModelSubscriptionUserFriendChatFilterInput
) {
  onCreateUserFriendChat(filter: $filter) {
    id
    user_id
    friend_chat_id
    user {
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
    friendChat {
      id
      chat_id
      created_at
      last_message
      updated_at
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserFriendChatSubscriptionVariables,
  APITypes.OnCreateUserFriendChatSubscription
>;
export const onUpdateUserFriendChat = /* GraphQL */ `subscription OnUpdateUserFriendChat(
  $filter: ModelSubscriptionUserFriendChatFilterInput
) {
  onUpdateUserFriendChat(filter: $filter) {
    id
    user_id
    friend_chat_id
    user {
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
    friendChat {
      id
      chat_id
      created_at
      last_message
      updated_at
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserFriendChatSubscriptionVariables,
  APITypes.OnUpdateUserFriendChatSubscription
>;
export const onDeleteUserFriendChat = /* GraphQL */ `subscription OnDeleteUserFriendChat(
  $filter: ModelSubscriptionUserFriendChatFilterInput
) {
  onDeleteUserFriendChat(filter: $filter) {
    id
    user_id
    friend_chat_id
    user {
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
    friendChat {
      id
      chat_id
      created_at
      last_message
      updated_at
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserFriendChatSubscriptionVariables,
  APITypes.OnDeleteUserFriendChatSubscription
>;
