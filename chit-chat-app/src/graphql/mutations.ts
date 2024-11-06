/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createGroupChat = /* GraphQL */ `mutation CreateGroupChat(
  $input: CreateGroupChatInput!
  $condition: ModelGroupChatConditionInput
) {
  createGroupChat(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGroupChatMutationVariables,
  APITypes.CreateGroupChatMutation
>;
export const updateGroupChat = /* GraphQL */ `mutation UpdateGroupChat(
  $input: UpdateGroupChatInput!
  $condition: ModelGroupChatConditionInput
) {
  updateGroupChat(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGroupChatMutationVariables,
  APITypes.UpdateGroupChatMutation
>;
export const deleteGroupChat = /* GraphQL */ `mutation DeleteGroupChat(
  $input: DeleteGroupChatInput!
  $condition: ModelGroupChatConditionInput
) {
  deleteGroupChat(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGroupChatMutationVariables,
  APITypes.DeleteGroupChatMutation
>;
export const createFriendChat = /* GraphQL */ `mutation CreateFriendChat(
  $input: CreateFriendChatInput!
  $condition: ModelFriendChatConditionInput
) {
  createFriendChat(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFriendChatMutationVariables,
  APITypes.CreateFriendChatMutation
>;
export const updateFriendChat = /* GraphQL */ `mutation UpdateFriendChat(
  $input: UpdateFriendChatInput!
  $condition: ModelFriendChatConditionInput
) {
  updateFriendChat(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFriendChatMutationVariables,
  APITypes.UpdateFriendChatMutation
>;
export const deleteFriendChat = /* GraphQL */ `mutation DeleteFriendChat(
  $input: DeleteFriendChatInput!
  $condition: ModelFriendChatConditionInput
) {
  deleteFriendChat(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFriendChatMutationVariables,
  APITypes.DeleteFriendChatMutation
>;
export const createMessages = /* GraphQL */ `mutation CreateMessages(
  $input: CreateMessagesInput!
  $condition: ModelMessagesConditionInput
) {
  createMessages(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMessagesMutationVariables,
  APITypes.CreateMessagesMutation
>;
export const updateMessages = /* GraphQL */ `mutation UpdateMessages(
  $input: UpdateMessagesInput!
  $condition: ModelMessagesConditionInput
) {
  updateMessages(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMessagesMutationVariables,
  APITypes.UpdateMessagesMutation
>;
export const deleteMessages = /* GraphQL */ `mutation DeleteMessages(
  $input: DeleteMessagesInput!
  $condition: ModelMessagesConditionInput
) {
  deleteMessages(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMessagesMutationVariables,
  APITypes.DeleteMessagesMutation
>;
export const createContact = /* GraphQL */ `mutation CreateContact(
  $input: CreateContactInput!
  $condition: ModelContactConditionInput
) {
  createContact(input: $input, condition: $condition) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateContactMutationVariables,
  APITypes.CreateContactMutation
>;
export const updateContact = /* GraphQL */ `mutation UpdateContact(
  $input: UpdateContactInput!
  $condition: ModelContactConditionInput
) {
  updateContact(input: $input, condition: $condition) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateContactMutationVariables,
  APITypes.UpdateContactMutation
>;
export const deleteContact = /* GraphQL */ `mutation DeleteContact(
  $input: DeleteContactInput!
  $condition: ModelContactConditionInput
) {
  deleteContact(input: $input, condition: $condition) {
    id
    contact_list
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteContactMutationVariables,
  APITypes.DeleteContactMutation
>;
export const createFriendRequests = /* GraphQL */ `mutation CreateFriendRequests(
  $input: CreateFriendRequestsInput!
  $condition: ModelFriendRequestsConditionInput
) {
  createFriendRequests(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFriendRequestsMutationVariables,
  APITypes.CreateFriendRequestsMutation
>;
export const updateFriendRequests = /* GraphQL */ `mutation UpdateFriendRequests(
  $input: UpdateFriendRequestsInput!
  $condition: ModelFriendRequestsConditionInput
) {
  updateFriendRequests(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFriendRequestsMutationVariables,
  APITypes.UpdateFriendRequestsMutation
>;
export const deleteFriendRequests = /* GraphQL */ `mutation DeleteFriendRequests(
  $input: DeleteFriendRequestsInput!
  $condition: ModelFriendRequestsConditionInput
) {
  deleteFriendRequests(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFriendRequestsMutationVariables,
  APITypes.DeleteFriendRequestsMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
