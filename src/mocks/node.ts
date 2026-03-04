import { setupServer } from "msw/node";

import { characters } from "./handlers/rick-and-morty";
import { supabaseAuth } from "./handlers/supabase";

export const server = setupServer(...characters, ...supabaseAuth);
