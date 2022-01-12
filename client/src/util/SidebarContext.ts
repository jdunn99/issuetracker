import React from "react";
type Sidebar = {
  closed: boolean;
  toggleSidebar: () => void;
  active: string;
  changeActive: (query: string) => void;
};

const SidebarContext = React.createContext<Sidebar>({
  closed: false,
  toggleSidebar: () => {},
  active: "Projects",
  changeActive: () => {},
});
export const SidebarProvider = SidebarContext.Provider;

export default SidebarContext;
