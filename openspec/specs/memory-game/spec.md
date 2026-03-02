## MODIFIED Requirements

### Requirement: Board generation with shuffled pairs
The system SHALL generate a game board by selecting N characters, duplicating each to form pairs, and shuffling the resulting cards using the Fisher-Yates algorithm. Each card SHALL have a unique `id` and a shared `pairId` for matching. The board SHALL render 12 visible cards in a 4-column responsive grid with proper dimensions.

#### Scenario: Board created with 6 pairs (12 cards)
- **WHEN** the game starts with 6 characters fetched
- **THEN** the system creates 12 cards (6 pairs), each pair sharing the same `pairId`, shuffled in random order, and all cards are visible in the grid with proper sizing

#### Scenario: Cards are visible during preview
- **WHEN** the game is in preview phase
- **THEN** all 12 cards SHALL be rendered face-up showing character images with names, using 3D flip CSS transforms that work in Tailwind CSS 4

### Requirement: Card flip and comparison
The system SHALL allow the player to flip two cards per turn. Cards SHALL use 3D CSS transforms (`perspective`, `transform-style: preserve-3d`, `backface-visibility: hidden`, `rotateY`) for flip animation. The card back SHALL show a teal gradient with "?" and the front SHALL show the character image.

#### Scenario: Card renders with proper 3D flip
- **WHEN** a card is rendered on the board
- **THEN** the card button has `perspective`, the inner container has `transform-style: preserve-3d`, both faces have `backface-visibility: hidden`, and the front face is rotated 180 degrees on the Y axis

#### Scenario: Player flips first card
- **WHEN** the player clicks a face-down card during the playing phase with fewer than 2 cards flipped
- **THEN** the card flips face-up revealing the character image with a smooth 3D rotation animation

#### Scenario: Player flips second card — match
- **WHEN** the player flips a second card and its `pairId` matches the first card's `pairId`
- **THEN** both cards remain visible for 1 second, then are marked as matched, and the match counter increases by 1

#### Scenario: Player flips second card — no match
- **WHEN** the player flips a second card and its `pairId` does not match the first card's `pairId`
- **THEN** both cards remain visible for 1 second, then both flip back face-down

### Requirement: Fetch characters from Rick and Morty API
The system SHALL fetch character data from `https://rickandmortyapi.com/api/character` to use as card images. The system SHALL retrieve a random subset of characters for each game session. The API response handler SHALL correctly parse both array responses (multiple characters) and single object responses.

#### Scenario: Successful character fetch
- **WHEN** the game page loads
- **THEN** the system fetches 6 random characters via TanStack Query, maps them to domain `Character` entities (id, name, imageUrl), generates the board, and starts the preview phase

#### Scenario: API fetch fails
- **WHEN** the Rick and Morty API is unreachable or returns an error
- **THEN** the system SHALL display an error message with a retry button
