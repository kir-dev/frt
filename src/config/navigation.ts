export interface NavItem {
  name: string;
  nameEn: string;
  href: string;
  dropdown?: NavItem[] | null;
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Olvasnivalók",
    nameEn: "Reading Materials",
    href: "",
    dropdown: [
      { name: "Hírek", nameEn: "News", href: "/hirek" },
      { name: "Publikációk", nameEn: "Publications", href: "/publikaciok" },
    ],
  },
  {
    name: "Versenyzés",
    nameEn: "Racing",
    href: "",
    dropdown: [
      {
        name: "Formula Student",
        nameEn: "Formula Student",
        href: "/formula-student",
      },
      { name: "Autók", nameEn: "Cars", href: "/autok" },
    ],
  },
  {
    name: "Támogatás",
    nameEn: "Sponsors",
    href: "",
    dropdown: [
      { name: "Támogatók", nameEn: "Sponsors", href: "/tamogatok" },
      {
        name: "Támogass minket",
        nameEn: "Support Us",
        href: "/tamogass-minket",
      },
    ],
  },
  {
    name: "Tagfelvétel",
    nameEn: "Joining Process",
    href: "/tagfelvetel",
    dropdown: null,
  },
  {
    name: "Rólunk",
    nameEn: "About us",
    href: "",
    dropdown: [
      { name: "Csapat", nameEn: "Team", href: "/rolunk" },
      {
        name: "Eseménynaptár",
        nameEn: "Event calendar",
        href: "/esemenynaptar",
      },
      { name: "Kapcsolat", nameEn: "Contact", href: "/kapcsolat" },
      // { name: "Egyesület", nameEn: "Association", href: "/egyesulet" },
      { name: "Galéria", nameEn: "Gallery", href: "/galeria" },
    ],
  },
];
