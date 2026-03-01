## ADDED Requirements

### Requirement: Fetch characters from Rick and Morty API
The system SHALL fetch character data from `https://rickandmortyapi.com/api/character` to use as card images. The system SHALL retrieve a random subset of characters for each game session.

#### Scenario: Successful character fetch
- **WHEN** the game page loads
- **THEN** the system fetches characters via TanStack Query, maps them to domain `Character` entities (id, name, imageUrl), and makes them available to the board generator

#### Scenario: API fetch fails
- **WHEN** the Rick and Morty API is unreachable or returns an error
- **THEN** the system SHALL display an error message with a retry option

### Requirement: Board generation with shuffled pairs
The system SHALL generate a game board by selecting N characters, duplicating each to form pairs, and shuffling the resulting cards using the Fisher-Yates algorithm. Each card SHALL have a unique `id` and a shared `pairId` for matching.

#### Scenario: Board created with 6 pairs (12 cards)
- **WHEN** the game starts with 6 characters fetched
- **THEN** the system creates 12 cards (6 pairs), each pair sharing the same `pairId`, shuffled in random order

### Requirement: Card preview phase
The system SHALL show all cards face-up for 3 seconds at the start of the game, then flip them all face-down. No interaction SHALL be allowed during the preview phase.

#### Scenario: Game starts with preview
- **WHEN** the game transitions from idle to preview phase
- **THEN** all cards are displayed face-up for exactly 3 seconds, card clicks are ignored, and after 3 seconds all cards flip face-down and the game transitions to the playing phase

### Requirement: Card flip and comparison
The system SHALL allow the player to flip two cards per turn. When two cards are flipped, the system SHALL compare their `pairId` values.

#### Scenario: Player flips first card
- **WHEN** the player clicks a face-down card during the playing phase with fewer than 2 cards flipped
- **THEN** the card flips face-up revealing the character image

#### Scenario: Player flips second card — match
- **WHEN** the player flips a second card and its `pairId` matches the first card's `pairId`
- **THEN** both cards remain visible for 1 second, then are removed from the board, and the match counter increases by 1

#### Scenario: Player flips second card — no match
- **WHEN** the player flips a second card and its `pairId` does not match the first card's `pairId`
- **THEN** both cards remain visible for 1 second, then both flip back face-down

#### Scenario: Player clicks during comparison
- **WHEN** the player clicks a card while two cards are already being compared (during the 1-second reveal)
- **THEN** the click SHALL be ignored

#### Scenario: Player clicks an already matched or face-up card
- **WHEN** the player clicks a card that is already face-up or has been removed
- **THEN** the click SHALL be ignored

### Requirement: Turn counter
The system SHALL count each attempt (each time the player flips a second card) as one turn, regardless of whether the cards match.

#### Scenario: Turn increments on second flip
- **WHEN** the player flips the second card in a turn
- **THEN** the turn counter increases by 1

### Requirement: Match counter
The system SHALL count the number of successfully matched pairs.

#### Scenario: Match counter increments on match
- **WHEN** two flipped cards match
- **THEN** the match counter increases by 1

### Requirement: Game completion
The system SHALL detect when all pairs have been matched and transition to the completed phase. The system SHALL display a congratulations message with the total number of turns taken.

#### Scenario: All pairs matched
- **WHEN** the last pair is matched (match counter equals total pair count)
- **THEN** the game transitions to the completed phase and displays a modal with "¡Felicitaciones!", the total turn count, and two action buttons

### Requirement: Replay game
The system SHALL allow the player to restart the game from the completion screen. Replaying SHALL fetch new characters, regenerate the board, and reset all counters.

#### Scenario: Player clicks Replay
- **WHEN** the player clicks the "Jugar de nuevo" button on the completion screen
- **THEN** the game resets to idle, fetches new characters, generates a new shuffled board, resets turn and match counters to 0, and starts the preview phase

### Requirement: Return to home
The system SHALL allow the player to navigate back to the main view from the completion screen.

#### Scenario: Player clicks Home
- **WHEN** the player clicks the "Inicio" button on the completion screen
- **THEN** the user is navigated to the home/main route

### Requirement: Game state machine
The game SHALL follow a strict state machine with four phases: `idle`, `preview`, `playing`, `completed`. Transitions SHALL be enforced — actions not valid in the current phase SHALL be ignored.

#### Scenario: State transitions are enforced
- **WHEN** a `flipCard` action is dispatched during the `preview` phase
- **THEN** the action is ignored and the state remains unchanged

#### Scenario: Full game lifecycle
- **WHEN** the game progresses through idle → preview → playing (multiple turns) → completed
- **THEN** each phase transition follows the defined rules and counters reflect accurate totals
