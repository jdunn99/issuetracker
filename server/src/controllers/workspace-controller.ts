import { getPaginatedResult } from "../models/database";
import { ConnectionArgs } from "../models/types";
import { Workspace } from "../models/workspace-model";

/**
 * Defines the functions for retrieving workspace related entities from the database
 */
const WorkspaceController = {
  /**
   * @function
   * Retrieves a paginated connection of workspaces
   */
  getWorkspaces({ first, after }: ConnectionArgs): Promise<Workspace[]> {
    const query = getPaginatedResult("workspace", { first, after });
    return query.execute();
  },
};

export default WorkspaceController;
