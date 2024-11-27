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
    members {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    group_picture
    description
    messages {
      nextToken
      __typename
    }
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
    members {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    group_picture
    description
    messages {
      nextToken
      __typename
    }
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
    members {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    group_picture
    description
    messages {
      nextToken
      __typename
    }
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
    users {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    messages {
      nextToken
      __typename
    }
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
    users {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    messages {
      nextToken
      __typename
    }
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
    users {
      nextToken
      __typename
    }
    created_at
    last_message
    updated_at
    messages {
      nextToken
      __typename
    }
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
    chat_type
    chat_id
    sender_id
    content
    timestamp
    status
    attachments
    message_reactions {
      nextToken
      __typename
    }
    sender {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    reply_to_message_id
    reply_to_message {
      id
      chat_type
      chat_id
      sender_id
      content
      timestamp
      status
      attachments
      reply_to_message_id
      createdAt
      updatedAt
      __typename
    }
    replied_messages {
      nextToken
      __typename
    }
    group_chat {
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
    friend_chat {
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
    chat_type
    chat_id
    sender_id
    content
    timestamp
    status
    attachments
    message_reactions {
      nextToken
      __typename
    }
    sender {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    reply_to_message_id
    reply_to_message {
      id
      chat_type
      chat_id
      sender_id
      content
      timestamp
      status
      attachments
      reply_to_message_id
      createdAt
      updatedAt
      __typename
    }
    replied_messages {
      nextToken
      __typename
    }
    group_chat {
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
    friend_chat {
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
    chat_type
    chat_id
    sender_id
    content
    timestamp
    status
    attachments
    message_reactions {
      nextToken
      __typename
    }
    sender {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    reply_to_message_id
    reply_to_message {
      id
      chat_type
      chat_id
      sender_id
      content
      timestamp
      status
      attachments
      reply_to_message_id
      createdAt
      updatedAt
      __typename
    }
    replied_messages {
      nextToken
      __typename
    }
    group_chat {
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
    friend_chat {
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
` as GeneratedMutation<
  APITypes.DeleteMessagesMutationVariables,
  APITypes.DeleteMessagesMutation
>;
export const createMessageReaction = /* GraphQL */ `mutation CreateMessageReaction(
  $input: CreateMessageReactionInput!
  $condition: ModelMessageReactionConditionInput
) {
  createMessageReaction(input: $input, condition: $condition) {
    id
    message_id
    user_id
    icon
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    message {
      id
      chat_type
      chat_id
      sender_id
      content
      timestamp
      status
      attachments
      reply_to_message_id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMessageReactionMutationVariables,
  APITypes.CreateMessageReactionMutation
>;
export const updateMessageReaction = /* GraphQL */ `mutation UpdateMessageReaction(
  $input: UpdateMessageReactionInput!
  $condition: ModelMessageReactionConditionInput
) {
  updateMessageReaction(input: $input, condition: $condition) {
    id
    message_id
    user_id
    icon
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    message {
      id
      chat_type
      chat_id
      sender_id
      content
      timestamp
      status
      attachments
      reply_to_message_id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMessageReactionMutationVariables,
  APITypes.UpdateMessageReactionMutation
>;
export const deleteMessageReaction = /* GraphQL */ `mutation DeleteMessageReaction(
  $input: DeleteMessageReactionInput!
  $condition: ModelMessageReactionConditionInput
) {
  deleteMessageReaction(input: $input, condition: $condition) {
    id
    message_id
    user_id
    icon
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    message {
      id
      chat_type
      chat_id
      sender_id
      content
      timestamp
      status
      attachments
      reply_to_message_id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMessageReactionMutationVariables,
  APITypes.DeleteMessageReactionMutation
>;
export const createContact = /* GraphQL */ `mutation CreateContact(
  $input: CreateContactInput!
  $condition: ModelContactConditionInput
) {
  createContact(input: $input, condition: $condition) {
    id
    user_id
    contact_user_id
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    contact_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
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
    user_id
    contact_user_id
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    contact_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
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
    user_id
    contact_user_id
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    contact_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
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
    from_user_id
    to_user_id
    status
    created_at
    from_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    to_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
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
    from_user_id
    to_user_id
    status
    created_at
    from_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    to_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
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
    from_user_id
    to_user_id
    status
    created_at
    from_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    to_user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
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
    push_token
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
    message_reactions {
      nextToken
      __typename
    }
    story_reactions {
      nextToken
      __typename
    }
    Stories {
      nextToken
      __typename
    }
    StoryViews {
      nextToken
      __typename
    }
    sent_messages {
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
    push_token
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
    message_reactions {
      nextToken
      __typename
    }
    story_reactions {
      nextToken
      __typename
    }
    Stories {
      nextToken
      __typename
    }
    StoryViews {
      nextToken
      __typename
    }
    sent_messages {
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
    push_token
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
    message_reactions {
      nextToken
      __typename
    }
    story_reactions {
      nextToken
      __typename
    }
    Stories {
      nextToken
      __typename
    }
    StoryViews {
      nextToken
      __typename
    }
    sent_messages {
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
export const createUserGroupChat = /* GraphQL */ `mutation CreateUserGroupChat(
  $input: CreateUserGroupChatInput!
  $condition: ModelUserGroupChatConditionInput
) {
  createUserGroupChat(input: $input, condition: $condition) {
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
      push_token
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
` as GeneratedMutation<
  APITypes.CreateUserGroupChatMutationVariables,
  APITypes.CreateUserGroupChatMutation
>;
export const updateUserGroupChat = /* GraphQL */ `mutation UpdateUserGroupChat(
  $input: UpdateUserGroupChatInput!
  $condition: ModelUserGroupChatConditionInput
) {
  updateUserGroupChat(input: $input, condition: $condition) {
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
      push_token
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
` as GeneratedMutation<
  APITypes.UpdateUserGroupChatMutationVariables,
  APITypes.UpdateUserGroupChatMutation
>;
export const deleteUserGroupChat = /* GraphQL */ `mutation DeleteUserGroupChat(
  $input: DeleteUserGroupChatInput!
  $condition: ModelUserGroupChatConditionInput
) {
  deleteUserGroupChat(input: $input, condition: $condition) {
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
      push_token
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
` as GeneratedMutation<
  APITypes.DeleteUserGroupChatMutationVariables,
  APITypes.DeleteUserGroupChatMutation
>;
export const createUserFriendChat = /* GraphQL */ `mutation CreateUserFriendChat(
  $input: CreateUserFriendChatInput!
  $condition: ModelUserFriendChatConditionInput
) {
  createUserFriendChat(input: $input, condition: $condition) {
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
      push_token
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
` as GeneratedMutation<
  APITypes.CreateUserFriendChatMutationVariables,
  APITypes.CreateUserFriendChatMutation
>;
export const updateUserFriendChat = /* GraphQL */ `mutation UpdateUserFriendChat(
  $input: UpdateUserFriendChatInput!
  $condition: ModelUserFriendChatConditionInput
) {
  updateUserFriendChat(input: $input, condition: $condition) {
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
      push_token
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
` as GeneratedMutation<
  APITypes.UpdateUserFriendChatMutationVariables,
  APITypes.UpdateUserFriendChatMutation
>;
export const deleteUserFriendChat = /* GraphQL */ `mutation DeleteUserFriendChat(
  $input: DeleteUserFriendChatInput!
  $condition: ModelUserFriendChatConditionInput
) {
  deleteUserFriendChat(input: $input, condition: $condition) {
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
      push_token
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
` as GeneratedMutation<
  APITypes.DeleteUserFriendChatMutationVariables,
  APITypes.DeleteUserFriendChatMutation
>;
export const createMusic = /* GraphQL */ `mutation CreateMusic(
  $input: CreateMusicInput!
  $condition: ModelMusicConditionInput
) {
  createMusic(input: $input, condition: $condition) {
    id
    title
    artist
    url
    duration
    cover_image
    created_at
    Stories {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMusicMutationVariables,
  APITypes.CreateMusicMutation
>;
export const updateMusic = /* GraphQL */ `mutation UpdateMusic(
  $input: UpdateMusicInput!
  $condition: ModelMusicConditionInput
) {
  updateMusic(input: $input, condition: $condition) {
    id
    title
    artist
    url
    duration
    cover_image
    created_at
    Stories {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMusicMutationVariables,
  APITypes.UpdateMusicMutation
>;
export const deleteMusic = /* GraphQL */ `mutation DeleteMusic(
  $input: DeleteMusicInput!
  $condition: ModelMusicConditionInput
) {
  deleteMusic(input: $input, condition: $condition) {
    id
    title
    artist
    url
    duration
    cover_image
    created_at
    Stories {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMusicMutationVariables,
  APITypes.DeleteMusicMutation
>;
export const createStory = /* GraphQL */ `mutation CreateStory(
  $input: CreateStoryInput!
  $condition: ModelStoryConditionInput
) {
  createStory(input: $input, condition: $condition) {
    id
    user_id
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    type
    media_url
    text_content
    background_color
    thumbnail_url
    duration
    music_id
    music {
      id
      title
      artist
      url
      duration
      cover_image
      created_at
      createdAt
      updatedAt
      __typename
    }
    views {
      nextToken
      __typename
    }
    story_reactions {
      nextToken
      __typename
    }
    created_at
    expires_at
    music_start_time
    music_end_time
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateStoryMutationVariables,
  APITypes.CreateStoryMutation
>;
export const updateStory = /* GraphQL */ `mutation UpdateStory(
  $input: UpdateStoryInput!
  $condition: ModelStoryConditionInput
) {
  updateStory(input: $input, condition: $condition) {
    id
    user_id
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    type
    media_url
    text_content
    background_color
    thumbnail_url
    duration
    music_id
    music {
      id
      title
      artist
      url
      duration
      cover_image
      created_at
      createdAt
      updatedAt
      __typename
    }
    views {
      nextToken
      __typename
    }
    story_reactions {
      nextToken
      __typename
    }
    created_at
    expires_at
    music_start_time
    music_end_time
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateStoryMutationVariables,
  APITypes.UpdateStoryMutation
>;
export const deleteStory = /* GraphQL */ `mutation DeleteStory(
  $input: DeleteStoryInput!
  $condition: ModelStoryConditionInput
) {
  deleteStory(input: $input, condition: $condition) {
    id
    user_id
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    type
    media_url
    text_content
    background_color
    thumbnail_url
    duration
    music_id
    music {
      id
      title
      artist
      url
      duration
      cover_image
      created_at
      createdAt
      updatedAt
      __typename
    }
    views {
      nextToken
      __typename
    }
    story_reactions {
      nextToken
      __typename
    }
    created_at
    expires_at
    music_start_time
    music_end_time
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteStoryMutationVariables,
  APITypes.DeleteStoryMutation
>;
export const createStoryView = /* GraphQL */ `mutation CreateStoryView(
  $input: CreateStoryViewInput!
  $condition: ModelStoryViewConditionInput
) {
  createStoryView(input: $input, condition: $condition) {
    id
    story_id
    user_id
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    story {
      id
      user_id
      type
      media_url
      text_content
      background_color
      thumbnail_url
      duration
      music_id
      created_at
      expires_at
      music_start_time
      music_end_time
      createdAt
      updatedAt
      __typename
    }
    viewed_at
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateStoryViewMutationVariables,
  APITypes.CreateStoryViewMutation
>;
export const updateStoryView = /* GraphQL */ `mutation UpdateStoryView(
  $input: UpdateStoryViewInput!
  $condition: ModelStoryViewConditionInput
) {
  updateStoryView(input: $input, condition: $condition) {
    id
    story_id
    user_id
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    story {
      id
      user_id
      type
      media_url
      text_content
      background_color
      thumbnail_url
      duration
      music_id
      created_at
      expires_at
      music_start_time
      music_end_time
      createdAt
      updatedAt
      __typename
    }
    viewed_at
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateStoryViewMutationVariables,
  APITypes.UpdateStoryViewMutation
>;
export const deleteStoryView = /* GraphQL */ `mutation DeleteStoryView(
  $input: DeleteStoryViewInput!
  $condition: ModelStoryViewConditionInput
) {
  deleteStoryView(input: $input, condition: $condition) {
    id
    story_id
    user_id
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    story {
      id
      user_id
      type
      media_url
      text_content
      background_color
      thumbnail_url
      duration
      music_id
      created_at
      expires_at
      music_start_time
      music_end_time
      createdAt
      updatedAt
      __typename
    }
    viewed_at
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteStoryViewMutationVariables,
  APITypes.DeleteStoryViewMutation
>;
export const createStoryReaction = /* GraphQL */ `mutation CreateStoryReaction(
  $input: CreateStoryReactionInput!
  $condition: ModelStoryReactionConditionInput
) {
  createStoryReaction(input: $input, condition: $condition) {
    id
    story_id
    user_id
    icon
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    story {
      id
      user_id
      type
      media_url
      text_content
      background_color
      thumbnail_url
      duration
      music_id
      created_at
      expires_at
      music_start_time
      music_end_time
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateStoryReactionMutationVariables,
  APITypes.CreateStoryReactionMutation
>;
export const updateStoryReaction = /* GraphQL */ `mutation UpdateStoryReaction(
  $input: UpdateStoryReactionInput!
  $condition: ModelStoryReactionConditionInput
) {
  updateStoryReaction(input: $input, condition: $condition) {
    id
    story_id
    user_id
    icon
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    story {
      id
      user_id
      type
      media_url
      text_content
      background_color
      thumbnail_url
      duration
      music_id
      created_at
      expires_at
      music_start_time
      music_end_time
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateStoryReactionMutationVariables,
  APITypes.UpdateStoryReactionMutation
>;
export const deleteStoryReaction = /* GraphQL */ `mutation DeleteStoryReaction(
  $input: DeleteStoryReactionInput!
  $condition: ModelStoryReactionConditionInput
) {
  deleteStoryReaction(input: $input, condition: $condition) {
    id
    story_id
    user_id
    icon
    created_at
    user {
      id
      name
      email
      password
      profile_picture
      status
      last_seen
      push_token
      createdAt
      updatedAt
      __typename
    }
    story {
      id
      user_id
      type
      media_url
      text_content
      background_color
      thumbnail_url
      duration
      music_id
      created_at
      expires_at
      music_start_time
      music_end_time
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteStoryReactionMutationVariables,
  APITypes.DeleteStoryReactionMutation
>;
