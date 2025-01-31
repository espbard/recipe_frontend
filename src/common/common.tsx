import "../styles/constants.scss";

interface AutocompleteOption {
  id: number;
  label: string;
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface ListItem {
  name: string;
  id: number;
}

enum Icon {
  Delete = "🗑",
  Add = "+",
  Minus = "−",
  Remove = "➖",
  Close = "✖︎",
  Check = "✔︎",
  ChevronLeft = "🞀",
  ChevronRight = "🞂",
  ChevronUp = "▲",
  ChevronDown = "▼",
  Home = "🏠",
  Book = "📖",
  ShoppingList = "🛒",
  Edit = "✎",
  Logout = "🚪",
  login = "👤",
  Search = "🔎︎",
  Recipe = "🍽",
  BurgerMenu = "☰",
  Dot = "•",
}

interface Color {
  name: string;
  css: string;
}

interface User {
  display_name: string | null;
  id: number | null;
  token: string | null;
}

const Colors: Color[] = [
  { name: "white", css: "var(--color-almost-white)" },
  { name: "main", css: "var(--color-main)" },
  { name: "black", css: "var(--color-almost-black)" },
  { name: "green", css: "var(--color-midnight-green)" },
  { name: "cerulean", css: "var(--color-cerulean)" },
  { name: "red", css: "var(--color-imperial-red)" },
  { name: "rose", css: "var(--color-old-rose)" },
];

const Capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  if (s.length === 0) return "";
  if (s.length === 1) return s.toUpperCase();

  return s.charAt(0).toUpperCase() + s.slice(1);
};

enum ErrorCodes {
  PASSWORD_INVALID = 402,
  PASSWORD_LENGTH_INVALID = 411,
  PASSWORD_WRONG = 405,
  USERNAME_INVALID = 406,
  USERNAME_TAKEN = 407,
  USERNAME_WRONG = 409,
  DISPLAY_NAME_INVALID = 403,
  DISPLAY_NAME_TAKEN = 412,
  TOKEN_ERROR = 413,
  PLACEHOLDER_1 = 414,
  PLACEHOLDER_2 = 415,
  PLACEHOLDER_3 = 416,
  PLACEHOLDER_4 = 417,
  PLACEHOLDER_5 = 418,
  DEFAULT = 400,
}

export type { AutocompleteOption, Ingredient, ListItem, User };
export { Icon, Colors, Capitalize, ErrorCodes };
