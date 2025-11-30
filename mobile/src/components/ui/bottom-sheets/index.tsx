// lib/sheets.ts  (or wherever you keep this)

import React from "react";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";

import ResetPasswordBottomSheet, {
  ResetPasswordSheetDefinition,
} from "./reset-password";
import EventFiltersSheet from "./event-filters-sheet";


// Register all sheets
const sheets: Record<string, React.ElementType> = {
  "reset-password": ResetPasswordBottomSheet,
  "event-filters": EventFiltersSheet, // ← ADD THIS
};
// Auto-register on app start
(() => {
  Object.entries(sheets).forEach(([id, sheetComponent]) => {
    registerSheet(id, sheetComponent);
  });
})();

// Extend the global Sheets type so TypeScript knows about your sheets
declare module "react-native-actions-sheet" {
  interface Sheets {
    "reset-password": ResetPasswordSheetDefinition;
    "event-filters": {
      payload: {
        selectedTags: string[];
        onToggleTag: (tag: string) => void;
        onClear: () => void;
        onClose?: () => void;
      };
    };
  }
}

export type { SheetDefinition };
