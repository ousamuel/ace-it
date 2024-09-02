import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Calendar,
  LibraryBig,
  NotebookText,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/verified/home",
          label: "Home",
          active: pathname.includes("/home"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/verified/calendar",
          label: "Calendar",
          active: pathname.includes("/calendar"),
          icon: Calendar,
          submenus: [
            // {
            //   href: "/posts",
            //   label: "All Posts",
            //   active: pathname === "/posts"
            // },
            // {
            //   href: "/posts/new",
            //   label: "New Post",
            //   active: pathname === "/posts/new"
            // }
          ],
        },
        {
          href: "/verified/flashcards/generate",
          label: "Flashcards",
          active: pathname.includes("/flashcards"),
          icon: LibraryBig,
          submenus: [],
        },
        {
          href: "/verified/mock-exams",
          label: "Mock Exams",
          active: pathname.includes("/mock-exams"),
          icon: NotebookText,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        // {
        //   href: "/users",
        //   label: "Users",
        //   active: pathname.includes("/users"),
        //   icon: Users,
        //   submenus: [],
        // },
        {
          href: "/verified/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
