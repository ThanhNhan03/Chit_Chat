/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGroupChatInput = {
  id?: string | null,
  group_name?: string | null,
  created_by?: string | null,
  members?: string | null,
  created_at?: string | null,
  last_mesage?: string | null,
  updated_at?: string | null,
  group_picture?: string | null,
  description?: string | null,
  userID: string,
};

export type ModelGroupChatConditionInput = {
  group_name?: ModelStringInput | null,
  created_by?: ModelStringInput | null,
  members?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  last_mesage?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  group_picture?: ModelStringInput | null,
  description?: ModelStringInput | null,
  userID?: ModelIDInput | null,
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
  created_by?: string | null,
  members?: string | null,
  created_at?: string | null,
  last_mesage?: string | null,
  updated_at?: string | null,
  group_picture?: string | null,
  description?: string | null,
  userID: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateGroupChatInput = {
  id: string,
  group_name?: string | null,
  created_by?: string | null,
  members?: string | null,
  created_at?: string | null,
  last_mesage?: string | null,
  updated_at?: string | null,
  group_picture?: string | null,
  description?: string | null,
  userID?: string | null,
};

export type DeleteGroupChatInput = {
  id: string,
};

export type CreateFriendChatInput = {
  id?: string | null,
  chat_id?: string | null,
  user_ids?: string | null,
  created_at?: string | null,
  last_message?: string | null,
  update_at?: string | null,
  userID: string,
};

export type ModelFriendChatConditionInput = {
  chat_id?: ModelStringInput | null,
  user_ids?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  last_message?: ModelStringInput | null,
  update_at?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelFriendChatConditionInput | null > | null,
  or?: Array< ModelFriendChatConditionInput | null > | null,
  not?: ModelFriendChatConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type FriendChat = {
  __typename: "FriendChat",
  id: string,
  chat_id?: string | null,
  user_ids?: string | null,
  created_at?: string | null,
  last_message?: string | null,
  update_at?: string | null,
  userID: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFriendChatInput = {
  id: string,
  chat_id?: string | null,
  user_ids?: string | null,
  created_at?: string | null,
  last_message?: string | null,
  update_at?: string | null,
  userID?: string | null,
};

export type DeleteFriendChatInput = {
  id: string,
};

export type CreateMessagesInput = {
  id?: string | null,
  message_id?: string | null,
  chat_type?: string | null,
  chat_id?: string | null,
  group_id?: string | null,
  sender_id?: string | null,
  content?: string | null,
  timestamp?: string | null,
  status?: string | null,
  attchments?: string | null,
};

export type ModelMessagesConditionInput = {
  message_id?: ModelStringInput | null,
  chat_type?: ModelStringInput | null,
  chat_id?: ModelStringInput | null,
  group_id?: ModelStringInput | null,
  sender_id?: ModelStringInput | null,
  content?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  status?: ModelStringInput | null,
  attchments?: ModelStringInput | null,
  and?: Array< ModelMessagesConditionInput | null > | null,
  or?: Array< ModelMessagesConditionInput | null > | null,
  not?: ModelMessagesConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Messages = {
  __typename: "Messages",
  id: string,
  message_id?: string | null,
  chat_type?: string | null,
  chat_id?: string | null,
  group_id?: string | null,
  sender_id?: string | null,
  content?: string | null,
  timestamp?: string | null,
  status?: string | null,
  attchments?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateMessagesInput = {
  id: string,
  message_id?: string | null,
  chat_type?: string | null,
  chat_id?: string | null,
  group_id?: string | null,
  sender_id?: string | null,
  content?: string | null,
  timestamp?: string | null,
  status?: string | null,
  attchments?: string | null,
};

export type DeleteMessagesInput = {
  id: string,
};

export type CreateContactInput = {
  id?: string | null,
  contact_list?: string | null,
};

export type ModelContactConditionInput = {
  contact_list?: ModelStringInput | null,
  and?: Array< ModelContactConditionInput | null > | null,
  or?: Array< ModelContactConditionInput | null > | null,
  not?: ModelContactConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Contact = {
  __typename: "Contact",
  id: string,
  contact_list?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateContactInput = {
  id: string,
  contact_list?: string | null,
};

export type DeleteContactInput = {
  id: string,
};

export type CreateFriendRequestsInput = {
  id?: string | null,
  request_id?: string | null,
  from_user_id?: string | null,
  to_user_id?: string | null,
  status?: string | null,
  timestamp?: string | null,
};

export type ModelFriendRequestsConditionInput = {
  request_id?: ModelStringInput | null,
  from_user_id?: ModelStringInput | null,
  to_user_id?: ModelStringInput | null,
  status?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  and?: Array< ModelFriendRequestsConditionInput | null > | null,
  or?: Array< ModelFriendRequestsConditionInput | null > | null,
  not?: ModelFriendRequestsConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type FriendRequests = {
  __typename: "FriendRequests",
  id: string,
  request_id?: string | null,
  from_user_id?: string | null,
  to_user_id?: string | null,
  status?: string | null,
  timestamp?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateFriendRequestsInput = {
  id: string,
  request_id?: string | null,
  from_user_id?: string | null,
  to_user_id?: string | null,
  status?: string | null,
  timestamp?: string | null,
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
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  password?: ModelStringInput | null,
  profile_picture?: ModelStringInput | null,
  status?: ModelStringInput | null,
  last_seen?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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
  FriendChats?: ModelFriendChatConnection | null,
  GroupChats?: ModelGroupChatConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelFriendChatConnection = {
  __typename: "ModelFriendChatConnection",
  items:  Array<FriendChat | null >,
  nextToken?: string | null,
};

export type ModelGroupChatConnection = {
  __typename: "ModelGroupChatConnection",
  items:  Array<GroupChat | null >,
  nextToken?: string | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  email?: string | null,
  password?: string | null,
  profile_picture?: string | null,
  status?: string | null,
  last_seen?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type ModelGroupChatFilterInput = {
  id?: ModelIDInput | null,
  group_name?: ModelStringInput | null,
  created_by?: ModelStringInput | null,
  members?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  last_mesage?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  group_picture?: ModelStringInput | null,
  description?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelGroupChatFilterInput | null > | null,
  or?: Array< ModelGroupChatFilterInput | null > | null,
  not?: ModelGroupChatFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelFriendChatFilterInput = {
  id?: ModelIDInput | null,
  chat_id?: ModelStringInput | null,
  user_ids?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  last_message?: ModelStringInput | null,
  update_at?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFriendChatFilterInput | null > | null,
  or?: Array< ModelFriendChatFilterInput | null > | null,
  not?: ModelFriendChatFilterInput | null,
};

export type ModelMessagesFilterInput = {
  id?: ModelIDInput | null,
  message_id?: ModelStringInput | null,
  chat_type?: ModelStringInput | null,
  chat_id?: ModelStringInput | null,
  group_id?: ModelStringInput | null,
  sender_id?: ModelStringInput | null,
  content?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  status?: ModelStringInput | null,
  attchments?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessagesFilterInput | null > | null,
  or?: Array< ModelMessagesFilterInput | null > | null,
  not?: ModelMessagesFilterInput | null,
};

export type ModelMessagesConnection = {
  __typename: "ModelMessagesConnection",
  items:  Array<Messages | null >,
  nextToken?: string | null,
};

export type ModelContactFilterInput = {
  id?: ModelIDInput | null,
  contact_list?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContactFilterInput | null > | null,
  or?: Array< ModelContactFilterInput | null > | null,
  not?: ModelContactFilterInput | null,
};

export type ModelContactConnection = {
  __typename: "ModelContactConnection",
  items:  Array<Contact | null >,
  nextToken?: string | null,
};

export type ModelFriendRequestsFilterInput = {
  id?: ModelIDInput | null,
  request_id?: ModelStringInput | null,
  from_user_id?: ModelStringInput | null,
  to_user_id?: ModelStringInput | null,
  status?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFriendRequestsFilterInput | null > | null,
  or?: Array< ModelFriendRequestsFilterInput | null > | null,
  not?: ModelFriendRequestsFilterInput | null,
};

export type ModelFriendRequestsConnection = {
  __typename: "ModelFriendRequestsConnection",
  items:  Array<FriendRequests | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  password?: ModelStringInput | null,
  profile_picture?: ModelStringInput | null,
  status?: ModelStringInput | null,
  last_seen?: ModelStringInput | null,
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

export type ModelSubscriptionGroupChatFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  group_name?: ModelSubscriptionStringInput | null,
  created_by?: ModelSubscriptionStringInput | null,
  members?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  last_mesage?: ModelSubscriptionStringInput | null,
  updated_at?: ModelSubscriptionStringInput | null,
  group_picture?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  userID?: ModelSubscriptionIDInput | null,
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
  user_ids?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  last_message?: ModelSubscriptionStringInput | null,
  update_at?: ModelSubscriptionStringInput | null,
  userID?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFriendChatFilterInput | null > | null,
  or?: Array< ModelSubscriptionFriendChatFilterInput | null > | null,
};

export type ModelSubscriptionMessagesFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  message_id?: ModelSubscriptionStringInput | null,
  chat_type?: ModelSubscriptionStringInput | null,
  chat_id?: ModelSubscriptionStringInput | null,
  group_id?: ModelSubscriptionStringInput | null,
  sender_id?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  attchments?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessagesFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessagesFilterInput | null > | null,
};

export type ModelSubscriptionContactFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  contact_list?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionContactFilterInput | null > | null,
  or?: Array< ModelSubscriptionContactFilterInput | null > | null,
};

export type ModelSubscriptionFriendRequestsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  request_id?: ModelSubscriptionStringInput | null,
  from_user_id?: ModelSubscriptionStringInput | null,
  to_user_id?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
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
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
    contact_list?: string | null,
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
    contact_list?: string | null,
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
    contact_list?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
      nextToken?: string | null,
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
      created_by?: string | null,
      members?: string | null,
      created_at?: string | null,
      last_mesage?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      userID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GroupChatsByUserIDQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGroupChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GroupChatsByUserIDQuery = {
  groupChatsByUserID?:  {
    __typename: "ModelGroupChatConnection",
    items:  Array< {
      __typename: "GroupChat",
      id: string,
      group_name?: string | null,
      created_by?: string | null,
      members?: string | null,
      created_at?: string | null,
      last_mesage?: string | null,
      updated_at?: string | null,
      group_picture?: string | null,
      description?: string | null,
      userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
      user_ids?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      update_at?: string | null,
      userID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FriendChatsByUserIDQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelFriendChatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type FriendChatsByUserIDQuery = {
  friendChatsByUserID?:  {
    __typename: "ModelFriendChatConnection",
    items:  Array< {
      __typename: "FriendChat",
      id: string,
      chat_id?: string | null,
      user_ids?: string | null,
      created_at?: string | null,
      last_message?: string | null,
      update_at?: string | null,
      userID: string,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
      message_id?: string | null,
      chat_type?: string | null,
      chat_id?: string | null,
      group_id?: string | null,
      sender_id?: string | null,
      content?: string | null,
      timestamp?: string | null,
      status?: string | null,
      attchments?: string | null,
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
    contact_list?: string | null,
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
      contact_list?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
      request_id?: string | null,
      from_user_id?: string | null,
      to_user_id?: string | null,
      status?: string | null,
      timestamp?: string | null,
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
    created_by?: string | null,
    members?: string | null,
    created_at?: string | null,
    last_mesage?: string | null,
    updated_at?: string | null,
    group_picture?: string | null,
    description?: string | null,
    userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
    user_ids?: string | null,
    created_at?: string | null,
    last_message?: string | null,
    update_at?: string | null,
    userID: string,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
    message_id?: string | null,
    chat_type?: string | null,
    chat_id?: string | null,
    group_id?: string | null,
    sender_id?: string | null,
    content?: string | null,
    timestamp?: string | null,
    status?: string | null,
    attchments?: string | null,
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
    contact_list?: string | null,
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
    contact_list?: string | null,
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
    contact_list?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
    request_id?: string | null,
    from_user_id?: string | null,
    to_user_id?: string | null,
    status?: string | null,
    timestamp?: string | null,
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
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
    FriendChats?:  {
      __typename: "ModelFriendChatConnection",
      nextToken?: string | null,
    } | null,
    GroupChats?:  {
      __typename: "ModelGroupChatConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
