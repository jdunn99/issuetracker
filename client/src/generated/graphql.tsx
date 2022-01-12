import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  getUserOverview: UserOverviewResponse;
  usersByQuery: Array<User>;
  getUserProjects: UserProjectResponse;
  canEdit: Role;
  getIssuesFromProject: ProjectIssueResponse;
  getCommentsForIssue: Array<Comment>;
  project: ProjectResponse;
  getUsersForProject: ProjectUserResponse;
};


export type QueryGetUserOverviewArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryUsersByQueryArgs = {
  limit: Scalars['Float'];
  query: Scalars['String'];
};


export type QueryGetUserProjectsArgs = {
  cursor?: Maybe<Scalars['String']>;
};


export type QueryCanEditArgs = {
  id: Scalars['Float'];
};


export type QueryGetIssuesFromProjectArgs = {
  id: Scalars['Float'];
};


export type QueryGetCommentsForIssueArgs = {
  id: Scalars['Float'];
};


export type QueryProjectArgs = {
  id: Scalars['Float'];
};


export type QueryGetUsersForProjectArgs = {
  search?: Maybe<Scalars['String']>;
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  name: Scalars['String'];
  projectManagement: Array<ProjectManagement>;
  ownedProjects: Array<Project>;
  createdAt: Scalars['DateTime'];
  issues: Array<Issue>;
  ownedIssues: Array<Issue>;
  comments: Array<Comment>;
  notifications: Array<Notification>;
  feed: Array<Feed>;
};

export type ProjectManagement = {
  __typename?: 'ProjectManagement';
  id: Scalars['Int'];
  project: Project;
  user: User;
  createdAt: Scalars['DateTime'];
  role: Role;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['Int'];
  owner: User;
  projectManagement: Array<ProjectManagement>;
  name: Scalars['String'];
  desc: Scalars['String'];
  issues: Array<Issue>;
  createdAt: Scalars['DateTime'];
};

export type Issue = {
  __typename?: 'Issue';
  id: Scalars['Int'];
  name: Scalars['String'];
  desc: Scalars['String'];
  createdAt: Scalars['DateTime'];
  severity: Severity;
  status: Status;
  project: Project;
  owner: User;
  users: Array<User>;
  comments: Array<Comment>;
};


/** The issue's severity */
export enum Severity {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Veryhigh = 'VERYHIGH'
}

/** The issue's status */
export enum Status {
  Todo = 'TODO',
  Progress = 'PROGRESS',
  Review = 'REVIEW',
  Resolved = 'RESOLVED'
}

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  comment: Scalars['String'];
  createdAt: Scalars['DateTime'];
  postedBy: User;
  issue: Issue;
};

/** The user's role */
export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
  Owner = 'OWNER'
}

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  message: Scalars['String'];
  user: User;
};

export type Feed = {
  __typename?: 'Feed';
  id: Scalars['Int'];
  title: Scalars['String'];
  desc?: Maybe<Scalars['String']>;
  subheading?: Maybe<Scalars['String']>;
  type: FeedType;
  createdAt: Scalars['DateTime'];
  user: User;
};

export enum FeedType {
  Comment = 'Comment',
  New = 'New',
  Invite = 'Invite',
  Role = 'Role',
  Update = 'Update'
}

export type UserOverviewResponse = PaginatedResponse & {
  __typename?: 'UserOverviewResponse';
  errors?: Maybe<Array<Error>>;
  hasMore: Scalars['Boolean'];
  response?: Maybe<OverviewResponse>;
};

export type PaginatedResponse = {
  errors?: Maybe<Array<Error>>;
  hasMore: Scalars['Boolean'];
};

export type Error = {
  __typename?: 'error';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type OverviewResponse = {
  __typename?: 'OverviewResponse';
  feed: Array<Feed>;
  created: Scalars['Int'];
  posted: Scalars['Int'];
  owned: Scalars['Int'];
  projects: Scalars['Int'];
};

export type UserProjectResponse = Response & {
  __typename?: 'UserProjectResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<Array<UserProject>>;
};

export type Response = {
  errors?: Maybe<Array<Error>>;
};

export type UserProject = {
  __typename?: 'UserProject';
  name: Scalars['String'];
  createdAt: Scalars['String'];
  issues: Scalars['Int'];
  owner: Scalars['String'];
  role: Role;
  id: Scalars['Int'];
};

export type ProjectIssueResponse = Response & {
  __typename?: 'ProjectIssueResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<Array<UserIssue>>;
};

export type UserIssue = {
  __typename?: 'UserIssue';
  name: Scalars['String'];
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  severity: Severity;
  status: Status;
  projectName: Scalars['String'];
  projectId: Scalars['Float'];
  desc: Scalars['String'];
};

export type ProjectResponse = Response & {
  __typename?: 'ProjectResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<ProjectRes>;
};

export type ProjectRes = {
  __typename?: 'ProjectRes';
  project: Project;
  canEdit: Role;
};

export type ProjectUserResponse = PaginatedResponse & {
  __typename?: 'ProjectUserResponse';
  errors?: Maybe<Array<Error>>;
  hasMore: Scalars['Boolean'];
  response?: Maybe<Array<ProjectManagement>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  updateUser: ProjectManagementResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createIssue?: Maybe<IssueResponse>;
  updateIssue: IssueResponse;
  createComment?: Maybe<Array<Error>>;
  deleteComment: Scalars['Boolean'];
  deleteFeedItem?: Maybe<Feed>;
  createProject: ProjectResponse;
  updateProject: ProjectResponse;
  addUsers: ProjectUserResponse;
  removeUsersFromProject: DeletionResponse;
  changeRole: ProjectManagementResponse;
  leaveProject: DeletionResponse;
  deleteProjectById: DeletionResponse;
  deleteProjects: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  role: Scalars['Float'];
  projectId: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCreateIssueArgs = {
  severity: Scalars['Float'];
  desc: Scalars['String'];
  projectId: Scalars['Float'];
  name: Scalars['String'];
};


export type MutationUpdateIssueArgs = {
  severity?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['Float']>;
  desc?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationCreateCommentArgs = {
  issueId: Scalars['Float'];
  content: Scalars['String'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteFeedItemArgs = {
  cursor: Scalars['String'];
  id: Scalars['Float'];
};


export type MutationCreateProjectArgs = {
  desc: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateProjectArgs = {
  desc?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationAddUsersArgs = {
  users: Array<Scalars['Int']>;
  id: Scalars['Float'];
};


export type MutationRemoveUsersFromProjectArgs = {
  userIds: Array<Scalars['Int']>;
  projectId: Scalars['Float'];
};


export type MutationChangeRoleArgs = {
  role: Scalars['Float'];
  id: Scalars['Float'];
};


export type MutationLeaveProjectArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteProjectByIdArgs = {
  id: Scalars['Float'];
};

export type UserResponse = Response & {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<UserRes>;
};

export type UserRes = {
  __typename?: 'UserRes';
  user?: Maybe<User>;
  projectManagement?: Maybe<Array<ProjectManagement>>;
};

export type ProjectManagementResponse = Response & {
  __typename?: 'ProjectManagementResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<ProjectManagement>;
};

export type IssueResponse = Response & {
  __typename?: 'IssueResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<Issue>;
};

export type DeletionResponse = Response & {
  __typename?: 'DeletionResponse';
  errors?: Maybe<Array<Error>>;
  response?: Maybe<Array<Scalars['Int']>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  sendIssue: Issue;
  sendComment: Comment;
  sendFeed: Feed;
  sendLeaveProject: Array<Scalars['Int']>;
  deleteProject: Array<Scalars['Int']>;
};


export type SubscriptionSendCommentArgs = {
  id: Scalars['Float'];
};


export type SubscriptionSendFeedArgs = {
  id: Scalars['Float'];
};


export type SubscriptionSendLeaveProjectArgs = {
  id: Scalars['Float'];
};


export type SubscriptionDeleteProjectArgs = {
  id: Scalars['Float'];
};

export type IssueFragmentFragment = (
  { __typename?: 'UserIssue' }
  & Pick<UserIssue, 'name' | 'status' | 'severity' | 'createdAt' | 'projectName' | 'projectId' | 'desc' | 'id'>
);

export type AddUsersMutationVariables = Exact<{
  id: Scalars['Float'];
  users: Array<Scalars['Int']>;
}>;


export type AddUsersMutation = (
  { __typename?: 'Mutation' }
  & { addUsers: (
    { __typename?: 'ProjectUserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<Array<(
      { __typename?: 'ProjectManagement' }
      & Pick<ProjectManagement, 'createdAt' | 'role' | 'id'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'email' | 'name'>
      ) }
    )>> }
  ) }
);

export type ChangeRoleMutationVariables = Exact<{
  id: Scalars['Float'];
  role: Scalars['Float'];
}>;


export type ChangeRoleMutation = (
  { __typename?: 'Mutation' }
  & { changeRole: (
    { __typename?: 'ProjectManagementResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'ProjectManagement' }
      & Pick<ProjectManagement, 'role'>
    )> }
  ) }
);

export type CreateCommentMutationVariables = Exact<{
  content: Scalars['String'];
  issueId: Scalars['Float'];
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment?: Maybe<Array<(
    { __typename?: 'error' }
    & Pick<Error, 'field' | 'message'>
  )>> }
);

export type CreateIssueMutationVariables = Exact<{
  name: Scalars['String'];
  desc: Scalars['String'];
  severity: Scalars['Float'];
  projectId: Scalars['Float'];
}>;


export type CreateIssueMutation = (
  { __typename?: 'Mutation' }
  & { createIssue?: Maybe<(
    { __typename?: 'IssueResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'id'>
    )> }
  )> }
);

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
  desc: Scalars['String'];
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'ProjectResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'ProjectRes' }
      & Pick<ProjectRes, 'canEdit'>
      & { project: (
        { __typename?: 'Project' }
        & Pick<Project, 'name' | 'desc' | 'id' | 'createdAt'>
        & { owner: (
          { __typename?: 'User' }
          & Pick<User, 'name'>
        ) }
      ) }
    )> }
  ) }
);

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteComment'>
);

export type DeleteFeedItemMutationVariables = Exact<{
  id: Scalars['Float'];
  cursor: Scalars['String'];
}>;


export type DeleteFeedItemMutation = (
  { __typename?: 'Mutation' }
  & { deleteFeedItem?: Maybe<(
    { __typename?: 'Feed' }
    & Pick<Feed, 'id' | 'desc' | 'createdAt' | 'title' | 'subheading' | 'type'>
  )> }
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProjectById: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'response'>
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>> }
  ) }
);

export type LeaveProjectMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type LeaveProjectMutation = (
  { __typename?: 'Mutation' }
  & { leaveProject: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'response'>
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>> }
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'UserRes' }
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'email' | 'name'>
      )> }
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'UserRes' }
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'email' | 'name'>
      )> }
    )> }
  ) }
);

export type RemoveUserFromProjectMutationVariables = Exact<{
  projectId: Scalars['Float'];
  userIds: Array<Scalars['Int']>;
}>;


export type RemoveUserFromProjectMutation = (
  { __typename?: 'Mutation' }
  & { removeUsersFromProject: (
    { __typename?: 'DeletionResponse' }
    & Pick<DeletionResponse, 'response'>
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>> }
  ) }
);

export type UpdateIssueMutationVariables = Exact<{
  id: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
  severity?: Maybe<Scalars['Float']>;
}>;


export type UpdateIssueMutation = (
  { __typename?: 'Mutation' }
  & { updateIssue: (
    { __typename?: 'IssueResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'id' | 'name' | 'desc' | 'severity' | 'status' | 'createdAt'>
    )> }
  ) }
);

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject: (
    { __typename?: 'ProjectResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'ProjectRes' }
      & { project: (
        { __typename?: 'Project' }
        & Pick<Project, 'name' | 'desc'>
      ) }
    )> }
  ) }
);

export type CommentsQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { getCommentsForIssue: Array<(
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'comment' | 'createdAt'>
    & { postedBy: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  )> }
);

export type ProjectQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project: (
    { __typename?: 'ProjectResponse' }
    & { response?: Maybe<(
      { __typename?: 'ProjectRes' }
      & Pick<ProjectRes, 'canEdit'>
      & { project: (
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name' | 'desc'>
      ) }
    )>, errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>> }
  ) }
);

export type GetUsersQueryVariables = Exact<{
  id: Scalars['Float'];
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
}>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { getUsersForProject: (
    { __typename?: 'ProjectUserResponse' }
    & Pick<ProjectUserResponse, 'hasMore'>
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<Array<(
      { __typename?: 'ProjectManagement' }
      & Pick<ProjectManagement, 'createdAt' | 'id' | 'role'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'name' | 'email' | 'id'>
      ) }
    )>> }
  ) }
);

export type ProjectIssuesQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type ProjectIssuesQuery = (
  { __typename?: 'Query' }
  & { getIssuesFromProject: (
    { __typename?: 'ProjectIssueResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<Array<(
      { __typename?: 'UserIssue' }
      & IssueFragmentFragment
    )>> }
  ) }
);

export type UserProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProjectsQuery = (
  { __typename?: 'Query' }
  & { getUserProjects: (
    { __typename?: 'UserProjectResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<Array<(
      { __typename?: 'UserProject' }
      & Pick<UserProject, 'name' | 'role' | 'issues' | 'owner' | 'createdAt' | 'id'>
    )>> }
  ) }
);

export type CanEditQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type CanEditQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'canEdit'>
);

export type OverviewQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type OverviewQuery = (
  { __typename?: 'Query' }
  & { getUserOverview: (
    { __typename?: 'UserOverviewResponse' }
    & Pick<UserOverviewResponse, 'hasMore'>
    & { errors?: Maybe<Array<(
      { __typename?: 'error' }
      & Pick<Error, 'field' | 'message'>
    )>>, response?: Maybe<(
      { __typename?: 'OverviewResponse' }
      & Pick<OverviewResponse, 'owned' | 'created' | 'projects' | 'posted'>
      & { feed: Array<(
        { __typename?: 'Feed' }
        & Pick<Feed, 'id' | 'desc' | 'createdAt' | 'title' | 'subheading' | 'type'>
      )> }
    )> }
  ) }
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email'>
  )> }
);

export type UsersQueryVariables = Exact<{
  query: Scalars['String'];
  limit: Scalars['Float'];
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { usersByQuery: Array<(
    { __typename?: 'User' }
    & Pick<User, 'name' | 'email' | 'id'>
  )> }
);

export type SendCommentSubscriptionVariables = Exact<{
  id: Scalars['Float'];
}>;


export type SendCommentSubscription = (
  { __typename?: 'Subscription' }
  & { sendComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'createdAt' | 'comment'>
    & { postedBy: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  ) }
);

export type SendFeedSubscriptionVariables = Exact<{
  id: Scalars['Float'];
}>;


export type SendFeedSubscription = (
  { __typename?: 'Subscription' }
  & { sendFeed: (
    { __typename?: 'Feed' }
    & Pick<Feed, 'id' | 'title' | 'subheading' | 'desc' | 'type' | 'createdAt'>
  ) }
);

export type SendIssueSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SendIssueSubscription = (
  { __typename?: 'Subscription' }
  & { sendIssue: (
    { __typename?: 'Issue' }
    & Pick<Issue, 'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'>
    & { owner: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name' | 'id'>
    ), comments: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'createdAt' | 'comment'>
      & { postedBy: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
    )> }
  ) }
);

export const IssueFragmentFragmentDoc = gql`
    fragment IssueFragment on UserIssue {
  name
  status
  severity
  createdAt
  projectName
  projectId
  desc
  id
}
    `;
export const AddUsersDocument = gql`
    mutation AddUsers($id: Float!, $users: [Int!]!) {
  addUsers(id: $id, users: $users) {
    errors {
      field
      message
    }
    response {
      createdAt
      role
      id
      user {
        id
        email
        name
      }
    }
  }
}
    `;
export type AddUsersMutationFn = Apollo.MutationFunction<AddUsersMutation, AddUsersMutationVariables>;

/**
 * __useAddUsersMutation__
 *
 * To run a mutation, you first call `useAddUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUsersMutation, { data, loading, error }] = useAddUsersMutation({
 *   variables: {
 *      id: // value for 'id'
 *      users: // value for 'users'
 *   },
 * });
 */
export function useAddUsersMutation(baseOptions?: Apollo.MutationHookOptions<AddUsersMutation, AddUsersMutationVariables>) {
        return Apollo.useMutation<AddUsersMutation, AddUsersMutationVariables>(AddUsersDocument, baseOptions);
      }
export type AddUsersMutationHookResult = ReturnType<typeof useAddUsersMutation>;
export type AddUsersMutationResult = Apollo.MutationResult<AddUsersMutation>;
export type AddUsersMutationOptions = Apollo.BaseMutationOptions<AddUsersMutation, AddUsersMutationVariables>;
export const ChangeRoleDocument = gql`
    mutation ChangeRole($id: Float!, $role: Float!) {
  changeRole(id: $id, role: $role) {
    errors {
      field
      message
    }
    response {
      role
    }
  }
}
    `;
export type ChangeRoleMutationFn = Apollo.MutationFunction<ChangeRoleMutation, ChangeRoleMutationVariables>;

/**
 * __useChangeRoleMutation__
 *
 * To run a mutation, you first call `useChangeRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeRoleMutation, { data, loading, error }] = useChangeRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useChangeRoleMutation(baseOptions?: Apollo.MutationHookOptions<ChangeRoleMutation, ChangeRoleMutationVariables>) {
        return Apollo.useMutation<ChangeRoleMutation, ChangeRoleMutationVariables>(ChangeRoleDocument, baseOptions);
      }
export type ChangeRoleMutationHookResult = ReturnType<typeof useChangeRoleMutation>;
export type ChangeRoleMutationResult = Apollo.MutationResult<ChangeRoleMutation>;
export type ChangeRoleMutationOptions = Apollo.BaseMutationOptions<ChangeRoleMutation, ChangeRoleMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($content: String!, $issueId: Float!) {
  createComment(content: $content, issueId: $issueId) {
    field
    message
  }
}
    `;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      content: // value for 'content'
 *      issueId: // value for 'issueId'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, baseOptions);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreateIssueDocument = gql`
    mutation CreateIssue($name: String!, $desc: String!, $severity: Float!, $projectId: Float!) {
  createIssue(
    name: $name
    desc: $desc
    severity: $severity
    projectId: $projectId
  ) {
    errors {
      field
      message
    }
    response {
      id
    }
  }
}
    `;
export type CreateIssueMutationFn = Apollo.MutationFunction<CreateIssueMutation, CreateIssueMutationVariables>;

/**
 * __useCreateIssueMutation__
 *
 * To run a mutation, you first call `useCreateIssueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateIssueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createIssueMutation, { data, loading, error }] = useCreateIssueMutation({
 *   variables: {
 *      name: // value for 'name'
 *      desc: // value for 'desc'
 *      severity: // value for 'severity'
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useCreateIssueMutation(baseOptions?: Apollo.MutationHookOptions<CreateIssueMutation, CreateIssueMutationVariables>) {
        return Apollo.useMutation<CreateIssueMutation, CreateIssueMutationVariables>(CreateIssueDocument, baseOptions);
      }
export type CreateIssueMutationHookResult = ReturnType<typeof useCreateIssueMutation>;
export type CreateIssueMutationResult = Apollo.MutationResult<CreateIssueMutation>;
export type CreateIssueMutationOptions = Apollo.BaseMutationOptions<CreateIssueMutation, CreateIssueMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($name: String!, $desc: String!) {
  createProject(name: $name, desc: $desc) {
    errors {
      field
      message
    }
    response {
      canEdit
      project {
        name
        desc
        id
        createdAt
        owner {
          name
        }
      }
    }
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      name: // value for 'name'
 *      desc: // value for 'desc'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($id: Float!) {
  deleteComment(id: $id)
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, baseOptions);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const DeleteFeedItemDocument = gql`
    mutation DeleteFeedItem($id: Float!, $cursor: String!) {
  deleteFeedItem(id: $id, cursor: $cursor) {
    id
    desc
    createdAt
    title
    subheading
    type
  }
}
    `;
export type DeleteFeedItemMutationFn = Apollo.MutationFunction<DeleteFeedItemMutation, DeleteFeedItemMutationVariables>;

/**
 * __useDeleteFeedItemMutation__
 *
 * To run a mutation, you first call `useDeleteFeedItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFeedItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFeedItemMutation, { data, loading, error }] = useDeleteFeedItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useDeleteFeedItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFeedItemMutation, DeleteFeedItemMutationVariables>) {
        return Apollo.useMutation<DeleteFeedItemMutation, DeleteFeedItemMutationVariables>(DeleteFeedItemDocument, baseOptions);
      }
export type DeleteFeedItemMutationHookResult = ReturnType<typeof useDeleteFeedItemMutation>;
export type DeleteFeedItemMutationResult = Apollo.MutationResult<DeleteFeedItemMutation>;
export type DeleteFeedItemMutationOptions = Apollo.BaseMutationOptions<DeleteFeedItemMutation, DeleteFeedItemMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: Float!) {
  deleteProjectById(id: $id) {
    errors {
      field
      message
    }
    response
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const LeaveProjectDocument = gql`
    mutation LeaveProject($id: Float!) {
  leaveProject(id: $id) {
    errors {
      field
      message
    }
    response
  }
}
    `;
export type LeaveProjectMutationFn = Apollo.MutationFunction<LeaveProjectMutation, LeaveProjectMutationVariables>;

/**
 * __useLeaveProjectMutation__
 *
 * To run a mutation, you first call `useLeaveProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveProjectMutation, { data, loading, error }] = useLeaveProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLeaveProjectMutation(baseOptions?: Apollo.MutationHookOptions<LeaveProjectMutation, LeaveProjectMutationVariables>) {
        return Apollo.useMutation<LeaveProjectMutation, LeaveProjectMutationVariables>(LeaveProjectDocument, baseOptions);
      }
export type LeaveProjectMutationHookResult = ReturnType<typeof useLeaveProjectMutation>;
export type LeaveProjectMutationResult = Apollo.MutationResult<LeaveProjectMutation>;
export type LeaveProjectMutationOptions = Apollo.BaseMutationOptions<LeaveProjectMutation, LeaveProjectMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    response {
      user {
        id
        email
        name
      }
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    errors {
      field
      message
    }
    response {
      user {
        id
        email
        name
      }
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RemoveUserFromProjectDocument = gql`
    mutation RemoveUserFromProject($projectId: Float!, $userIds: [Int!]!) {
  removeUsersFromProject(projectId: $projectId, userIds: $userIds) {
    errors {
      field
      message
    }
    response
  }
}
    `;
export type RemoveUserFromProjectMutationFn = Apollo.MutationFunction<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>;

/**
 * __useRemoveUserFromProjectMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromProjectMutation, { data, loading, error }] = useRemoveUserFromProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useRemoveUserFromProjectMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>) {
        return Apollo.useMutation<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>(RemoveUserFromProjectDocument, baseOptions);
      }
export type RemoveUserFromProjectMutationHookResult = ReturnType<typeof useRemoveUserFromProjectMutation>;
export type RemoveUserFromProjectMutationResult = Apollo.MutationResult<RemoveUserFromProjectMutation>;
export type RemoveUserFromProjectMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromProjectMutation, RemoveUserFromProjectMutationVariables>;
export const UpdateIssueDocument = gql`
    mutation UpdateIssue($id: Float!, $name: String, $desc: String, $status: Float, $severity: Float) {
  updateIssue(
    id: $id
    name: $name
    desc: $desc
    status: $status
    severity: $severity
  ) {
    errors {
      field
      message
    }
    response {
      id
      name
      desc
      severity
      status
      createdAt
    }
  }
}
    `;
export type UpdateIssueMutationFn = Apollo.MutationFunction<UpdateIssueMutation, UpdateIssueMutationVariables>;

/**
 * __useUpdateIssueMutation__
 *
 * To run a mutation, you first call `useUpdateIssueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIssueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIssueMutation, { data, loading, error }] = useUpdateIssueMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      desc: // value for 'desc'
 *      status: // value for 'status'
 *      severity: // value for 'severity'
 *   },
 * });
 */
export function useUpdateIssueMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIssueMutation, UpdateIssueMutationVariables>) {
        return Apollo.useMutation<UpdateIssueMutation, UpdateIssueMutationVariables>(UpdateIssueDocument, baseOptions);
      }
export type UpdateIssueMutationHookResult = ReturnType<typeof useUpdateIssueMutation>;
export type UpdateIssueMutationResult = Apollo.MutationResult<UpdateIssueMutation>;
export type UpdateIssueMutationOptions = Apollo.BaseMutationOptions<UpdateIssueMutation, UpdateIssueMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($id: Float!, $name: String, $desc: String) {
  updateProject(id: $id, name: $name, desc: $desc) {
    errors {
      field
      message
    }
    response {
      project {
        name
        desc
      }
    }
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      desc: // value for 'desc'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const CommentsDocument = gql`
    query Comments($id: Float!) {
  getCommentsForIssue(id: $id) {
    id
    comment
    postedBy {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useCommentsQuery__
 *
 * To run a query within a React component, call `useCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCommentsQuery(baseOptions: Apollo.QueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
        return Apollo.useQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
      }
export function useCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
          return Apollo.useLazyQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
        }
export type CommentsQueryHookResult = ReturnType<typeof useCommentsQuery>;
export type CommentsLazyQueryHookResult = ReturnType<typeof useCommentsLazyQuery>;
export type CommentsQueryResult = Apollo.QueryResult<CommentsQuery, CommentsQueryVariables>;
export const ProjectDocument = gql`
    query Project($id: Float!) {
  project(id: $id) {
    response {
      canEdit
      project {
        id
        name
        desc
      }
    }
    errors {
      field
      message
    }
  }
}
    `;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectQuery(baseOptions: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, baseOptions);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($id: Float!, $limit: Int!, $cursor: String, $search: String) {
  getUsersForProject(id: $id, limit: $limit, cursor: $cursor, search: $search) {
    errors {
      field
      message
    }
    hasMore
    response {
      createdAt
      user {
        name
        email
        id
      }
      id
      role
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      id: // value for 'id'
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, baseOptions);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, baseOptions);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const ProjectIssuesDocument = gql`
    query ProjectIssues($id: Float!) {
  getIssuesFromProject(id: $id) {
    errors {
      field
      message
    }
    response {
      ...IssueFragment
    }
  }
}
    ${IssueFragmentFragmentDoc}`;

/**
 * __useProjectIssuesQuery__
 *
 * To run a query within a React component, call `useProjectIssuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectIssuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectIssuesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectIssuesQuery(baseOptions: Apollo.QueryHookOptions<ProjectIssuesQuery, ProjectIssuesQueryVariables>) {
        return Apollo.useQuery<ProjectIssuesQuery, ProjectIssuesQueryVariables>(ProjectIssuesDocument, baseOptions);
      }
export function useProjectIssuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectIssuesQuery, ProjectIssuesQueryVariables>) {
          return Apollo.useLazyQuery<ProjectIssuesQuery, ProjectIssuesQueryVariables>(ProjectIssuesDocument, baseOptions);
        }
export type ProjectIssuesQueryHookResult = ReturnType<typeof useProjectIssuesQuery>;
export type ProjectIssuesLazyQueryHookResult = ReturnType<typeof useProjectIssuesLazyQuery>;
export type ProjectIssuesQueryResult = Apollo.QueryResult<ProjectIssuesQuery, ProjectIssuesQueryVariables>;
export const UserProjectsDocument = gql`
    query UserProjects {
  getUserProjects {
    errors {
      field
      message
    }
    response {
      name
      role
      issues
      owner
      createdAt
      id
    }
  }
}
    `;

/**
 * __useUserProjectsQuery__
 *
 * To run a query within a React component, call `useUserProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserProjectsQuery(baseOptions?: Apollo.QueryHookOptions<UserProjectsQuery, UserProjectsQueryVariables>) {
        return Apollo.useQuery<UserProjectsQuery, UserProjectsQueryVariables>(UserProjectsDocument, baseOptions);
      }
export function useUserProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserProjectsQuery, UserProjectsQueryVariables>) {
          return Apollo.useLazyQuery<UserProjectsQuery, UserProjectsQueryVariables>(UserProjectsDocument, baseOptions);
        }
export type UserProjectsQueryHookResult = ReturnType<typeof useUserProjectsQuery>;
export type UserProjectsLazyQueryHookResult = ReturnType<typeof useUserProjectsLazyQuery>;
export type UserProjectsQueryResult = Apollo.QueryResult<UserProjectsQuery, UserProjectsQueryVariables>;
export const CanEditDocument = gql`
    query CanEdit($id: Float!) {
  canEdit(id: $id)
}
    `;

/**
 * __useCanEditQuery__
 *
 * To run a query within a React component, call `useCanEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanEditQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCanEditQuery(baseOptions: Apollo.QueryHookOptions<CanEditQuery, CanEditQueryVariables>) {
        return Apollo.useQuery<CanEditQuery, CanEditQueryVariables>(CanEditDocument, baseOptions);
      }
export function useCanEditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CanEditQuery, CanEditQueryVariables>) {
          return Apollo.useLazyQuery<CanEditQuery, CanEditQueryVariables>(CanEditDocument, baseOptions);
        }
export type CanEditQueryHookResult = ReturnType<typeof useCanEditQuery>;
export type CanEditLazyQueryHookResult = ReturnType<typeof useCanEditLazyQuery>;
export type CanEditQueryResult = Apollo.QueryResult<CanEditQuery, CanEditQueryVariables>;
export const OverviewDocument = gql`
    query Overview($limit: Int!, $cursor: String) {
  getUserOverview(limit: $limit, cursor: $cursor) {
    errors {
      field
      message
    }
    hasMore
    response {
      owned
      created
      projects
      posted
      feed {
        id
        desc
        createdAt
        title
        subheading
        type
      }
    }
  }
}
    `;

/**
 * __useOverviewQuery__
 *
 * To run a query within a React component, call `useOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOverviewQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useOverviewQuery(baseOptions: Apollo.QueryHookOptions<OverviewQuery, OverviewQueryVariables>) {
        return Apollo.useQuery<OverviewQuery, OverviewQueryVariables>(OverviewDocument, baseOptions);
      }
export function useOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OverviewQuery, OverviewQueryVariables>) {
          return Apollo.useLazyQuery<OverviewQuery, OverviewQueryVariables>(OverviewDocument, baseOptions);
        }
export type OverviewQueryHookResult = ReturnType<typeof useOverviewQuery>;
export type OverviewLazyQueryHookResult = ReturnType<typeof useOverviewLazyQuery>;
export type OverviewQueryResult = Apollo.QueryResult<OverviewQuery, OverviewQueryVariables>;
export const UserDocument = gql`
    query User {
  user {
    id
    name
    email
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users($query: String!, $limit: Float!) {
  usersByQuery(query: $query, limit: $limit) {
    name
    email
    id
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      query: // value for 'query'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUsersQuery(baseOptions: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const SendCommentDocument = gql`
    subscription SendComment($id: Float!) {
  sendComment(id: $id) {
    id
    createdAt
    postedBy {
      id
      name
    }
    comment
  }
}
    `;

/**
 * __useSendCommentSubscription__
 *
 * To run a query within a React component, call `useSendCommentSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSendCommentSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSendCommentSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSendCommentSubscription(baseOptions: Apollo.SubscriptionHookOptions<SendCommentSubscription, SendCommentSubscriptionVariables>) {
        return Apollo.useSubscription<SendCommentSubscription, SendCommentSubscriptionVariables>(SendCommentDocument, baseOptions);
      }
export type SendCommentSubscriptionHookResult = ReturnType<typeof useSendCommentSubscription>;
export type SendCommentSubscriptionResult = Apollo.SubscriptionResult<SendCommentSubscription>;
export const SendFeedDocument = gql`
    subscription SendFeed($id: Float!) {
  sendFeed(id: $id) {
    id
    title
    subheading
    desc
    type
    createdAt
  }
}
    `;

/**
 * __useSendFeedSubscription__
 *
 * To run a query within a React component, call `useSendFeedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSendFeedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSendFeedSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSendFeedSubscription(baseOptions: Apollo.SubscriptionHookOptions<SendFeedSubscription, SendFeedSubscriptionVariables>) {
        return Apollo.useSubscription<SendFeedSubscription, SendFeedSubscriptionVariables>(SendFeedDocument, baseOptions);
      }
export type SendFeedSubscriptionHookResult = ReturnType<typeof useSendFeedSubscription>;
export type SendFeedSubscriptionResult = Apollo.SubscriptionResult<SendFeedSubscription>;
export const SendIssueDocument = gql`
    subscription SendIssue {
  sendIssue {
    name
    desc
    severity
    status
    id
    createdAt
    owner {
      email
      name
      id
    }
    comments {
      id
      createdAt
      postedBy {
        id
        name
      }
      comment
    }
  }
}
    `;

/**
 * __useSendIssueSubscription__
 *
 * To run a query within a React component, call `useSendIssueSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSendIssueSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSendIssueSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSendIssueSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SendIssueSubscription, SendIssueSubscriptionVariables>) {
        return Apollo.useSubscription<SendIssueSubscription, SendIssueSubscriptionVariables>(SendIssueDocument, baseOptions);
      }
export type SendIssueSubscriptionHookResult = ReturnType<typeof useSendIssueSubscription>;
export type SendIssueSubscriptionResult = Apollo.SubscriptionResult<SendIssueSubscription>;