/************* LOG IN / OUT / REGISTER *************/

import { User } from "../../entities/User";
import { getRepository } from "typeorm";
import {
  ProjectManagementResponse,
  UserResponse,
} from "../graphql-response/Response";
import { Context, Role } from "../../types";
import bcrypt from "bcrypt";
import { ProjectManagement } from "../../entities/ProjectManagement";
import { notFound } from "../graphql-response/ErrorFunctions";

const SALT_FACTOR = 10;

export const loginMutation = async (
  email: string,
  password: string,
  ctx: Context
): Promise<UserResponse> => {
  const checkedUser = (await getRepository(User).findOne({
    where: { email: email },
  })) as User;
  if (!checkedUser)
    return {
      errors: [
        {
          field: "email",
          message: "Email is invalid",
        },
      ],
    };

  // make sure password is valid
  if (!bcrypt.compareSync(password, checkedUser.password)) {
    return {
      errors: [
        {
          field: "password",
          message: "Password is invalid",
        },
      ],
    };
  }

  // Store ID in session.
  ctx.req.session.userId = checkedUser.id;

  return {
    response: {
      user: checkedUser,
    },
  };
};

export const logoutMutation = (ctx: Context) => {
  return new Promise((resolve) =>
    ctx.req.session.destroy((err) => {
      ctx.res.clearCookie("koala");
      if (err) {
        resolve(false);
        return;
      }
      resolve(true);
    })
  );
};

export const registerMutation = async (
  email: string,
  password: string,
  name: string
): Promise<UserResponse> => {
  // Check if email exists
  if (await getRepository(User).findOne({ email })) {
    return {
      errors: [
        {
          field: "email",
          message: "Email already exists",
        },
      ],
    };
  }

  // Check the password to see if it is strong enough
  if (password.length < 6) {
    return {
      errors: [
        {
          field: "password",
          message: "Password is too short",
        },
      ],
    };
  } else if (password.search(/\d/) === -1) {
    return {
      errors: [
        {
          field: "password",
          message: "Password must contain at least 1 number",
        },
      ],
    };
  }

  const hashed = bcrypt.hashSync(password, SALT_FACTOR);
  let newUser = new User();
  newUser.email = email;
  newUser.password = hashed;
  newUser.name = name;
  newUser.projectManagement = [];
  newUser.issues = [];
  newUser.comments = [];
  newUser.notifications = [];
  newUser.feed = [];

  await getRepository(User).save(newUser);

  return {
    response: {
      user: newUser,
    },
  };
};

/************* UPDATE/DELETE *************/
export const updateMutation = async (
  id: number,
  role: Role
): Promise<ProjectManagementResponse> => {
  const project = await getRepository(ProjectManagement).findOne({
    id,
  });
  if (!project) return notFound("user");
  project.role = role;
  await getRepository(ProjectManagement).save(project);
  return {
    response: project,
  };
};
