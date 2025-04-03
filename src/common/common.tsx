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

const Capitalize = (s: string | undefined) => {
  if (typeof s !== "string") return "";
  if (s.length === 0) return "";
  if (s.length === 1) return s.toUpperCase();

  return s.charAt(0).toUpperCase() + s.slice(1);
};

enum ErrorCodes {
  PASSWORD_INVALID = 440,
  PASSWORD_LENGTH_INVALID = 441,
  PASSWORD_WRONG = 442,
  USERNAME_INVALID = 443,
  USERNAME_TAKEN = 444,
  USERNAME_WRONG = 445,
  DISPLAY_NAME_INVALID = 446,
  DISPLAY_NAME_TAKEN = 447,
  TOKEN_ERROR = 448,
  INVALID_IMAGE_NAME = 449,
  INVALID_IMAGE_TYPE = 450,
  PLACEHOLDER_3 = 451,
  PLACEHOLDER_4 = 452,
  PLACEHOLDER_5 = 453,
  DEFAULT = 400,
}

enum PopUpFunctions {
  GO_TO_RECIPE = "GO_TO_RECIPE",
  DELETE_FUNCTION = "DELETE_FUNCTION",
  HOME = "HOME",
  RELOAD = "RELOAD",
  CLOSE = "CLOSE",
}

export type { AutocompleteOption, Ingredient, ListItem, User };
export { Icon, Colors, Capitalize, ErrorCodes, PopUpFunctions };
