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
    messages {
      nextToken
      __typename
    }
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
    messages {
      nextToken
      __typename
    }
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
    messages {
      nextToken
      __typename
    }
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
    messages {
      nextToken
      __typename
    }
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
    messages {
      nextToken
      __typename
    }
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
    messages {
      nextToken
      __typename
    }
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
      story_id
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
    story_id
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
      story_id
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
    story_id
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
      story_id
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
    story_id
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
` as GeneratedSubscription<
  APITypes.OnDeleteMessagesSubscriptionVariables,
  APITypes.OnDeleteMessagesSubscription
>;
export const onCreateMessageReaction = /* GraphQL */ `subscription OnCreateMessageReaction(
  $filter: ModelSubscriptionMessageReactionFilterInput
) {
  onCreateMessageReaction(filter: $filter) {
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
      story_id
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
  APITypes.OnCreateMessageReactionSubscriptionVariables,
  APITypes.OnCreateMessageReactionSubscription
>;
export const onUpdateMessageReaction = /* GraphQL */ `subscription OnUpdateMessageReaction(
  $filter: ModelSubscriptionMessageReactionFilterInput
) {
  onUpdateMessageReaction(filter: $filter) {
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
      story_id
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
  APITypes.OnUpdateMessageReactionSubscriptionVariables,
  APITypes.OnUpdateMessageReactionSubscription
>;
export const onDeleteMessageReaction = /* GraphQL */ `subscription OnDeleteMessageReaction(
  $filter: ModelSubscriptionMessageReactionFilterInput
) {
  onDeleteMessageReaction(filter: $filter) {
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
      story_id
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
  APITypes.OnDeleteMessageReactionSubscriptionVariables,
  APITypes.OnDeleteMessageReactionSubscription
>;
export const onCreateContact = /* GraphQL */ `subscription OnCreateContact($filter: ModelSubscriptionContactFilterInput) {
  onCreateContact(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserFriendChatSubscriptionVariables,
  APITypes.OnDeleteUserFriendChatSubscription
>;
export const onCreateMusic = /* GraphQL */ `subscription OnCreateMusic($filter: ModelSubscriptionMusicFilterInput) {
  onCreateMusic(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMusicSubscriptionVariables,
  APITypes.OnCreateMusicSubscription
>;
export const onUpdateMusic = /* GraphQL */ `subscription OnUpdateMusic($filter: ModelSubscriptionMusicFilterInput) {
  onUpdateMusic(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMusicSubscriptionVariables,
  APITypes.OnUpdateMusicSubscription
>;
export const onDeleteMusic = /* GraphQL */ `subscription OnDeleteMusic($filter: ModelSubscriptionMusicFilterInput) {
  onDeleteMusic(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMusicSubscriptionVariables,
  APITypes.OnDeleteMusicSubscription
>;
export const onCreateStory = /* GraphQL */ `subscription OnCreateStory($filter: ModelSubscriptionStoryFilterInput) {
  onCreateStory(filter: $filter) {
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
    replies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateStorySubscriptionVariables,
  APITypes.OnCreateStorySubscription
>;
export const onUpdateStory = /* GraphQL */ `subscription OnUpdateStory($filter: ModelSubscriptionStoryFilterInput) {
  onUpdateStory(filter: $filter) {
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
    replies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateStorySubscriptionVariables,
  APITypes.OnUpdateStorySubscription
>;
export const onDeleteStory = /* GraphQL */ `subscription OnDeleteStory($filter: ModelSubscriptionStoryFilterInput) {
  onDeleteStory(filter: $filter) {
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
    replies {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteStorySubscriptionVariables,
  APITypes.OnDeleteStorySubscription
>;
export const onCreateStoryView = /* GraphQL */ `subscription OnCreateStoryView($filter: ModelSubscriptionStoryViewFilterInput) {
  onCreateStoryView(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateStoryViewSubscriptionVariables,
  APITypes.OnCreateStoryViewSubscription
>;
export const onUpdateStoryView = /* GraphQL */ `subscription OnUpdateStoryView($filter: ModelSubscriptionStoryViewFilterInput) {
  onUpdateStoryView(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateStoryViewSubscriptionVariables,
  APITypes.OnUpdateStoryViewSubscription
>;
export const onDeleteStoryView = /* GraphQL */ `subscription OnDeleteStoryView($filter: ModelSubscriptionStoryViewFilterInput) {
  onDeleteStoryView(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteStoryViewSubscriptionVariables,
  APITypes.OnDeleteStoryViewSubscription
>;
export const onCreateStoryReaction = /* GraphQL */ `subscription OnCreateStoryReaction(
  $filter: ModelSubscriptionStoryReactionFilterInput
) {
  onCreateStoryReaction(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateStoryReactionSubscriptionVariables,
  APITypes.OnCreateStoryReactionSubscription
>;
export const onUpdateStoryReaction = /* GraphQL */ `subscription OnUpdateStoryReaction(
  $filter: ModelSubscriptionStoryReactionFilterInput
) {
  onUpdateStoryReaction(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateStoryReactionSubscriptionVariables,
  APITypes.OnUpdateStoryReactionSubscription
>;
export const onDeleteStoryReaction = /* GraphQL */ `subscription OnDeleteStoryReaction(
  $filter: ModelSubscriptionStoryReactionFilterInput
) {
  onDeleteStoryReaction(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteStoryReactionSubscriptionVariables,
  APITypes.OnDeleteStoryReactionSubscription
>;
