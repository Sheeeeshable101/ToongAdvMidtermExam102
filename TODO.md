# Dark/Light Theme Enhancement Plan

**Current State:**

- Theme hooks (useColorScheme, useThemeColor) and Themed components ready.
- Hardcoded colors in index.tsx, borrow.tsx, return.tsx styles need replacement with theme colors.

**Information Gathered:**

- index.tsx: statCard rgba(blue), cdCard rgba(blue-dark), borrowedCard rgba(red), overdueText #ef4444.
- borrow.tsx: cdCard rgba(blue-dark), selectedCard rgba(blue)+border, input rgba(dark), button #1e3a8a white text, selectedContainer rgba(blue).
- return.tsx: borrowedCard rgba(red), selectedCard border blue, overdueText rgba(red) #ef4444, button #1e3a8a white, selectedContainer rgba(blue).
- All use simple hooks already (colorScheme, Colors, Themed\*).

**Plan:**

1. Extend constants/theme.ts: Add primary, primaryLight, secondary, error, errorLight, border, cardBg, buttonBg/primary, inputBg.
2. Update styles in app/(tabs)/index.tsx, borrow.tsx, return.tsx to use these (e.g., backgroundColor: useThemeColor({}, 'primary')) but since StyleSheet static, define dynamic styles with useColorScheme inside components.
3. Ensure shadows/opacity adapt (keep shadowColor #000 as standard).

**Dependent Files:**

- constants/theme.ts (extend colors)
- app/(tabs)/index.tsx (dynamic styles for statCard, cdCard etc.)
- app/(tabs)/borrow.tsx
- app/(tabs)/return.tsx

**Followup steps:**

1. Edit theme.ts
2. Refactor styles in screens to dynamic objects using useColorScheme/useThemeColor.
3. Test with `npx expo start --clear` and toggle device theme.

Approve this plan to proceed? Any specific colors/preferences?
