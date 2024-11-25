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
      created_at
      last_message
      updated_at
      group_picture
      description
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
export const groupChatsByCreated_by = /* GraphQL */ `query GroupChatsByCreated_by(
  $created_by: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelGroupChatFilterInput
  $limit: Int
  $nextToken: String
) {
  groupChatsByCreated_by(
    created_by: $created_by
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GroupChatsByCreated_byQueryVariables,
  APITypes.GroupChatsByCreated_byQuery
>;
export const getFriendChat = /* GraphQL */ `query GetFriendChat($id: ID!) {
  getFriendChat(id: $id) {
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
      created_at
      last_message
      updated_at
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
export const getMessages = /* GraphQL */ `query GetMessages($id: ID!) {
  getMessages(id: $id) {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const messagesByChat_idAndTimestamp = /* GraphQL */ `query MessagesByChat_idAndTimestamp(
  $chat_id: ID!
  $timestamp: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMessagesFilterInput
  $limit: Int
  $nextToken: String
) {
  messagesByChat_idAndTimestamp(
    chat_id: $chat_id
    timestamp: $timestamp
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessagesByChat_idAndTimestampQueryVariables,
  APITypes.MessagesByChat_idAndTimestampQuery
>;
export const messagesBySender_id = /* GraphQL */ `query MessagesBySender_id(
  $sender_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMessagesFilterInput
  $limit: Int
  $nextToken: String
) {
  messagesBySender_id(
    sender_id: $sender_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessagesBySender_idQueryVariables,
  APITypes.MessagesBySender_idQuery
>;
export const messagesByReply_to_message_id = /* GraphQL */ `query MessagesByReply_to_message_id(
  $reply_to_message_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMessagesFilterInput
  $limit: Int
  $nextToken: String
) {
  messagesByReply_to_message_id(
    reply_to_message_id: $reply_to_message_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessagesByReply_to_message_idQueryVariables,
  APITypes.MessagesByReply_to_message_idQuery
>;
export const getMessageReaction = /* GraphQL */ `query GetMessageReaction($id: ID!) {
  getMessageReaction(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMessageReactionQueryVariables,
  APITypes.GetMessageReactionQuery
>;
export const listMessageReactions = /* GraphQL */ `query ListMessageReactions(
  $filter: ModelMessageReactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessageReactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      message_id
      user_id
      icon
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessageReactionsQueryVariables,
  APITypes.ListMessageReactionsQuery
>;
export const messageReactionsByMessage_id = /* GraphQL */ `query MessageReactionsByMessage_id(
  $message_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMessageReactionFilterInput
  $limit: Int
  $nextToken: String
) {
  messageReactionsByMessage_id(
    message_id: $message_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      message_id
      user_id
      icon
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessageReactionsByMessage_idQueryVariables,
  APITypes.MessageReactionsByMessage_idQuery
>;
export const messageReactionsByUser_id = /* GraphQL */ `query MessageReactionsByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMessageReactionFilterInput
  $limit: Int
  $nextToken: String
) {
  messageReactionsByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      message_id
      user_id
      icon
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessageReactionsByUser_idQueryVariables,
  APITypes.MessageReactionsByUser_idQuery
>;
export const getContact = /* GraphQL */ `query GetContact($id: ID!) {
  getContact(id: $id) {
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
      user_id
      contact_user_id
      created_at
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
export const contactsByUser_id = /* GraphQL */ `query ContactsByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelContactFilterInput
  $limit: Int
  $nextToken: String
) {
  contactsByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user_id
      contact_user_id
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ContactsByUser_idQueryVariables,
  APITypes.ContactsByUser_idQuery
>;
export const contactsByContact_user_id = /* GraphQL */ `query ContactsByContact_user_id(
  $contact_user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelContactFilterInput
  $limit: Int
  $nextToken: String
) {
  contactsByContact_user_id(
    contact_user_id: $contact_user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user_id
      contact_user_id
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ContactsByContact_user_idQueryVariables,
  APITypes.ContactsByContact_user_idQuery
>;
export const getFriendRequests = /* GraphQL */ `query GetFriendRequests($id: ID!) {
  getFriendRequests(id: $id) {
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
      from_user_id
      to_user_id
      status
      created_at
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
export const friendRequestsByFrom_user_id = /* GraphQL */ `query FriendRequestsByFrom_user_id(
  $from_user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFriendRequestsFilterInput
  $limit: Int
  $nextToken: String
) {
  friendRequestsByFrom_user_id(
    from_user_id: $from_user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      from_user_id
      to_user_id
      status
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FriendRequestsByFrom_user_idQueryVariables,
  APITypes.FriendRequestsByFrom_user_idQuery
>;
export const friendRequestsByTo_user_id = /* GraphQL */ `query FriendRequestsByTo_user_id(
  $to_user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFriendRequestsFilterInput
  $limit: Int
  $nextToken: String
) {
  friendRequestsByTo_user_id(
    to_user_id: $to_user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      from_user_id
      to_user_id
      status
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FriendRequestsByTo_user_idQueryVariables,
  APITypes.FriendRequestsByTo_user_idQuery
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
      push_token
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const usersByEmail = /* GraphQL */ `query UsersByEmail(
  $email: String!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByEmail(
    email: $email
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByEmailQueryVariables,
  APITypes.UsersByEmailQuery
>;
export const getUserGroupChat = /* GraphQL */ `query GetUserGroupChat($id: ID!) {
  getUserGroupChat(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserGroupChatQueryVariables,
  APITypes.GetUserGroupChatQuery
>;
export const listUserGroupChats = /* GraphQL */ `query ListUserGroupChats(
  $filter: ModelUserGroupChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserGroupChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      user_id
      group_chat_id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserGroupChatsQueryVariables,
  APITypes.ListUserGroupChatsQuery
>;
export const userGroupChatsByUser_id = /* GraphQL */ `query UserGroupChatsByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserGroupChatFilterInput
  $limit: Int
  $nextToken: String
) {
  userGroupChatsByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user_id
      group_chat_id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserGroupChatsByUser_idQueryVariables,
  APITypes.UserGroupChatsByUser_idQuery
>;
export const userGroupChatsByGroup_chat_id = /* GraphQL */ `query UserGroupChatsByGroup_chat_id(
  $group_chat_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserGroupChatFilterInput
  $limit: Int
  $nextToken: String
) {
  userGroupChatsByGroup_chat_id(
    group_chat_id: $group_chat_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user_id
      group_chat_id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserGroupChatsByGroup_chat_idQueryVariables,
  APITypes.UserGroupChatsByGroup_chat_idQuery
>;
export const getUserFriendChat = /* GraphQL */ `query GetUserFriendChat($id: ID!) {
  getUserFriendChat(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserFriendChatQueryVariables,
  APITypes.GetUserFriendChatQuery
>;
export const listUserFriendChats = /* GraphQL */ `query ListUserFriendChats(
  $filter: ModelUserFriendChatFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserFriendChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      user_id
      friend_chat_id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserFriendChatsQueryVariables,
  APITypes.ListUserFriendChatsQuery
>;
export const userFriendChatsByUser_id = /* GraphQL */ `query UserFriendChatsByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFriendChatFilterInput
  $limit: Int
  $nextToken: String
) {
  userFriendChatsByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user_id
      friend_chat_id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserFriendChatsByUser_idQueryVariables,
  APITypes.UserFriendChatsByUser_idQuery
>;
export const userFriendChatsByFriend_chat_id = /* GraphQL */ `query UserFriendChatsByFriend_chat_id(
  $friend_chat_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFriendChatFilterInput
  $limit: Int
  $nextToken: String
) {
  userFriendChatsByFriend_chat_id(
    friend_chat_id: $friend_chat_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      user_id
      friend_chat_id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserFriendChatsByFriend_chat_idQueryVariables,
  APITypes.UserFriendChatsByFriend_chat_idQuery
>;
export const getMusic = /* GraphQL */ `query GetMusic($id: ID!) {
  getMusic(id: $id) {
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
` as GeneratedQuery<APITypes.GetMusicQueryVariables, APITypes.GetMusicQuery>;
export const listMusic = /* GraphQL */ `query ListMusic(
  $filter: ModelMusicFilterInput
  $limit: Int
  $nextToken: String
) {
  listMusic(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListMusicQueryVariables, APITypes.ListMusicQuery>;
export const getStory = /* GraphQL */ `query GetStory($id: ID!) {
  getStory(id: $id) {
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
` as GeneratedQuery<APITypes.GetStoryQueryVariables, APITypes.GetStoryQuery>;
export const listStories = /* GraphQL */ `query ListStories(
  $filter: ModelStoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listStories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStoriesQueryVariables,
  APITypes.ListStoriesQuery
>;
export const storiesByUser_id = /* GraphQL */ `query StoriesByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelStoryFilterInput
  $limit: Int
  $nextToken: String
) {
  storiesByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.StoriesByUser_idQueryVariables,
  APITypes.StoriesByUser_idQuery
>;
export const storiesByMusic_id = /* GraphQL */ `query StoriesByMusic_id(
  $music_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelStoryFilterInput
  $limit: Int
  $nextToken: String
) {
  storiesByMusic_id(
    music_id: $music_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.StoriesByMusic_idQueryVariables,
  APITypes.StoriesByMusic_idQuery
>;
export const getStoryView = /* GraphQL */ `query GetStoryView($id: ID!) {
  getStoryView(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetStoryViewQueryVariables,
  APITypes.GetStoryViewQuery
>;
export const listStoryViews = /* GraphQL */ `query ListStoryViews(
  $filter: ModelStoryViewFilterInput
  $limit: Int
  $nextToken: String
) {
  listStoryViews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      story_id
      user_id
      viewed_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStoryViewsQueryVariables,
  APITypes.ListStoryViewsQuery
>;
export const storyViewsByStory_id = /* GraphQL */ `query StoryViewsByStory_id(
  $story_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelStoryViewFilterInput
  $limit: Int
  $nextToken: String
) {
  storyViewsByStory_id(
    story_id: $story_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      story_id
      user_id
      viewed_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.StoryViewsByStory_idQueryVariables,
  APITypes.StoryViewsByStory_idQuery
>;
export const storyViewsByUser_id = /* GraphQL */ `query StoryViewsByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelStoryViewFilterInput
  $limit: Int
  $nextToken: String
) {
  storyViewsByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      story_id
      user_id
      viewed_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.StoryViewsByUser_idQueryVariables,
  APITypes.StoryViewsByUser_idQuery
>;
export const getStoryReaction = /* GraphQL */ `query GetStoryReaction($id: ID!) {
  getStoryReaction(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetStoryReactionQueryVariables,
  APITypes.GetStoryReactionQuery
>;
export const listStoryReactions = /* GraphQL */ `query ListStoryReactions(
  $filter: ModelStoryReactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listStoryReactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      story_id
      user_id
      icon
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStoryReactionsQueryVariables,
  APITypes.ListStoryReactionsQuery
>;
export const storyReactionsByStory_id = /* GraphQL */ `query StoryReactionsByStory_id(
  $story_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelStoryReactionFilterInput
  $limit: Int
  $nextToken: String
) {
  storyReactionsByStory_id(
    story_id: $story_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      story_id
      user_id
      icon
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.StoryReactionsByStory_idQueryVariables,
  APITypes.StoryReactionsByStory_idQuery
>;
export const storyReactionsByUser_id = /* GraphQL */ `query StoryReactionsByUser_id(
  $user_id: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelStoryReactionFilterInput
  $limit: Int
  $nextToken: String
) {
  storyReactionsByUser_id(
    user_id: $user_id
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      story_id
      user_id
      icon
      created_at
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.StoryReactionsByUser_idQueryVariables,
  APITypes.StoryReactionsByUser_idQuery
>;
