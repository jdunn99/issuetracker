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
  users: Array<User>;
  issues: Array<Issue>;
  comments: Array<Comment>;
  projects: Array<Project>;
  project?: Maybe<Project>;
};


export type QueryProjectArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
  name: Scalars['String'];
  organization?: Maybe<Scalars['String']>;
  role: Role;
  createdAt: Scalars['DateTime'];
  issues?: Maybe<Array<Issue>>;
  projects: Array<ProjectRole>;
  comments: Array<Comment>;
};

/** The user's role */
export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER'
}


export type Issue = {
  __typename?: 'Issue';
  id: Scalars['Int'];
  name: Scalars['String'];
  desc: Scalars['String'];
  createdAt: Scalars['DateTime'];
  severity: Severity;
  status: Status;
  project: Project;
  createdBy: User;
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

export type Project = {
  __typename?: 'Project';
  id: Scalars['Int'];
  users: Array<ProjectRole>;
  name: Scalars['String'];
  desc: Scalars['String'];
  issues: Array<Issue>;
  createdAt: Scalars['DateTime'];
};

export type ProjectRole = {
  __typename?: 'ProjectRole';
  id: Scalars['Int'];
  project: Project;
  user: User;
  role: Role;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  comment: Scalars['String'];
  createdAt: Scalars['DateTime'];
  postedBy: User;
  issue: Issue;
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  login: UserResponse;
  changePermissions: UserResponse;
  deleteUsers: Scalars['Boolean'];
  createIssue?: Maybe<Issue>;
  deleteIssues: Scalars['Boolean'];
  createComment?: Maybe<Comment>;
  createProject: Project;
  deleteProjects: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  organization?: Maybe<Scalars['String']>;
  role: Role;
  name: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationChangePermissionsArgs = {
  role: Role;
  userId: Scalars['Float'];
};


export type MutationCreateIssueArgs = {
  severity: Scalars['Float'];
  desc: Scalars['String'];
  projectId: Scalars['Float'];
  name: Scalars['String'];
};


export type MutationCreateCommentArgs = {
  issueId: Scalars['Float'];
  content: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  desc: Scalars['String'];
  name: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<Error>>;
  user?: Maybe<User>;
};

export type Error = {
  __typename?: 'Error';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type CreateCommentMutationVariables = Exact<{
  content: Scalars['String'];
  issueId: Scalars['Float'];
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment?: Maybe<(
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'createdAt' | 'comment'>
    & { postedBy: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  )> }
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
    { __typename?: 'Issue' }
    & Pick<Issue, 'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'>
    & { createdBy: (
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
  )> }
);

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
  desc: Scalars['String'];
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'desc' | 'createdAt'>
    & { users: Array<(
      { __typename?: 'ProjectRole' }
      & Pick<ProjectRole, 'id' | 'role'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
    )>, issues: Array<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'>
      & { createdBy: (
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
    )> }
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
      { __typename?: 'Error' }
      & Pick<Error, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'email' | 'id' | 'role'>
      & { projects: Array<(
        { __typename?: 'ProjectRole' }
        & { project: (
          { __typename?: 'Project' }
          & Pick<Project, 'id' | 'name' | 'desc'>
          & { issues: Array<(
            { __typename?: 'Issue' }
            & Pick<Issue, 'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'>
            & { comments: Array<(
              { __typename?: 'Comment' }
              & Pick<Comment, 'id' | 'createdAt' | 'comment'>
              & { postedBy: (
                { __typename?: 'User' }
                & Pick<User, 'id' | 'name'>
              ) }
            )>, createdBy: (
              { __typename?: 'User' }
              & Pick<User, 'email' | 'name' | 'id'>
            ) }
          )> }
        ) }
      )> }
    )> }
  ) }
);

export type ProjectQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type ProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'name' | 'desc' | 'createdAt'>
    & { users: Array<(
      { __typename?: 'ProjectRole' }
      & Pick<ProjectRole, 'id' | 'role'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
    )>, issues: Array<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'>
      & { comments: Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'createdAt' | 'comment'>
        & { postedBy: (
          { __typename?: 'User' }
          & Pick<User, 'id' | 'name'>
        ) }
      )>, createdBy: (
        { __typename?: 'User' }
        & Pick<User, 'email' | 'name' | 'id'>
      ) }
    )> }
  )> }
);

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'email' | 'id' | 'role'>
    & { projects: Array<(
      { __typename?: 'ProjectRole' }
      & { project: (
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'name' | 'desc'>
        & { issues: Array<(
          { __typename?: 'Issue' }
          & Pick<Issue, 'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'>
          & { comments: Array<(
            { __typename?: 'Comment' }
            & Pick<Comment, 'id' | 'createdAt' | 'comment'>
            & { postedBy: (
              { __typename?: 'User' }
              & Pick<User, 'id' | 'name'>
            ) }
          )>, createdBy: (
            { __typename?: 'User' }
            & Pick<User, 'email' | 'name' | 'id'>
          ) }
        )> }
      ) }
    )> }
  )> }
);


export const CreateCommentDocument = gql`
    mutation CreateComment($content: String!, $issueId: Float!) {
  createComment(content: $content, issueId: $issueId) {
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
    name
    desc
    severity
    status
    id
    createdAt
    createdBy {
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
    id
    name
    desc
    createdAt
    users {
      id
      role
      user {
        id
        name
      }
    }
    issues {
      name
      desc
      severity
      status
      id
      createdAt
      createdBy {
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
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    errors {
      field
      message
    }
    user {
      email
      id
      role
      projects {
        project {
          id
          name
          desc
          issues {
            name
            desc
            severity
            status
            id
            createdAt
            comments {
              id
              createdAt
              postedBy {
                id
                name
              }
              comment
            }
            createdBy {
              email
              name
              id
            }
          }
        }
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
export const ProjectDocument = gql`
    query Project($id: Float!) {
  project(id: $id) {
    id
    name
    desc
    createdAt
    users {
      id
      role
      user {
        id
        name
      }
    }
    issues {
      name
      desc
      severity
      status
      id
      createdAt
      comments {
        id
        createdAt
        postedBy {
          id
          name
        }
        comment
      }
      createdBy {
        email
        name
        id
      }
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
export const UserDocument = gql`
    query User {
  user {
    email
    id
    role
    projects {
      project {
        id
        name
        desc
        issues {
          name
          desc
          severity
          status
          id
          comments {
            id
            createdAt
            postedBy {
              id
              name
            }
            comment
          }
          createdAt
          createdBy {
            email
            name
            id
          }
        }
      }
    }
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