/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGroupChatInput = {
  id?: string | null,
  group_name?: string | null,
  created_by: string,
  created_at?: string | null,
  last_message?: string | null,
  updated_at?: string | null,
  group_picture?: string | null,
  description?: string | null,
};

export type ModelGroupChatConditionInput = {
  group_name?: ModelStringInput | null,
  created_by?: ModelIDInput | null,
  created_at?: ModelStringInput | null,
  last_message?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  group_picture?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelGroupChatConditionInput | null > | null,
  or?: Array< ModelGroupChatConditionInput | null > | null,
  not?: ModelGroupChatConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type GroupChat = {
  __typename: "GroupChat",
  id: string,
  group_name?: string | null,
  created_by: string,
  members?: ModelUserGroupChatConnection | null,
  created_at?: string | null,
  last_message?: string | null,
  updated_at?: string | null,
  group_picture?: string | null,
  description?: string | null,
  messages?: ModelMessagesConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserGroupChatConnection = {
  __typename: "ModelUserGroupChatConnection",
  items:  Array<UserGroupChat | null >,
  nextToken?: string | null,
};

export type UserGroupChat = {
  __typename: "UserGroupChat",
  id: string,
  user_id: string,
  group_chat_id: string,
  user?: User | null,
  groupChat?: GroupChat | null,
  createdAt: string,
  updatedAt: string,
};

export type User = {
  __typename: "User",
  id: string,
  name?: string | null,
  email: string,
  password: string,
  profile_picture?: string | null,
  status?: string | null,
  last_seen?: string | null,
  push_token?: string | null,
  FriendChats?: ModelUserFriendChatConnection | null,
  GroupChats?: ModelUserGroupChatConnection | null,
  Contacts?: ModelContactConnection | null,
  SentFriendRequests?: ModelFriendRequestsConnection | null,
  ReceivedFriendRequests?: ModelFriendRequestsConnection | null,
  message_reactions?: ModelMessageReactionConnection | null,
  story_reactions?: ModelStoryReactionConnection | null,
  Stories?: ModelStoryConnection | null,
  StoryViews?: ModelStoryViewConnection | null,
  sent_messages?: ModelMessagesConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserFriendChatConnection = {
  __typename: "ModelUserFriendChatConnection",
  items:  Array<UserFriendChat | null >,
  nextToken?: string | null,
};

export type UserFriendChat = {
  __typename: "UserFriendChat",
  id: string,
  user_id: string,
  friend_chat_id: string,
  user?: User | null,
  friendChat?: FriendChat | null,
  createdAt: string,
  updatedAt: string,
};

export type FriendChat = {
  __typename: "FriendChat",
  id: string,
  chat_id?: string | null,
  users?: ModelUserFriendChatConnection | null,
  created_at?: string | null,
  last_message?: string | null,
  updated_at?: string | null,
  messages?: ModelMessagesConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMessagesConnection = {
  __typename: "ModelMessagesConnection",
  items:  Array<Messages | null >,
  nextToken?: string | null,
};

export type Messages = {
  __typename: "Messages",
  id: string,
  chat_type?: string | null,
  chat_id: string,
  sender_id: string,
  content?: string | null,
  timestamp?: string | null,
  status?: string | null,
  attachments?: string | null,
  message_reactions?: ModelMessageReactionConnection | null,
  sender?: User | null,
  reply_to_message_id?: string | null,
  reply_to_message?: Messages | null,
  replied_messages?: ModelMessagesConnection | null,
  group_chat?: GroupChat | null,
  friend_chat?: FriendChat | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMessageReactionConnection = {
  __typename: "ModelMessageReactionConnection",
  items:  Array<MessageReaction | null >,
  nextToken?: string | null,
};

export type MessageReaction = {
  __typename: "MessageReaction",
  id: string,
  message_id: string,
  user_id: string,
  icon?: string | null,
  created_at?: string | null,
  user?: User | null,
  message?: Messages | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelContactConnection = {
  __typename: "ModelContactConnection",
  items:  Array<Contact | null >,
  nextToken?: string | null,
};

export type Contact = {
  __typename: "Contact",
  id: string,
  user_id: string,
  contact_user_id: string,
  created_at?: string | null,
  user?: User | null,
  contact_user?: User | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelFriendRequestsConnection = {
  __typename: "ModelFriendRequestsConnection",
  items:  Array<FriendRequests | null >,
  nextToken?: string | null,
};

export type FriendRequests = {
  __typename: "FriendRequests",
  id: string,
  from_user_id: string,
  to_user_id: string,
  status?: string | null,
  created_at?: string | null,
  from_user?: User | null,
  to_user?: User | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelStoryReactionConnection = {
  __typename: "ModelStoryReactionConnection",
  items:  Array<StoryReaction | null >,
  nextToken?: string | null,
};

export type StoryReaction = {
  __typename: "StoryReaction",
  id: string,
  story_id: string,
  user_id: string,
  icon?: string | null,
  created_at?: string | null,
  user?: User | null,
  story?: Story | null,
  createdAt: string,
  updatedAt: string,
};

export type Story = {
  __typename: "Story",
  id: string,
  user_id: string,
  user?: User | null,
  type: string,
  media_url?: string | null,
  text_content?: string | null,
  background_color?: string | null,
  thumbnail_url?: string | null,
  duration?: number | null,
  music_id?: string | null,
  music?: Music | null,
  views?: ModelStoryViewConnection | null,
  story_reactions?: ModelStoryReactionConnection | null,
  created_at?: string | null,
  expires_at?: string | null,
  music_start_time?: number | null,
  music_end_time?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type Music = {
  __typename: "Music",
  id: string,
  title: string,
  artist?: string | null,
  url: string,
  duration?: number | null,
  cover_image?: string | null,
  created_at?: string | null,
  Stories?: ModelStoryConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelStoryConnection = {
  __typename: "ModelStoryConnection",
  items:  Array<Story | null >,
  nextToken?: string | null,
};

export type ModelStoryViewConnection = {
  __typename: "ModelStoryViewConnection",
  items:  Array<StoryView | null >,
  nextToken?: string | null,
};

export type StoryView = {
  __typename: "StoryView",
  id: string,
  story_id: string,
  user_id: string,
  user?: User | null,
  story?: Story | null,
  viewed_at?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateGroupChatInput = {
  id: string,
  group_name?: string | null,
  created_by?: string | null,
  created_at?: string | null,
  last_message?: string | null,
  updated_at?: string | null,
  group_picture?: string | null,
  description?: string | null,
};

export type DeleteGroupChatInput = {
  id: string,
};

export type CreateFriendChatInput = {
  id?: string | null,
  chat_id?: string | null,
  created_at?: string | null,
  last_message?: string | null,
  updated_at?: string | null,
};

export type ModelFriendChatConditionInput = {
  chat_id?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  last_message?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  and?: Array< ModelFriendChatConditionInput | null > | null,
  or?: Array< ModelFriendChatConditionInput | null > | null,
  not?: ModelFriendChatConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateFriendChatInput = {
  id: string,
  chat_id?: string | null,
  created_at?: string | null,
  last_message?: string | null,
  updated_at?: string | null,
};

export type DeleteFriendChatInput = {
  id: string,
};

export type CreateMessagesInput = {
  id?: string | null,
  chat_type?: string | null,
  chat_id: string,
  sender_id: string,
  content?: string | null,
  timestamp?: string | null,
  status?: string | null,
  attachments?: string | null,
  reply_to_message_id?: string | null,
};

export type ModelMessagesConditionInput = {
  chat_type?: ModelStringInput | null,
  chat_id?: ModelIDInput | null,
  sender_id?: ModelIDInput | null,
  content?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  status?: ModelStringInput | null,
  attachments?: ModelStringInput | null,
  reply_to_message_id?: ModelIDInput | null,
  and?: Array< ModelMessagesConditionInput | null > | null,
  or?: Array< ModelMessagesConditionInput | null > | null,
  not?: ModelMessagesConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateMessagesInput = {
  id: string,
  chat_type?: string | null,
  chat_id?: string | null,
  sender_id?: string | null,
  content?: string | null,
  timestamp?: string | null,
  status?: string | null,
  attachments?: string | null,
  reply_to_message_id?: string | null,
};

export type DeleteMessagesInput = {
  id: string,
};

export type CreateMessageReactionInput = {
  id?: string | null,
  message_id: string,
  user_id: string,
  icon?: string | null,
  created_at?: string | null,
};

export type ModelMessageReactionConditionInput = {
  message_id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  icon?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  and?: Array< ModelMessageReactionConditionInput | null > | null,
  or?: Array< ModelMessageReactionConditionInput | null > | null,
  not?: ModelMessageReactionConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateMessageReactionInput = {
  id: string,
  message_id?: string | null,
  user_id?: string | null,
  icon?: string | null,
  created_at?: string | null,
};

export type DeleteMessageReactionInput = {
  id: string,
};

export type CreateContactInput = {
  id?: string | null,
  user_id: string,
  contact_user_id: string,
  created_at?: string | null,
};

export type ModelContactConditionInput = {
  user_id?: ModelIDInput | null,
  contact_user_id?: ModelIDInput | null,
  created_at?: ModelStringInput | null,
  and?: Array< ModelContactConditionInput | null > | null,
  or?: Array< ModelContactConditionInput | null > | null,
  not?: ModelContactConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateContactInput = {
  id: string,
  user_id?: string | null,
  contact_user_id?: string | null,
  created_at?: string | null,
};

export type DeleteContactInput = {
  id: string,
};

export type CreateFriendRequestsInput = {
  id?: string | null,
  from_user_id: string,
  to_user_id: string,
  status?: string | null,
  created_at?: string | null,
};

export type ModelFriendRequestsConditionInput = {
  from_user_id?: ModelIDInput | null,
  to_user_id?: ModelIDInput | null,
  status?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  and?: Array< ModelFriendRequestsConditionInput | null > | null,
  or?: Array< ModelFriendRequestsConditionInput | null > | null,
  not?: ModelFriendRequestsConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateFriendRequestsInput = {
  id: string,
  from_user_id?: string | null,
  to_user_id?: string | null,
  status?: string | null,
  created_at?: string | null,
};

export type DeleteFriendRequestsInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  name?: string | null,
  email: string,
  password: string,
  profile_picture?: string | null,
  status?: string | null,
  last_seen?: string | null,
  push_token?: string | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  password?: ModelStringInput | null,
  profile_picture?: ModelStringInput | null,
  status?: ModelStringInput | null,
  last_seen?: ModelStringInput | null,
  push_token?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  email?: string | null,
  password?: string | null,
  profile_picture?: string | null,
  status?: string | null,
  last_seen?: string | null,
  push_token?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateUserGroupChatInput = {
  id?: string | null,
  user_id: string,
  group_chat_id: string,
};

export type ModelUserGroupChatConditionInput = {
  user_id?: ModelIDInput | null,
  group_chat_id?: ModelIDInput | null,
  and?: Array< ModelUserGroupChatConditionInput | null > | null,
  or?: Array< ModelUserGroupChatConditionInput | null > | null,
  not?: ModelUserGroupChatConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateUserGroupChatInput = {
  id: string,
  user_id?: string | null,
  group_chat_id?: string | null,
};

export type DeleteUserGroupChatInput = {
  id: string,
};

export type CreateUserFriendChatInput = {
  id?: string | null,
  user_id: string,
  friend_chat_id: string,
};

export type ModelUserFriendChatConditionInput = {
  user_id?: ModelIDInput | null,
  friend_chat_id?: ModelIDInput | null,
  and?: Array< ModelUserFriendChatConditionInput | null > | null,
  or?: Array< ModelUserFriendChatConditionInput | null > | null,
  not?: ModelUserFriendChatConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateUserFriendChatInput = {
  id: string,
  user_id?: string | null,
  friend_chat_id?: string | null,
};

export type DeleteUserFriendChatInput = {
  id: string,
};

export type CreateMusicInput = {
  id?: string | null,
  title: string,
  artist?: string | null,
  url: string,
  duration?: number | null,
  cover_image?: string | null,
  created_at?: string | null,
};

export type ModelMusicConditionInput = {
  title?: ModelStringInput | null,
  artist?: ModelStringInput | null,
  url?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  cover_image?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  and?: Array< ModelMusicConditionInput | null > | null,
  or?: Array< ModelMusicConditionInput | null > | null,
  not?: ModelMusicConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateMusicInput = {
  id: string,
  title?: string | null,
  artist?: string | null,
  url?: string | null,
  duration?: number | null,
  cover_image?: string | null,
  created_at?: string | null,
};

export type DeleteMusicInput = {
  id: string,
};

export type CreateStoryInput = {
  id?: string | null,
  user_id: string,
  type: string,
  media_url?: string | null,
  text_content?: string | null,
  background_color?: string | null,
  thumbnail_url?: string | null,
  duration?: number | null,
  music_id?: string | null,
  created_at?: string | null,
  expires_at?: string | null,
  music_start_time?: number | null,
  music_end_time?: number | null,
};

export type ModelStoryConditionInput = {
  user_id?: ModelIDInput | null,
  type?: ModelStringInput | null,
  media_url?: ModelStringInput | null,
  text_content?: ModelStringInput | null,
  background_color?: ModelStringInput | null,
  thumbnail_url?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  music_id?: ModelIDInput | null,
  created_at?: ModelStringInput | null,
  expires_at?: ModelStringInput | null,
  music_start_time?: ModelFloatInput | null,
  music_end_time?: ModelFloatInput | null,
  and?: Array< ModelStoryConditionInput | null > | null,
  or?: Array< ModelStoryConditionInput | null > | null,
  not?: ModelStoryConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateStoryInput = {
  id: string,
  user_id?: string | null,
  type?: string | null,
  media_url?: string | null,
  text_content?: string | null,
  background_color?: string | null,
  thumbnail_url?: string | null,
  duration?: number | null,
  music_id?: string | null,
  created_at?: string | null,
  expires_at?: string | null,
  music_start_time?: number | null,
  music_end_time?: number | null,
};

export type DeleteStoryInput = {
  id: string,
};

export type CreateStoryViewInput = {
  id?: string | null,
  story_id: string,
  user_id: string,
  viewed_at?: string | null,
};

export type ModelStoryViewConditionInput = {
  story_id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  viewed_at?: ModelStringInput | null,
  and?: Array< ModelStoryViewConditionInput | null > | null,
  or?: Array< ModelStoryViewConditionInput | null > | null,
  not?: ModelStoryViewConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateStoryViewInput = {
  id: string,
  story_id?: string | null,
  user_id?: string | null,
  viewed_at?: string | null,
};

export type DeleteStoryViewInput = {
  id: string,
};

export type CreateStoryReactionInput = {
  id?: string | null,
  story_id: string,
  user_id: string,
  icon?: string | null,
  created_at?: string | null,
};

export type ModelStoryReactionConditionInput = {
  story_id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  icon?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  and?: Array< ModelStoryReactionConditionInput | null > | null,
  or?: Array< ModelStoryReactionConditionInput | null > | null,
  not?: ModelStoryReactionConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateStoryReactionInput = {
  id: string,
  story_id?: string | null,
  user_id?: string | null,
  icon?: string | null,
  created_at?: string | null,
};

export type DeleteStoryReactionInput = {
  id: string,
};

export type ModelGroupChatFilterInput = {
  id?: ModelIDInput | null,
  group_name?: ModelStringInput | null,
  created_by?: ModelIDInput | null,
  created_at?: ModelStringInput | null,
  last_message?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  group_picture?: ModelStringInput | null,
  description?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGroupChatFilterInput | null > | null,
  or?: Array< ModelGroupChatFilterInput | null > | null,
  not?: ModelGroupChatFilterInput | null,
};

export type ModelGroupChatConnection = {
  __typename: "ModelGroupChatConnection",
  items:  Array<GroupChat | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFriendChatFilterInput = {
  id?: ModelIDInput | null,
  chat_id?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  last_message?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFriendChatFilterInput | null > | null,
  or?: Array< ModelFriendChatFilterInput | null > | null,
  not?: ModelFriendChatFilterInput | null,
};

export type ModelFriendChatConnection = {
  __typename: "ModelFriendChatConnection",
  items:  Array<FriendChat | null >,
  nextToken?: string | null,
};

export type ModelMessagesFilterInput = {
  id?: ModelIDInput | null,
  chat_type?: ModelStringInput | null,
  chat_id?: ModelIDInput | null,
  sender_id?: ModelIDInput | null,
  content?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  status?: ModelStringInput | null,
  attachments?: ModelStringInput | null,
  reply_to_message_id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessagesFilterInput | null > | null,
  or?: Array< ModelMessagesFilterInput | null > | null,
  not?: ModelMessagesFilterInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelMessageReactionFilterInput = {
  id?: ModelIDInput | null,
  message_id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  icon?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessageReactionFilterInput | null > | null,
  or?: Array< ModelMessageReactionFilterInput | null > | null,
  not?: ModelMessageReactionFilterInput | null,
};

export type ModelContactFilterInput = {
  id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  contact_user_id?: ModelIDInput | null,
  created_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContactFilterInput | null > | null,
  or?: Array< ModelContactFilterInput | null > | null,
  not?: ModelContactFilterInput | null,
};

export type ModelFriendRequestsFilterInput = {
  id?: ModelIDInput | null,
  from_user_id?: ModelIDInput | null,
  to_user_id?: ModelIDInput | null,
  status?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFriendRequestsFilterInput | null > | null,
  or?: Array< ModelFriendRequestsFilterInput | null > | null,
  not?: ModelFriendRequestsFilterInput | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  password?: ModelStringInput | null,
  profile_picture?: ModelStringInput | null,
  status?: ModelStringInput | null,
  last_seen?: ModelStringInput | null,
  push_token?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelUserGroupChatFilterInput = {
  id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  group_chat_id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserGroupChatFilterInput | null > | null,
  or?: Array< ModelUserGroupChatFilterInput | null > | null,
  not?: ModelUserGroupChatFilterInput | null,
};

export type ModelUserFriendChatFilterInput = {
  id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  friend_chat_id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFriendChatFilterInput | null > | null,
  or?: Array< ModelUserFriendChatFilterInput | null > | null,
  not?: ModelUserFriendChatFilterInput | null,
};

export type ModelMusicFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  artist?: ModelStringInput | null,
  url?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  cover_image?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMusicFilterInput | null > | null,
  or?: Array< ModelMusicFilterInput | null > | null,
  not?: ModelMusicFilterInput | null,
};

export type ModelMusicConnection = {
  __typename: "ModelMusicConnection",
  items:  Array<Music | null >,
  nextToken?: string | null,
};

export type ModelStoryFilterInput = {
  id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  type?: ModelStringInput | null,
  media_url?: ModelStringInput | null,
  text_content?: ModelStringInput | null,
  background_color?: ModelStringInput | null,
  thumbnail_url?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  music_id?: ModelIDInput | null,
  created_at?: ModelStringInput | null,
  expires_at?: ModelStringInput | null,
  music_start_time?: ModelFloatInput | null,
  music_end_time?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelStoryFilterInput | null > | null,
  or?: Array< ModelStoryFilterInput | null > | null,
  not?: ModelStoryFilterInput | null,
};

export type ModelStoryViewFilterInput = {
  id?: ModelIDInput | null,
  story_id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  viewed_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelStoryViewFilterInput | null > | null,
  or?: Array< ModelStoryViewFilterInput | null > | null,
  not?: ModelStoryViewFilterInput | null,
};

export type ModelStoryReactionFilterInput = {
  id?: ModelIDInput | null,
  story_id?: ModelIDInput | null,
  user_id?: ModelIDInput | null,
  icon?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelStoryReactionFilterInput | null > | null,
  or?: Array< ModelStoryReactionFilterInput | null > | null,
  not?: ModelStoryReactionFilterInput | null,
};

export type ModelSubscriptionGroupChatFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  group_name?: ModelSubscriptionStringInput | null,
  created_by?: ModelSubscriptionIDInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  last_message?: ModelSubscriptionStringInput | null,
  updated_at?: ModelSubscriptionStringInput | null,
  group_picture?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionGroupChatFilterInput | null > | null,
  or?: Array< ModelSubscriptionGroupChatFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFriendChatFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  chat_id?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  last_message?: ModelSubscriptionStringInput | null,
  updated_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFriendChatFilterInput | null > | null,
  or?: Array< ModelSubscriptionFriendChatFilterInput | null > | null,
};

export type ModelSubscriptionMessagesFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  chat_type?: ModelSubscriptionStringInput | null,
  chat_id?: ModelSubscriptionIDInput | null,
  sender_id?: ModelSubscriptionIDInput | null,
  content?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  attachments?: ModelSubscriptionStringInput | null,
  reply_to_message_id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessagesFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessagesFilterInput | null > | null,
};

export type ModelSubscriptionMessageReactionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  message_id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  icon?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessageReactionFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessageReactionFilterInput | null > | null,
};

export type ModelSubscriptionContactFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  contact_user_id?: ModelSubscriptionIDInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionContactFilterInput | null > | null,
  or?: Array< ModelSubscriptionContactFilterInput | null > | null,
};

export type ModelSubscriptionFriendRequestsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  from_user_id?: ModelSubscriptionIDInput | null,
  to_user_id?: ModelSubscriptionIDInput | null,
  status?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFriendRequestsFilterInput | null > | null,
  or?: Array< ModelSubscriptionFriendRequestsFilterInput | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  password?: ModelSubscriptionStringInput | null,
  profile_picture?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  last_seen?: ModelSubscriptionStringInput | null,
  push_token?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionUserGroupChatFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  group_chat_id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserGroupChatFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserGroupChatFilterInput | null > | null,
};

export type ModelSubscriptionUserFriendChatFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  friend_chat_id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFriendChatFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFriendChatFilterInput | null > | null,
};

export type ModelSubscriptionMusicFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  artist?: ModelSubscriptionStringInput | null,
  url?: ModelSubscriptionStringInput | null,
  duration?: ModelSubscriptionIntInput | null,
  cover_image?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMusicFilterInput | null > | null,
  or?: Array< ModelSubscriptionMusicFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStoryFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  media_url?: ModelSubscriptionStringInput | null,
  text_content?: ModelSubscriptionStringInput | null,
  background_color?: ModelSubscriptionStringInput | null,
  thumbnail_url?: ModelSubscriptionStringInput | null,
  duration?: ModelSubscriptionIntInput | null,
  music_id?: ModelSubscriptionIDInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  expires_at?: ModelSubscriptionStringInput | null,
  music_start_time?: ModelSubscriptionFloatInput | null,
  music_end_time?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionStoryFilterInput | null > | null,
  or?: Array< ModelSubscriptionStoryFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStoryViewFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  story_id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  viewed_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionStoryViewFilterInput | null > | null,
  or?: Array< ModelSubscriptionStoryViewFilterInput | null > | null,
};

export type ModelSubscriptionStoryReactionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  story_id?: ModelSubscriptionIDInput | null,
  user_id?: ModelSubscriptionIDInput | null,
  icon?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionStoryReactionFilterInput | null > | null,
  or?: Array< ModelSubscriptionStoryReactionFilterInput | null > | null,
};

export type CreateGroupChatMutationVariables = {
  input: CreateGroupChatInput,
  condition?: ModelGroupChatConditionInput | null,
};

export type CreateGroupChatMutation = {
  createGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGroupChatMutationVariables = {
  input: UpdateGroupChatInput,
  condition?: ModelGroupChatConditionInput | null,
};

export type UpdateGroupChatMutation = {
  updateGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGroupChatMutationVariables = {
  input: DeleteGroupChatInput,
  condition?: ModelGroupChatConditionInput | null,
};

export type DeleteGroupChatMutation = {
  deleteGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFriendChatMutationVariables = {
  input: CreateFriendChatInput,
  condition?: ModelFriendChatConditionInput | null,
};

export type CreateFriendChatMutation = {
  createFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFriendChatMutationVariables = {
  input: UpdateFriendChatInput,
  condition?: ModelFriendChatConditionInput | null,
};

export type UpdateFriendChatMutation = {
  updateFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFriendChatMutationVariables = {
  input: DeleteFriendChatInput,
  condition?: ModelFriendChatConditionInput | null,
};

export type DeleteFriendChatMutation = {
  deleteFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMessagesMutationVariables = {
  input: CreateMessagesInput,
  condition?: ModelMessagesConditionInput | null,
};

export type CreateMessagesMutation = {
  createMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMessagesMutationVariables = {
  input: UpdateMessagesInput,
  condition?: ModelMessagesConditionInput | null,
};

export type UpdateMessagesMutation = {
  updateMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMessagesMutationVariables = {
  input: DeleteMessagesInput,
  condition?: ModelMessagesConditionInput | null,
};

export type DeleteMessagesMutation = {
  deleteMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMessageReactionMutationVariables = {
  input: CreateMessageReactionInput,
  condition?: ModelMessageReactionConditionInput | null,
};

export type CreateMessageReactionMutation = {
  createMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMessageReactionMutationVariables = {
  input: UpdateMessageReactionInput,
  condition?: ModelMessageReactionConditionInput | null,
};

export type UpdateMessageReactionMutation = {
  updateMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMessageReactionMutationVariables = {
  input: DeleteMessageReactionInput,
  condition?: ModelMessageReactionConditionInput | null,
};

export type DeleteMessageReactionMutation = {
  deleteMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateContactMutationVariables = {
  input: CreateContactInput,
  condition?: ModelContactConditionInput | null,
};

export type CreateContactMutation = {
  createContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateContactMutationVariables = {
  input: UpdateContactInput,
  condition?: ModelContactConditionInput | null,
};

export type UpdateContactMutation = {
  updateContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteContactMutationVariables = {
  input: DeleteContactInput,
  condition?: ModelContactConditionInput | null,
};

export type DeleteContactMutation = {
  deleteContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateFriendRequestsMutationVariables = {
  input: CreateFriendRequestsInput,
  condition?: ModelFriendRequestsConditionInput | null,
};

export type CreateFriendRequestsMutation = {
  createFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateFriendRequestsMutationVariables = {
  input: UpdateFriendRequestsInput,
  condition?: ModelFriendRequestsConditionInput | null,
};

export type UpdateFriendRequestsMutation = {
  updateFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteFriendRequestsMutationVariables = {
  input: DeleteFriendRequestsInput,
  condition?: ModelFriendRequestsConditionInput | null,
};

export type DeleteFriendRequestsMutation = {
  deleteFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserGroupChatMutationVariables = {
  input: CreateUserGroupChatInput,
  condition?: ModelUserGroupChatConditionInput | null,
};

export type CreateUserGroupChatMutation = {
  createUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserGroupChatMutationVariables = {
  input: UpdateUserGroupChatInput,
  condition?: ModelUserGroupChatConditionInput | null,
};

export type UpdateUserGroupChatMutation = {
  updateUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserGroupChatMutationVariables = {
  input: DeleteUserGroupChatInput,
  condition?: ModelUserGroupChatConditionInput | null,
};

export type DeleteUserGroupChatMutation = {
  deleteUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserFriendChatMutationVariables = {
  input: CreateUserFriendChatInput,
  condition?: ModelUserFriendChatConditionInput | null,
};

export type CreateUserFriendChatMutation = {
  createUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserFriendChatMutationVariables = {
  input: UpdateUserFriendChatInput,
  condition?: ModelUserFriendChatConditionInput | null,
};

export type UpdateUserFriendChatMutation = {
  updateUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserFriendChatMutationVariables = {
  input: DeleteUserFriendChatInput,
  condition?: ModelUserFriendChatConditionInput | null,
};

export type DeleteUserFriendChatMutation = {
  deleteUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMusicMutationVariables = {
  input: CreateMusicInput,
  condition?: ModelMusicConditionInput | null,
};

export type CreateMusicMutation = {
  createMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMusicMutationVariables = {
  input: UpdateMusicInput,
  condition?: ModelMusicConditionInput | null,
};

export type UpdateMusicMutation = {
  updateMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMusicMutationVariables = {
  input: DeleteMusicInput,
  condition?: ModelMusicConditionInput | null,
};

export type DeleteMusicMutation = {
  deleteMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateStoryMutationVariables = {
  input: CreateStoryInput,
  condition?: ModelStoryConditionInput | null,
};

export type CreateStoryMutation = {
  createStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStoryMutationVariables = {
  input: UpdateStoryInput,
  condition?: ModelStoryConditionInput | null,
};

export type UpdateStoryMutation = {
  updateStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStoryMutationVariables = {
  input: DeleteStoryInput,
  condition?: ModelStoryConditionInput | null,
};

export type DeleteStoryMutation = {
  deleteStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateStoryViewMutationVariables = {
  input: CreateStoryViewInput,
  condition?: ModelStoryViewConditionInput | null,
};

export type CreateStoryViewMutation = {
  createStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStoryViewMutationVariables = {
  input: UpdateStoryViewInput,
  condition?: ModelStoryViewConditionInput | null,
};

export type UpdateStoryViewMutation = {
  updateStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStoryViewMutationVariables = {
  input: DeleteStoryViewInput,
  condition?: ModelStoryViewConditionInput | null,
};

export type DeleteStoryViewMutation = {
  deleteStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateStoryReactionMutationVariables = {
  input: CreateStoryReactionInput,
  condition?: ModelStoryReactionConditionInput | null,
};

export type CreateStoryReactionMutation = {
  createStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStoryReactionMutationVariables = {
  input: UpdateStoryReactionInput,
  condition?: ModelStoryReactionConditionInput | null,
};

export type UpdateStoryReactionMutation = {
  updateStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStoryReactionMutationVariables = {
  input: DeleteStoryReactionInput,
  condition?: ModelStoryReactionConditionInput | null,
};

export type DeleteStoryReactionMutation = {
  deleteStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetGroupChatQueryVariables = {
  id: string,
};

export type GetGroupChatQuery = {
  getGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGroupChatsQueryVariables = {
  filter?: ModelGroupChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGroupChatsQuery = {
  listGroupChats?:  {
    __typename: "ModelGroupChatConnection",
    items:  Array< {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GroupChatsByCreated_byQueryVariables = {
  created_by: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGroupChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GroupChatsByCreated_byQuery = {
  groupChatsByCreated_by?:  {
    __typename: "ModelGroupChatConnection",
    items:  Array< {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFriendChatQueryVariables = {
  id: string,
};

export type GetFriendChatQuery = {
  getFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFriendChatsQueryVariables = {
  filter?: ModelFriendChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendChatsQuery = {
  listFriendChats?:  {
    __typename: "ModelFriendChatConnection",
    items:  Array< {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMessagesQueryVariables = {
  id: string,
};

export type GetMessagesQuery = {
  getMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessagesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessagesConnection",
    items:  Array< {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesByChat_idAndTimestampQueryVariables = {
  chat_id: string,
  timestamp?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessagesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesByChat_idAndTimestampQuery = {
  messagesByChat_idAndTimestamp?:  {
    __typename: "ModelMessagesConnection",
    items:  Array< {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesBySender_idQueryVariables = {
  sender_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessagesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesBySender_idQuery = {
  messagesBySender_id?:  {
    __typename: "ModelMessagesConnection",
    items:  Array< {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesByReply_to_message_idQueryVariables = {
  reply_to_message_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessagesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesByReply_to_message_idQuery = {
  messagesByReply_to_message_id?:  {
    __typename: "ModelMessagesConnection",
    items:  Array< {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMessageReactionQueryVariables = {
  id: string,
};

export type GetMessageReactionQuery = {
  getMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMessageReactionsQueryVariables = {
  filter?: ModelMessageReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessageReactionsQuery = {
  listMessageReactions?:  {
    __typename: "ModelMessageReactionConnection",
    items:  Array< {
      __typename: "MessageReaction",
      id: string,
      message_id: string,
      user_id: string,
      icon?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessageReactionsByMessage_idQueryVariables = {
  message_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessageReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessageReactionsByMessage_idQuery = {
  messageReactionsByMessage_id?:  {
    __typename: "ModelMessageReactionConnection",
    items:  Array< {
      __typename: "MessageReaction",
      id: string,
      message_id: string,
      user_id: string,
      icon?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessageReactionsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessageReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessageReactionsByUser_idQuery = {
  messageReactionsByUser_id?:  {
    __typename: "ModelMessageReactionConnection",
    items:  Array< {
      __typename: "MessageReaction",
      id: string,
      message_id: string,
      user_id: string,
      icon?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetContactQueryVariables = {
  id: string,
};

export type GetContactQuery = {
  getContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListContactsQueryVariables = {
  filter?: ModelContactFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContactsQuery = {
  listContacts?:  {
    __typename: "ModelContactConnection",
    items:  Array< {
      __typename: "Contact",
      id: string,
      user_id: string,
      contact_user_id: string,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ContactsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelContactFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ContactsByUser_idQuery = {
  contactsByUser_id?:  {
    __typename: "ModelContactConnection",
    items:  Array< {
      __typename: "Contact",
      id: string,
      user_id: string,
      contact_user_id: string,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ContactsByContact_user_idQueryVariables = {
  contact_user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelContactFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ContactsByContact_user_idQuery = {
  contactsByContact_user_id?:  {
    __typename: "ModelContactConnection",
    items:  Array< {
      __typename: "Contact",
      id: string,
      user_id: string,
      contact_user_id: string,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetFriendRequestsQueryVariables = {
  id: string,
};

export type GetFriendRequestsQuery = {
  getFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListFriendRequestsQueryVariables = {
  filter?: ModelFriendRequestsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendRequestsQuery = {
  listFriendRequests?:  {
    __typename: "ModelFriendRequestsConnection",
    items:  Array< {
      __typename: "FriendRequests",
      id: string,
      from_user_id: string,
      to_user_id: string,
      status?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FriendRequestsByFrom_user_idQueryVariables = {
  from_user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFriendRequestsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FriendRequestsByFrom_user_idQuery = {
  friendRequestsByFrom_user_id?:  {
    __typename: "ModelFriendRequestsConnection",
    items:  Array< {
      __typename: "FriendRequests",
      id: string,
      from_user_id: string,
      to_user_id: string,
      status?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FriendRequestsByTo_user_idQueryVariables = {
  to_user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFriendRequestsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FriendRequestsByTo_user_idQuery = {
  friendRequestsByTo_user_id?:  {
    __typename: "ModelFriendRequestsConnection",
    items:  Array< {
      __typename: "FriendRequests",
      id: string,
      from_user_id: string,
      to_user_id: string,
      status?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserGroupChatQueryVariables = {
  id: string,
};

export type GetUserGroupChatQuery = {
  getUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserGroupChatsQueryVariables = {
  filter?: ModelUserGroupChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserGroupChatsQuery = {
  listUserGroupChats?:  {
    __typename: "ModelUserGroupChatConnection",
    items:  Array< {
      __typename: "UserGroupChat",
      id: string,
      user_id: string,
      group_chat_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserGroupChatsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserGroupChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserGroupChatsByUser_idQuery = {
  userGroupChatsByUser_id?:  {
    __typename: "ModelUserGroupChatConnection",
    items:  Array< {
      __typename: "UserGroupChat",
      id: string,
      user_id: string,
      group_chat_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserGroupChatsByGroup_chat_idQueryVariables = {
  group_chat_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserGroupChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserGroupChatsByGroup_chat_idQuery = {
  userGroupChatsByGroup_chat_id?:  {
    __typename: "ModelUserGroupChatConnection",
    items:  Array< {
      __typename: "UserGroupChat",
      id: string,
      user_id: string,
      group_chat_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserFriendChatQueryVariables = {
  id: string,
};

export type GetUserFriendChatQuery = {
  getUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserFriendChatsQueryVariables = {
  filter?: ModelUserFriendChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserFriendChatsQuery = {
  listUserFriendChats?:  {
    __typename: "ModelUserFriendChatConnection",
    items:  Array< {
      __typename: "UserFriendChat",
      id: string,
      user_id: string,
      friend_chat_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserFriendChatsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFriendChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserFriendChatsByUser_idQuery = {
  userFriendChatsByUser_id?:  {
    __typename: "ModelUserFriendChatConnection",
    items:  Array< {
      __typename: "UserFriendChat",
      id: string,
      user_id: string,
      friend_chat_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserFriendChatsByFriend_chat_idQueryVariables = {
  friend_chat_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFriendChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserFriendChatsByFriend_chat_idQuery = {
  userFriendChatsByFriend_chat_id?:  {
    __typename: "ModelUserFriendChatConnection",
    items:  Array< {
      __typename: "UserFriendChat",
      id: string,
      user_id: string,
      friend_chat_id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMusicQueryVariables = {
  id: string,
};

export type GetMusicQuery = {
  getMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMusicQueryVariables = {
  filter?: ModelMusicFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMusicQuery = {
  listMusic?:  {
    __typename: "ModelMusicConnection",
    items:  Array< {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetStoryQueryVariables = {
  id: string,
};

export type GetStoryQuery = {
  getStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListStoriesQueryVariables = {
  filter?: ModelStoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStoriesQuery = {
  listStories?:  {
    __typename: "ModelStoryConnection",
    items:  Array< {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type StoriesByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StoriesByUser_idQuery = {
  storiesByUser_id?:  {
    __typename: "ModelStoryConnection",
    items:  Array< {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type StoriesByMusic_idQueryVariables = {
  music_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StoriesByMusic_idQuery = {
  storiesByMusic_id?:  {
    __typename: "ModelStoryConnection",
    items:  Array< {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetStoryViewQueryVariables = {
  id: string,
};

export type GetStoryViewQuery = {
  getStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListStoryViewsQueryVariables = {
  filter?: ModelStoryViewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStoryViewsQuery = {
  listStoryViews?:  {
    __typename: "ModelStoryViewConnection",
    items:  Array< {
      __typename: "StoryView",
      id: string,
      story_id: string,
      user_id: string,
      viewed_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type StoryViewsByStory_idQueryVariables = {
  story_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStoryViewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StoryViewsByStory_idQuery = {
  storyViewsByStory_id?:  {
    __typename: "ModelStoryViewConnection",
    items:  Array< {
      __typename: "StoryView",
      id: string,
      story_id: string,
      user_id: string,
      viewed_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type StoryViewsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStoryViewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StoryViewsByUser_idQuery = {
  storyViewsByUser_id?:  {
    __typename: "ModelStoryViewConnection",
    items:  Array< {
      __typename: "StoryView",
      id: string,
      story_id: string,
      user_id: string,
      viewed_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetStoryReactionQueryVariables = {
  id: string,
};

export type GetStoryReactionQuery = {
  getStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListStoryReactionsQueryVariables = {
  filter?: ModelStoryReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStoryReactionsQuery = {
  listStoryReactions?:  {
    __typename: "ModelStoryReactionConnection",
    items:  Array< {
      __typename: "StoryReaction",
      id: string,
      story_id: string,
      user_id: string,
      icon?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type StoryReactionsByStory_idQueryVariables = {
  story_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStoryReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StoryReactionsByStory_idQuery = {
  storyReactionsByStory_id?:  {
    __typename: "ModelStoryReactionConnection",
    items:  Array< {
      __typename: "StoryReaction",
      id: string,
      story_id: string,
      user_id: string,
      icon?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type StoryReactionsByUser_idQueryVariables = {
  user_id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStoryReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StoryReactionsByUser_idQuery = {
  storyReactionsByUser_id?:  {
    __typename: "ModelStoryReactionConnection",
    items:  Array< {
      __typename: "StoryReaction",
      id: string,
      story_id: string,
      user_id: string,
      icon?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateGroupChatSubscriptionVariables = {
  filter?: ModelSubscriptionGroupChatFilterInput | null,
};

export type OnCreateGroupChatSubscription = {
  onCreateGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGroupChatSubscriptionVariables = {
  filter?: ModelSubscriptionGroupChatFilterInput | null,
};

export type OnUpdateGroupChatSubscription = {
  onUpdateGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGroupChatSubscriptionVariables = {
  filter?: ModelSubscriptionGroupChatFilterInput | null,
};

export type OnDeleteGroupChatSubscription = {
  onDeleteGroupChat?:  {
    __typename: "GroupChat",
    id: string,
    group_name?: string | null,
    created_by: string,
    members?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateFriendChatSubscriptionVariables = {
  filter?: ModelSubscriptionFriendChatFilterInput | null,
};

export type OnCreateFriendChatSubscription = {
  onCreateFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFriendChatSubscriptionVariables = {
  filter?: ModelSubscriptionFriendChatFilterInput | null,
};

export type OnUpdateFriendChatSubscription = {
  onUpdateFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFriendChatSubscriptionVariables = {
  filter?: ModelSubscriptionFriendChatFilterInput | null,
};

export type OnDeleteFriendChatSubscription = {
  onDeleteFriendChat?:  {
    __typename: "FriendChat",
    id: string,
    chat_id?: string | null,
    users?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    last_message?: string | null,
    updated_at?: string | null,
    messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMessagesSubscriptionVariables = {
  filter?: ModelSubscriptionMessagesFilterInput | null,
};

export type OnCreateMessagesSubscription = {
  onCreateMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMessagesSubscriptionVariables = {
  filter?: ModelSubscriptionMessagesFilterInput | null,
};

export type OnUpdateMessagesSubscription = {
  onUpdateMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMessagesSubscriptionVariables = {
  filter?: ModelSubscriptionMessagesFilterInput | null,
};

export type OnDeleteMessagesSubscription = {
  onDeleteMessages?:  {
    __typename: "Messages",
    id: string,
    chat_type?: string | null,
    chat_id: string,
    sender_id: string,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attachments?: string | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    sender?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    reply_to_message_id?: string | null,
    reply_to_message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    replied_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    group_chat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friend_chat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMessageReactionSubscriptionVariables = {
  filter?: ModelSubscriptionMessageReactionFilterInput | null,
};

export type OnCreateMessageReactionSubscription = {
  onCreateMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMessageReactionSubscriptionVariables = {
  filter?: ModelSubscriptionMessageReactionFilterInput | null,
};

export type OnUpdateMessageReactionSubscription = {
  onUpdateMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMessageReactionSubscriptionVariables = {
  filter?: ModelSubscriptionMessageReactionFilterInput | null,
};

export type OnDeleteMessageReactionSubscription = {
  onDeleteMessageReaction?:  {
    __typename: "MessageReaction",
    id: string,
    message_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    message?:  {
      __typename: "Messages",
      id: string,
      chat_type?: string | null,
      chat_id: string,
      sender_id: string,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attachments?: string | null,
      reply_to_message_id?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateContactSubscriptionVariables = {
  filter?: ModelSubscriptionContactFilterInput | null,
};

export type OnCreateContactSubscription = {
  onCreateContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateContactSubscriptionVariables = {
  filter?: ModelSubscriptionContactFilterInput | null,
};

export type OnUpdateContactSubscription = {
  onUpdateContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteContactSubscriptionVariables = {
  filter?: ModelSubscriptionContactFilterInput | null,
};

export type OnDeleteContactSubscription = {
  onDeleteContact?:  {
    __typename: "Contact",
    id: string,
    user_id: string,
    contact_user_id: string,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    contact_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateFriendRequestsSubscriptionVariables = {
  filter?: ModelSubscriptionFriendRequestsFilterInput | null,
};

export type OnCreateFriendRequestsSubscription = {
  onCreateFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateFriendRequestsSubscriptionVariables = {
  filter?: ModelSubscriptionFriendRequestsFilterInput | null,
};

export type OnUpdateFriendRequestsSubscription = {
  onUpdateFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteFriendRequestsSubscriptionVariables = {
  filter?: ModelSubscriptionFriendRequestsFilterInput | null,
};

export type OnDeleteFriendRequestsSubscription = {
  onDeleteFriendRequests?:  {
    __typename: "FriendRequests",
    id: string,
    from_user_id: string,
    to_user_id: string,
    status?: string | null,
    created_at?: string | null,
    from_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    to_user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email: string,
    password: string,
    profile_picture?: string | null,
    status?: string | null,
    last_seen?: string | null,
    push_token?: string | null,
    FriendChats?:  {
      __typename: "ModelUserFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelUserGroupChatConnection",
      nextToken?: string | null,
    } | null,
    Contacts?:  {
      __typename: "ModelContactConnection",
      nextToken?: string | null,
    } | null,
    SentFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    ReceivedFriendRequests?:  {
      __typename: "ModelFriendRequestsConnection",
      nextToken?: string | null,
    } | null,
    message_reactions?:  {
      __typename: "ModelMessageReactionConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    StoryViews?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    sent_messages?:  {
      __typename: "ModelMessagesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserGroupChatSubscriptionVariables = {
  filter?: ModelSubscriptionUserGroupChatFilterInput | null,
};

export type OnCreateUserGroupChatSubscription = {
  onCreateUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserGroupChatSubscriptionVariables = {
  filter?: ModelSubscriptionUserGroupChatFilterInput | null,
};

export type OnUpdateUserGroupChatSubscription = {
  onUpdateUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserGroupChatSubscriptionVariables = {
  filter?: ModelSubscriptionUserGroupChatFilterInput | null,
};

export type OnDeleteUserGroupChatSubscription = {
  onDeleteUserGroupChat?:  {
    __typename: "UserGroupChat",
    id: string,
    user_id: string,
    group_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupChat?:  {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by: string,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserFriendChatSubscriptionVariables = {
  filter?: ModelSubscriptionUserFriendChatFilterInput | null,
};

export type OnCreateUserFriendChatSubscription = {
  onCreateUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserFriendChatSubscriptionVariables = {
  filter?: ModelSubscriptionUserFriendChatFilterInput | null,
};

export type OnUpdateUserFriendChatSubscription = {
  onUpdateUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserFriendChatSubscriptionVariables = {
  filter?: ModelSubscriptionUserFriendChatFilterInput | null,
};

export type OnDeleteUserFriendChatSubscription = {
  onDeleteUserFriendChat?:  {
    __typename: "UserFriendChat",
    id: string,
    user_id: string,
    friend_chat_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    friendChat?:  {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      updated_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMusicSubscriptionVariables = {
  filter?: ModelSubscriptionMusicFilterInput | null,
};

export type OnCreateMusicSubscription = {
  onCreateMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMusicSubscriptionVariables = {
  filter?: ModelSubscriptionMusicFilterInput | null,
};

export type OnUpdateMusicSubscription = {
  onUpdateMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMusicSubscriptionVariables = {
  filter?: ModelSubscriptionMusicFilterInput | null,
};

export type OnDeleteMusicSubscription = {
  onDeleteMusic?:  {
    __typename: "Music",
    id: string,
    title: string,
    artist?: string | null,
    url: string,
    duration?: number | null,
    cover_image?: string | null,
    created_at?: string | null,
    Stories?:  {
      __typename: "ModelStoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateStorySubscriptionVariables = {
  filter?: ModelSubscriptionStoryFilterInput | null,
};

export type OnCreateStorySubscription = {
  onCreateStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateStorySubscriptionVariables = {
  filter?: ModelSubscriptionStoryFilterInput | null,
};

export type OnUpdateStorySubscription = {
  onUpdateStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteStorySubscriptionVariables = {
  filter?: ModelSubscriptionStoryFilterInput | null,
};

export type OnDeleteStorySubscription = {
  onDeleteStory?:  {
    __typename: "Story",
    id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    type: string,
    media_url?: string | null,
    text_content?: string | null,
    background_color?: string | null,
    thumbnail_url?: string | null,
    duration?: number | null,
    music_id?: string | null,
    music?:  {
      __typename: "Music",
      id: string,
      title: string,
      artist?: string | null,
      url: string,
      duration?: number | null,
      cover_image?: string | null,
      created_at?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    views?:  {
      __typename: "ModelStoryViewConnection",
      nextToken?: string | null,
    } | null,
    story_reactions?:  {
      __typename: "ModelStoryReactionConnection",
      nextToken?: string | null,
    } | null,
    created_at?: string | null,
    expires_at?: string | null,
    music_start_time?: number | null,
    music_end_time?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateStoryViewSubscriptionVariables = {
  filter?: ModelSubscriptionStoryViewFilterInput | null,
};

export type OnCreateStoryViewSubscription = {
  onCreateStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateStoryViewSubscriptionVariables = {
  filter?: ModelSubscriptionStoryViewFilterInput | null,
};

export type OnUpdateStoryViewSubscription = {
  onUpdateStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteStoryViewSubscriptionVariables = {
  filter?: ModelSubscriptionStoryViewFilterInput | null,
};

export type OnDeleteStoryViewSubscription = {
  onDeleteStoryView?:  {
    __typename: "StoryView",
    id: string,
    story_id: string,
    user_id: string,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    viewed_at?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateStoryReactionSubscriptionVariables = {
  filter?: ModelSubscriptionStoryReactionFilterInput | null,
};

export type OnCreateStoryReactionSubscription = {
  onCreateStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateStoryReactionSubscriptionVariables = {
  filter?: ModelSubscriptionStoryReactionFilterInput | null,
};

export type OnUpdateStoryReactionSubscription = {
  onUpdateStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteStoryReactionSubscriptionVariables = {
  filter?: ModelSubscriptionStoryReactionFilterInput | null,
};

export type OnDeleteStoryReactionSubscription = {
  onDeleteStoryReaction?:  {
    __typename: "StoryReaction",
    id: string,
    story_id: string,
    user_id: string,
    icon?: string | null,
    created_at?: string | null,
    user?:  {
      __typename: "User",
      id: string,
      name?: string | null,
      email: string,
      password: string,
      profile_picture?: string | null,
      status?: string | null,
      last_seen?: string | null,
      push_token?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    story?:  {
      __typename: "Story",
      id: string,
      user_id: string,
      type: string,
      media_url?: string | null,
      text_content?: string | null,
      background_color?: string | null,
      thumbnail_url?: string | null,
      duration?: number | null,
      music_id?: string | null,
      created_at?: string | null,
      expires_at?: string | null,
      music_start_time?: number | null,
      music_end_time?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
