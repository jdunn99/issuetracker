import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
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
	issue: Issue;
	comments: Array<Comment>;
	projects: Array<Project>;
	project?: Maybe<Project>;
};

export type QueryIssueArgs = {
	id: Scalars['Float'];
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
	notifications: Array<Notification>;
};

/** The user's role */
export enum Role {
	Admin = 'ADMIN',
	Editor = 'EDITOR',
	Viewer = 'VIEWER',
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
	Veryhigh = 'VERYHIGH',
}

/** The issue's status */
export enum Status {
	Todo = 'TODO',
	Progress = 'PROGRESS',
	Review = 'REVIEW',
	Resolved = 'RESOLVED',
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

export type Notification = {
	__typename?: 'Notification';
	id: Scalars['Int'];
	createdAt: Scalars['DateTime'];
	message: Scalars['String'];
	user: User;
};

export type Mutation = {
	__typename?: 'Mutation';
	register: UserResponse;
	login: UserResponse;
	changePermissions: UserResponse;
	deleteUsers: Scalars['Boolean'];
	createIssue?: Maybe<Array<Error>>;
	updateIssue: IssueResponse;
	deleteIssues: Scalars['Boolean'];
	createComment?: Maybe<Array<Error>>;
	deleteComment: Scalars['Boolean'];
	deleteComments: Scalars['Boolean'];
	createProject: Project;
	addUserToProject: ProjectRole;
	removeUserFromProject: Scalars['Boolean'];
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

export type MutationUpdateIssueArgs = {
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

export type MutationCreateProjectArgs = {
	desc: Scalars['String'];
	name: Scalars['String'];
};

export type MutationAddUserToProjectArgs = {
	email: Scalars['String'];
	id: Scalars['Float'];
};

export type MutationRemoveUserFromProjectArgs = {
	id: Scalars['Float'];
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

export type IssueResponse = {
	__typename?: 'IssueResponse';
	errors?: Maybe<Array<Error>>;
	issue?: Maybe<Issue>;
};

export type Subscription = {
	__typename?: 'Subscription';
	notify: Notification;
	sendIssue: Issue;
	sendComment: Comment;
};

export type SubscriptionNotifyArgs = {
	subscriber: Scalars['Float'];
};

export type AddUserToProjectMutationVariables = Exact<{
	id: Scalars['Float'];
	email: Scalars['String'];
}>;

export type AddUserToProjectMutation = { __typename?: 'Mutation' } & {
	addUserToProject: { __typename?: 'ProjectRole' } & Pick<
		ProjectRole,
		'id' | 'role'
	> & { user: { __typename?: 'User' } & Pick<User, 'email' | 'id' | 'name'> };
};

export type CreateCommentMutationVariables = Exact<{
	content: Scalars['String'];
	issueId: Scalars['Float'];
}>;

export type CreateCommentMutation = { __typename?: 'Mutation' } & {
	createComment?: Maybe<
		Array<{ __typename?: 'error' } & Pick<Error, 'field' | 'message'>>
	>;
};

export type CreateIssueMutationVariables = Exact<{
	name: Scalars['String'];
	desc: Scalars['String'];
	severity: Scalars['Float'];
	projectId: Scalars['Float'];
}>;

export type CreateIssueMutation = { __typename?: 'Mutation' } & {
	createIssue?: Maybe<
		Array<{ __typename?: 'Error' } & Pick<Error, 'field' | 'message'>>
	>;
};

export type CreateProjectMutationVariables = Exact<{
	name: Scalars['String'];
	desc: Scalars['String'];
}>;

export type CreateProjectMutation = { __typename?: 'Mutation' } & {
	createProject: { __typename?: 'Project' } & Pick<
		Project,
		'id' | 'name' | 'desc' | 'createdAt'
	> & {
			users: Array<
				{ __typename?: 'ProjectRole' } & Pick<
					ProjectRole,
					'id' | 'role'
				> & {
						user: { __typename?: 'User' } & Pick<
							User,
							'email' | 'id' | 'name'
						>;
					}
			>;
			issues: Array<
				{ __typename?: 'Issue' } & Pick<
					Issue,
					'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'
				> & {
						createdBy: { __typename?: 'User' } & Pick<
							User,
							'email' | 'name' | 'id'
						>;
						comments: Array<
							{ __typename?: 'Comment' } & Pick<
								Comment,
								'id' | 'createdAt' | 'comment'
							> & {
									postedBy: { __typename?: 'User' } & Pick<
										User,
										'id' | 'name'
									>;
								}
						>;
					}
			>;
		};
};

export type DeleteCommentMutationVariables = Exact<{
	id: Scalars['Float'];
}>;

export type DeleteCommentMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'deleteComment'
>;

export type LoginMutationVariables = Exact<{
	email: Scalars['String'];
	password: Scalars['String'];
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
	login: { __typename?: 'UserResponse' } & {
		errors?: Maybe<
			Array<{ __typename?: 'error' } & Pick<Error, 'field' | 'message'>>
		>;
		user?: Maybe<
			{ __typename?: 'User' } & Pick<User, 'email' | 'id' | 'role'> & {
					projects: Array<
						{ __typename?: 'ProjectRole' } & {
							project: { __typename?: 'Project' } & Pick<
								Project,
								'id' | 'name' | 'desc'
							> & {
									issues: Array<
										{ __typename?: 'Issue' } & Pick<
											Issue,
											| 'name'
											| 'desc'
											| 'severity'
											| 'status'
											| 'id'
											| 'createdAt'
										> & {
												comments: Array<
													{
														__typename?: 'Comment';
													} & Pick<
														Comment,
														| 'id'
														| 'createdAt'
														| 'comment'
													> & {
															postedBy: {
																__typename?: 'User';
															} & Pick<
																User,
																'id' | 'name'
															>;
														}
												>;
												createdBy: {
													__typename?: 'User';
												} & Pick<
													User,
													'email' | 'name' | 'id'
												>;
											}
									>;
								};
						}
					>;
				}
		>;
	};
};

export type RemoveUserFromProjectMutationVariables = Exact<{
	id: Scalars['Float'];
}>;

export type RemoveUserFromProjectMutation = { __typename?: 'Mutation' } & Pick<
	Mutation,
	'removeUserFromProject'
>;

export type UpdateIssueMutationVariables = Exact<{
	id: Scalars['Float'];
	name?: Maybe<Scalars['String']>;
	desc?: Maybe<Scalars['String']>;
	status?: Maybe<Scalars['Float']>;
}>;

export type UpdateIssueMutation = { __typename?: 'Mutation' } & {
	updateIssue: { __typename?: 'IssueResponse' } & {
		errors?: Maybe<
			Array<{ __typename?: 'Error' } & Pick<Error, 'field' | 'message'>>
		>;
		issue?: Maybe<
			{ __typename?: 'Issue' } & Pick<
				Issue,
				'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'
			> & {
					comments: Array<
						{ __typename?: 'Comment' } & Pick<
							Comment,
							'id' | 'createdAt' | 'comment'
						> & {
								postedBy: { __typename?: 'User' } & Pick<
									User,
									'id' | 'name'
								>;
							}
					>;
					createdBy: { __typename?: 'User' } & Pick<
						User,
						'email' | 'name' | 'id'
					>;
				}
		>;
	};
};

export type IssueQueryVariables = Exact<{
	id: Scalars['Float'];
}>;

export type IssueQuery = { __typename?: 'Query' } & {
	issue: { __typename?: 'Issue' } & Pick<
		Issue,
		'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'
	> & {
			comments: Array<
				{ __typename?: 'Comment' } & Pick<
					Comment,
					'id' | 'createdAt' | 'comment'
				> & {
						postedBy: { __typename?: 'User' } & Pick<
							User,
							'id' | 'name'
						>;
					}
			>;
			createdBy: { __typename?: 'User' } & Pick<
				User,
				'email' | 'name' | 'id'
			>;
		};
};

export type ProjectQueryVariables = Exact<{
	id: Scalars['Float'];
}>;

export type ProjectQuery = { __typename?: 'Query' } & {
	project?: Maybe<
		{ __typename?: 'Project' } & Pick<
			Project,
			'id' | 'name' | 'desc' | 'createdAt'
		> & {
				users: Array<
					{ __typename?: 'ProjectRole' } & Pick<
						ProjectRole,
						'id' | 'role'
					> & {
							user: { __typename?: 'User' } & Pick<
								User,
								'email' | 'id' | 'name'
							>;
						}
				>;
				issues: Array<
					{ __typename?: 'Issue' } & Pick<
						Issue,
						| 'name'
						| 'desc'
						| 'severity'
						| 'status'
						| 'id'
						| 'createdAt'
					> & {
							comments: Array<
								{ __typename?: 'Comment' } & Pick<
									Comment,
									'id' | 'createdAt' | 'comment'
								> & {
										postedBy: {
											__typename?: 'User';
										} & Pick<User, 'id' | 'name'>;
									}
							>;
							createdBy: { __typename?: 'User' } & Pick<
								User,
								'email' | 'name' | 'id'
							>;
						}
				>;
			}
	>;
};

export type UserQueryVariables = Exact<{ [key: string]: never }>;

export type UserQuery = { __typename?: 'Query' } & {
	user?: Maybe<
		{ __typename?: 'User' } & Pick<User, 'email' | 'id' | 'role'> & {
				projects: Array<
					{ __typename?: 'ProjectRole' } & {
						project: { __typename?: 'Project' } & Pick<
							Project,
							'id' | 'name' | 'desc'
						> & {
								issues: Array<
									{ __typename?: 'Issue' } & Pick<
										Issue,
										| 'name'
										| 'desc'
										| 'severity'
										| 'status'
										| 'id'
										| 'createdAt'
									> & {
											comments: Array<
												{
													__typename?: 'Comment';
												} & Pick<
													Comment,
													| 'id'
													| 'createdAt'
													| 'comment'
												> & {
														postedBy: {
															__typename?: 'User';
														} & Pick<
															User,
															'id' | 'name'
														>;
													}
											>;
											createdBy: {
												__typename?: 'User';
											} & Pick<
												User,
												'email' | 'name' | 'id'
											>;
										}
								>;
							};
					}
				>;
			}
	>;
};

export type SendCommentSubscriptionVariables = Exact<{ [key: string]: never }>;

export type SendCommentSubscription = { __typename?: 'Subscription' } & {
	sendComment: { __typename?: 'Comment' } & Pick<
		Comment,
		'id' | 'createdAt' | 'comment'
	> & { postedBy: { __typename?: 'User' } & Pick<User, 'id' | 'name'> };
};

export type SendIssueSubscriptionVariables = Exact<{ [key: string]: never }>;

export type SendIssueSubscription = { __typename?: 'Subscription' } & {
	sendIssue: { __typename?: 'Issue' } & Pick<
		Issue,
		'name' | 'desc' | 'severity' | 'status' | 'id' | 'createdAt'
	> & {
			createdBy: { __typename?: 'User' } & Pick<
				User,
				'email' | 'name' | 'id'
			>;
			comments: Array<
				{ __typename?: 'Comment' } & Pick<
					Comment,
					'id' | 'createdAt' | 'comment'
				> & {
						postedBy: { __typename?: 'User' } & Pick<
							User,
							'id' | 'name'
						>;
					}
			>;
		};
};

export const AddUserToProjectDocument = gql`
	mutation AddUserToProject($id: Float!, $email: String!) {
		addUserToProject(id: $id, email: $email) {
			id
			role
			user {
				email
				id
				name
			}
		}
	}
`;
export type AddUserToProjectMutationFn = Apollo.MutationFunction<
	AddUserToProjectMutation,
	AddUserToProjectMutationVariables
>;

/**
 * __useAddUserToProjectMutation__
 *
 * To run a mutation, you first call `useAddUserToProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToProjectMutation, { data, loading, error }] = useAddUserToProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddUserToProjectMutation(
	baseOptions?: Apollo.MutationHookOptions<
		AddUserToProjectMutation,
		AddUserToProjectMutationVariables
	>
) {
	return Apollo.useMutation<
		AddUserToProjectMutation,
		AddUserToProjectMutationVariables
	>(AddUserToProjectDocument, baseOptions);
}
export type AddUserToProjectMutationHookResult = ReturnType<
	typeof useAddUserToProjectMutation
>;
export type AddUserToProjectMutationResult = Apollo.MutationResult<AddUserToProjectMutation>;
export type AddUserToProjectMutationOptions = Apollo.BaseMutationOptions<
	AddUserToProjectMutation,
	AddUserToProjectMutationVariables
>;
export const CreateCommentDocument = gql`
	mutation CreateComment($content: String!, $issueId: Float!) {
		createComment(content: $content, issueId: $issueId) {
			field
			message
		}
	}
`;
export type CreateCommentMutationFn = Apollo.MutationFunction<
	CreateCommentMutation,
	CreateCommentMutationVariables
>;

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
export function useCreateCommentMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateCommentMutation,
		CreateCommentMutationVariables
	>
) {
	return Apollo.useMutation<
		CreateCommentMutation,
		CreateCommentMutationVariables
	>(CreateCommentDocument, baseOptions);
}
export type CreateCommentMutationHookResult = ReturnType<
	typeof useCreateCommentMutation
>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<
	CreateCommentMutation,
	CreateCommentMutationVariables
>;
export const CreateIssueDocument = gql`
	mutation CreateIssue(
		$name: String!
		$desc: String!
		$severity: Float!
		$projectId: Float!
	) {
		createIssue(
			name: $name
			desc: $desc
			severity: $severity
			projectId: $projectId
		) {
			field
			message
		}
	}
`;
export type CreateIssueMutationFn = Apollo.MutationFunction<
	CreateIssueMutation,
	CreateIssueMutationVariables
>;

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
export function useCreateIssueMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateIssueMutation,
		CreateIssueMutationVariables
	>
) {
	return Apollo.useMutation<
		CreateIssueMutation,
		CreateIssueMutationVariables
	>(CreateIssueDocument, baseOptions);
}
export type CreateIssueMutationHookResult = ReturnType<
	typeof useCreateIssueMutation
>;
export type CreateIssueMutationResult = Apollo.MutationResult<CreateIssueMutation>;
export type CreateIssueMutationOptions = Apollo.BaseMutationOptions<
	CreateIssueMutation,
	CreateIssueMutationVariables
>;
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
					email
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
export type CreateProjectMutationFn = Apollo.MutationFunction<
	CreateProjectMutation,
	CreateProjectMutationVariables
>;

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
export function useCreateProjectMutation(
	baseOptions?: Apollo.MutationHookOptions<
		CreateProjectMutation,
		CreateProjectMutationVariables
	>
) {
	return Apollo.useMutation<
		CreateProjectMutation,
		CreateProjectMutationVariables
	>(CreateProjectDocument, baseOptions);
}
export type CreateProjectMutationHookResult = ReturnType<
	typeof useCreateProjectMutation
>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
	CreateProjectMutation,
	CreateProjectMutationVariables
>;
export const DeleteCommentDocument = gql`
	mutation DeleteComment($id: Float!) {
		deleteComment(id: $id)
	}
`;
export type DeleteCommentMutationFn = Apollo.MutationFunction<
	DeleteCommentMutation,
	DeleteCommentMutationVariables
>;

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
export function useDeleteCommentMutation(
	baseOptions?: Apollo.MutationHookOptions<
		DeleteCommentMutation,
		DeleteCommentMutationVariables
	>
) {
	return Apollo.useMutation<
		DeleteCommentMutation,
		DeleteCommentMutationVariables
	>(DeleteCommentDocument, baseOptions);
}
export type DeleteCommentMutationHookResult = ReturnType<
	typeof useDeleteCommentMutation
>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<
	DeleteCommentMutation,
	DeleteCommentMutationVariables
>;
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
export type LoginMutationFn = Apollo.MutationFunction<
	LoginMutation,
	LoginMutationVariables
>;

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
export function useLoginMutation(
	baseOptions?: Apollo.MutationHookOptions<
		LoginMutation,
		LoginMutationVariables
	>
) {
	return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
		LoginDocument,
		baseOptions
	);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
	LoginMutation,
	LoginMutationVariables
>;
export const RemoveUserFromProjectDocument = gql`
	mutation RemoveUserFromProject($id: Float!) {
		removeUserFromProject(id: $id)
	}
`;
export type RemoveUserFromProjectMutationFn = Apollo.MutationFunction<
	RemoveUserFromProjectMutation,
	RemoveUserFromProjectMutationVariables
>;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveUserFromProjectMutation(
	baseOptions?: Apollo.MutationHookOptions<
		RemoveUserFromProjectMutation,
		RemoveUserFromProjectMutationVariables
	>
) {
	return Apollo.useMutation<
		RemoveUserFromProjectMutation,
		RemoveUserFromProjectMutationVariables
	>(RemoveUserFromProjectDocument, baseOptions);
}
export type RemoveUserFromProjectMutationHookResult = ReturnType<
	typeof useRemoveUserFromProjectMutation
>;
export type RemoveUserFromProjectMutationResult = Apollo.MutationResult<RemoveUserFromProjectMutation>;
export type RemoveUserFromProjectMutationOptions = Apollo.BaseMutationOptions<
	RemoveUserFromProjectMutation,
	RemoveUserFromProjectMutationVariables
>;
export const UpdateIssueDocument = gql`
	mutation UpdateIssue(
		$id: Float!
		$name: String
		$desc: String
		$status: Float
	) {
		updateIssue(id: $id, name: $name, desc: $desc, status: $status) {
			errors {
				field
				message
			}
			issue {
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
export type UpdateIssueMutationFn = Apollo.MutationFunction<
	UpdateIssueMutation,
	UpdateIssueMutationVariables
>;

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
 *   },
 * });
 */
export function useUpdateIssueMutation(
	baseOptions?: Apollo.MutationHookOptions<
		UpdateIssueMutation,
		UpdateIssueMutationVariables
	>
) {
	return Apollo.useMutation<
		UpdateIssueMutation,
		UpdateIssueMutationVariables
	>(UpdateIssueDocument, baseOptions);
}
export type UpdateIssueMutationHookResult = ReturnType<
	typeof useUpdateIssueMutation
>;
export type UpdateIssueMutationResult = Apollo.MutationResult<UpdateIssueMutation>;
export type UpdateIssueMutationOptions = Apollo.BaseMutationOptions<
	UpdateIssueMutation,
	UpdateIssueMutationVariables
>;
export const IssueDocument = gql`
	query Issue($id: Float!) {
		issue(id: $id) {
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
`;

/**
 * __useIssueQuery__
 *
 * To run a query within a React component, call `useIssueQuery` and pass it any options that fit your needs.
 * When your component renders, `useIssueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIssueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIssueQuery(
	baseOptions: Apollo.QueryHookOptions<IssueQuery, IssueQueryVariables>
) {
	return Apollo.useQuery<IssueQuery, IssueQueryVariables>(
		IssueDocument,
		baseOptions
	);
}
export function useIssueLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<IssueQuery, IssueQueryVariables>
) {
	return Apollo.useLazyQuery<IssueQuery, IssueQueryVariables>(
		IssueDocument,
		baseOptions
	);
}
export type IssueQueryHookResult = ReturnType<typeof useIssueQuery>;
export type IssueLazyQueryHookResult = ReturnType<typeof useIssueLazyQuery>;
export type IssueQueryResult = Apollo.QueryResult<
	IssueQuery,
	IssueQueryVariables
>;
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
					email
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
export function useProjectQuery(
	baseOptions: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>
) {
	return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(
		ProjectDocument,
		baseOptions
	);
}
export function useProjectLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<
		ProjectQuery,
		ProjectQueryVariables
	>
) {
	return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(
		ProjectDocument,
		baseOptions
	);
}
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<
	ProjectQuery,
	ProjectQueryVariables
>;
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
export function useUserQuery(
	baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>
) {
	return Apollo.useQuery<UserQuery, UserQueryVariables>(
		UserDocument,
		baseOptions
	);
}
export function useUserLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>
) {
	return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
		UserDocument,
		baseOptions
	);
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const SendCommentDocument = gql`
	subscription SendComment {
		sendComment {
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
 *   },
 * });
 */
export function useSendCommentSubscription(
	baseOptions?: Apollo.SubscriptionHookOptions<
		SendCommentSubscription,
		SendCommentSubscriptionVariables
	>
) {
	return Apollo.useSubscription<
		SendCommentSubscription,
		SendCommentSubscriptionVariables
	>(SendCommentDocument, baseOptions);
}
export type SendCommentSubscriptionHookResult = ReturnType<
	typeof useSendCommentSubscription
>;
export type SendCommentSubscriptionResult = Apollo.SubscriptionResult<SendCommentSubscription>;
export const SendIssueDocument = gql`
	subscription SendIssue {
		sendIssue {
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
export function useSendIssueSubscription(
	baseOptions?: Apollo.SubscriptionHookOptions<
		SendIssueSubscription,
		SendIssueSubscriptionVariables
	>
) {
	return Apollo.useSubscription<
		SendIssueSubscription,
		SendIssueSubscriptionVariables
	>(SendIssueDocument, baseOptions);
}
export type SendIssueSubscriptionHookResult = ReturnType<
	typeof useSendIssueSubscription
>;
export type SendIssueSubscriptionResult = Apollo.SubscriptionResult<SendIssueSubscription>;
