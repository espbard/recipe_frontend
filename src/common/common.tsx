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

interface Instruction {
  id: number;
  name: string;
}

interface ListItem {
  name: string;
  id: number;
}

interface RecipeIface {
  id: number;
  title: string;
  description: string | null;
  ingredients: number[] | null;
  instructions: string[] | null;
  tags: number[] | null;
  image: string | null;
  portions: number | null;
  created_at: string | null;
  updated_at: string | null;
  meal_type: string | null;
  user_id: number | null;
  link: string | null;
  is_external: boolean | null;
}

enum Icon {
  Delete = "🗑",
  Add = "+",
  Minus = "−",
  Remove = "➖",
  Close = "✖︎",
  Check = "✔︎",
  ChevronLeft = "◀",
  ChevronRight = "▶",
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
  Calendar = "📆",
  Back = "←",
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
  { name: "blue", css: "var(--color-microsoft-blue)" },
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
  QUERY_ERROR = 451,
  PLACEHOLDER_4 = 452,
  PLACEHOLDER_5 = 453,
  DEFAULT = 400,
}

enum PopUpFunctions {
  GO_BACK = "GO_BACK",
  GO_TO_RECIPE = "GO_TO_RECIPE",
  GO_TO_RECIPES = "GO_TO_RECIPES",
  GO_TO_NEW_RECIPE = "GO_TO_NEW_RECIPE",
  GO_TO_NEW_EXTERNAL_RECIPE = "GO_TO_NEW_EXTERNAL_RECIPE",
  DELETE_FUNCTION = "DELETE_FUNCTION",
  DELETE_EXTERNAL_FUNCTION = "DELETE_EXTERNAL_FUNCTION",
  CLEAR_SHOPPING_LIST = "CLEAR_SHOPPING_LIST",
  HOME = "HOME",
  RELOAD = "RELOAD",
  CLOSE = "CLOSE",
  CLOSE_AND_REFRESH_RECIPES = "CLOSE_AND_REFRESH_RECIPES",
}

export type {
  AutocompleteOption,
  Ingredient,
  Instruction,
  ListItem,
  User,
  RecipeIface,
};
export { Icon, Colors, Capitalize, ErrorCodes, PopUpFunctions };
