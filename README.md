# 14-0: The IPL Challenge

A self-contained browser game implementation of the PRD in `The IPL Challenge PRD.pdf`.

## Run

Open `index.html` directly in a browser, or serve this folder with any static server.

The app stores leaderboard, hall of fame, statistics, settings, and achievements in browser `localStorage` under `ipl-challenge-v1`.

## Implemented PRD Coverage

- Player identity screen with name, team name, game mode, leaderboard, hall of fame, statistics, and settings.
- 11-round constrained draft with random franchise/season boards, five-player choices, global player uniqueness, and lost-board-player scarcity.
- Team composition validation for batting, bowling, wicketkeeper, captain, and Realist Mode overseas cap.
- Knowledge Mode with hidden draft ratings.
- Chemistry and captaincy systems feeding match simulation.
- Season preview with team analysis, strengths, weaknesses, win probability, and power ranking.
- 14-match simulated IPL league journey against projected IPL 2026 team profiles.
- Pitch system, pressure stages, persistent tournament progress banner, record tracker, and match result cards.
- Results, awards, grades, achievements, 14-0 leaderboard, hall of fame, and statistics.
- Responsive dark broadcast-style UI with gold accents and motion setting.
