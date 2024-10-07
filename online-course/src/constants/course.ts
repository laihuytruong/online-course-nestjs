export interface MenuCategory {
  name: string;
  parentId: number | null;
  groupName: string;
  children: MenuCategory[];
}

export interface MenuClass {
  [key: string]: string;
}
