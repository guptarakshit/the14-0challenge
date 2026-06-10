(function () {
  "use strict";

  var data = window.IPL_DATA;
  var engine = window.IPL_ENGINE;
  var storage = window.IPL_STORAGE;
  var app = document.getElementById("app");

  var state = {
    screen: "identity",
    playerName: "",
    teamName: "",
    mode: "classic",
    draft: null,
    captainId: null,
    schedule: [],
    results: [],
    lastResult: null,
    run: null,
    savedRunId: null,
    hallSearch: "",
    hallFilter: "all"
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function pct(value) {
    return Math.round(value) + "%";
  }

  function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function modeLabel(modeId) {
    return engine.getMode(modeId).label;
  }

  function selectedPlayers() {
    return state.draft ? engine.getPlayers(state.draft.selectedIds) : [];
  }

  function selectedNames() {
    var names = {};
    selectedPlayers().forEach(function (player) { names[player.name] = true; });
    return names;
  }

  function currentRecord() {
    var wins = state.results.filter(function (result) { return result.playerWon; }).length;
    return { wins: wins, losses: state.results.length - wins };
  }

  function iconText(label) {
    return '<span class="button-label">' + label + '</span>';
  }

  function renderTopBar() {
    var store = storage.readStore();
    var draftActive = state.draft && ["draft", "captain", "preview", "season", "results"].indexOf(state.screen) >= 0;
    var record = currentRecord();
    return [
      '<header class="topbar">',
      '<button class="brand-button" data-action="home" type="button">',
      '<span class="brand-mark">14-0</span><span><strong>The IPL Challenge</strong><small>Premium draft simulator</small></span>',
      '</button>',
      draftActive ? renderTournamentBanner() : '<div class="topbar-spacer"></div>',
      '<nav class="nav-actions" aria-label="Primary">',
      '<button class="ghost" data-action="leaderboard" type="button">' + iconText("Leaderboard") + '</button>',
      '<button class="ghost" data-action="hall" type="button">' + iconText("Hall") + '</button>',
      '<button class="ghost" data-action="stats" type="button">' + iconText("Stats") + '</button>',
      '<button class="ghost icon-button" data-action="settings" type="button" title="Settings" aria-label="Settings"><span class="gear-icon" aria-hidden="true">&#9881;</span></button>',
      '</nav>',
      draftActive ? '<div class="record-ticker"><span>Record</span><strong>' + record.wins + '-' + record.losses + '</strong></div>' : '',
      store.settings.animations ? '' : '<span class="motion-chip">Motion Reduced</span>',
      '</header>'
    ].join("");
  }

  function renderTournamentBanner() {
    if (!state.schedule.length) {
      return '<div class="progress-banner"><span class="progress-chip upcoming">Draft</span></div>';
    }
    return [
      '<div class="progress-banner" aria-label="Tournament progress">',
      state.schedule.map(function (match, index) {
        var result = state.results[index];
        var status = result ? (result.playerWon ? "W" : "L") : "?";
        var className = result ? (result.playerWon ? "win" : "loss") : "upcoming";
        return '<span class="progress-chip ' + className + '">' + escapeHtml(match.opponentCode) + ' <b>' + status + '</b></span>';
      }).join(""),
      '</div>'
    ].join("");
  }

  function render() {
    var store = storage.readStore();
    document.body.classList.toggle("reduce-motion", !store.settings.animations);
    app.innerHTML = [
      '<div class="app-shell">',
      renderTopBar(),
      '<main class="screen">',
      renderScreen(),
      '</main>',
      '</div>'
    ].join("");
  }

  function renderScreen() {
    if (state.screen === "draft") return renderDraft();
    if (state.screen === "captain") return renderCaptain();
    if (state.screen === "preview") return renderPreview();
    if (state.screen === "season") return renderSeason();
    if (state.screen === "results") return renderResults();
    if (state.screen === "leaderboard") return renderLeaderboard();
    if (state.screen === "hall") return renderHall();
    if (state.screen === "stats") return renderStats();
    if (state.screen === "settings") return renderSettings();
    return renderIdentity();
  }

  function renderIdentity() {
    var modes = data.modes.map(function (mode) {
      var active = state.mode === mode.id ? " active" : "";
      return [
        '<button class="mode-card' + active + '" type="button" data-action="mode" data-mode="' + mode.id + '">',
        '<span>' + escapeHtml(mode.label) + '</span>',
        '<small>' + escapeHtml(mode.description) + '</small>',
        '</button>'
      ].join("");
    }).join("");

    return [
      '<section class="identity-layout">',
      '<div class="identity-panel panel">',
      '<h1>Build the greatest IPL XI ever assembled.</h1>',
      '<div class="form-grid">',
      '<label>Player Name<input data-field="playerName" value="' + escapeHtml(state.playerName) + '" maxlength="32" placeholder="Your name"></label>',
      '<label>Team Name<input data-field="teamName" value="' + escapeHtml(state.teamName) + '" maxlength="38" placeholder="Jaipur Titans"></label>',
      '</div>',
      '<div class="mode-grid" role="group" aria-label="Game mode">' + modes + '</div>',
      '<div class="action-row">',
      '<button class="primary" data-action="start-draft" type="button">Start Draft</button>',
      '<button class="secondary" data-action="leaderboard" type="button">Leaderboard</button>',
      '<button class="secondary" data-action="hall" type="button">Hall of Fame</button>',
      '<button class="secondary" data-action="stats" type="button">Statistics</button>',
      '<button class="secondary" data-action="settings" type="button">Settings</button>',
      '</div>',
      '</div>',
      '<aside class="broadcast-panel">',
      '<div class="pitch-visual" aria-hidden="true">',
      '<div class="pitch-lights"></div><div class="boundary"></div><div class="square"></div><div class="crease one"></div><div class="crease two"></div>',
      '</div>',
      '<div class="scorebug">',
      '<span>Target</span><strong>14-0</strong><small>Immortality requires a perfect league journey.</small>',
      '</div>',
      '</aside>',
      '</section>'
    ].join("");
  }

  function renderDraft() {
    var drafted = selectedPlayers();
    var board = state.draft.board;
    var composition = engine.getTeamComposition(drafted);
    var round = drafted.length + 1;
    var options = engine.getPlayers(board.options);
    return [
      '<section class="draft-layout">',
      '<aside class="panel draft-side">',
      '<div class="section-title"><span>Draft Board</span><strong>Round ' + round + '/11</strong></div>',
      renderComposition(composition),
      '<div class="mini-stat"><span>Lost forever</span><strong>' + state.draft.lostNames.length + '</strong></div>',
      '<div class="mini-stat"><span>Mode</span><strong>' + escapeHtml(modeLabel(state.mode)) + '</strong></div>',
      renderDraftedList(drafted),
      '</aside>',
      '<div class="draft-main">',
      '<div class="board-header panel">',
      '<div><div class="eyebrow">Random board</div><h2>' + escapeHtml(board.franchise) + ' ' + board.season + '</h2><p>' + escapeHtml(board.note) + '</p></div>',
      '<div class="round-meter"><span>Pick</span><strong>' + round + '</strong></div>',
      '</div>',
      '<div class="choice-grid">',
      options.map(function (player) { return renderPlayerChoice(player); }).join(""),
      '</div>',
      '</div>',
      '</section>'
    ].join("");
  }

  function renderComposition(composition) {
    var items = [
      { label: "Batting", value: composition.batting + "/5", ok: composition.batting >= 5 },
      { label: "Bowling", value: composition.bowling + "/5", ok: composition.bowling >= 5 },
      { label: "Keeper", value: composition.wicketkeepers + "/1", ok: composition.wicketkeepers >= 1 },
      { label: "Overseas", value: composition.overseas + (state.mode === "realist" ? "/4" : ""), ok: state.mode !== "realist" || composition.overseas <= 4 }
    ];
    return '<div class="composition-grid">' + items.map(function (item) {
      return '<div class="' + (item.ok ? "ok" : "need") + '"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderDraftedList(players) {
    if (!players.length) return '<div class="empty-slot">No players drafted yet.</div>';
    return '<ol class="drafted-list">' + players.map(function (player) {
      return '<li><span>' + escapeHtml(player.name) + '</span><small>' + player.franchise + ' ' + player.season + '</small></li>';
    }).join("") + '</ol>';
  }

  function renderPlayerChoice(player) {
    var knowledge = state.mode === "knowledge";
    var traits = [];
    if (engine.isBattingOption(player)) traits.push("BAT");
    if (engine.isBowlingOption(player)) traits.push("BOWL");
    if (player.wicketkeeper) traits.push("WK");
    if (player.overseas) traits.push("OS");
    var canPick = engine.selectionKeepsTeamPossible(state.draft.selectedIds, player, state.mode);
    return [
      '<article class="player-card tier-' + player.tier.toLowerCase() + '">',
      '<div class="card-top"><span class="tier">' + (knowledge ? "?" : player.tier) + '</span><span>' + escapeHtml(player.franchise) + ' ' + player.season + '</span></div>',
      '<h3>' + escapeHtml(player.name) + '</h3>',
      '<p>' + escapeHtml(player.role) + '</p>',
      '<div class="trait-row">' + traits.map(function (trait) { return '<span>' + trait + '</span>'; }).join("") + '</div>',
      knowledge ? renderKnowledgeProfile(player) : renderRatingBars(player),
      '<button class="primary full" data-action="pick-player" data-player-id="' + player.id + '" type="button"' + (canPick ? "" : " disabled") + '>' + (canPick ? "Draft Player" : "Invalid Balance") + '</button>',
      '</article>'
    ].join("");
  }

  function renderKnowledgeProfile(player) {
    var clue = player.overseas ? "Overseas memory card" : "Indian core card";
    return [
      '<div class="knowledge-profile">',
      '<span>' + clue + '</span>',
      '<strong>' + (player.wicketkeeper ? "Keeps wickets" : player.style === "none" ? "Specialist bat" : player.style + " option") + '</strong>',
      '<small>Ratings hidden in Knowledge Mode</small>',
      '</div>'
    ].join("");
  }

  function renderRatingBars(player) {
    var ratings = [
      ["BAT", player.batting],
      ["BOWL", player.bowling],
      ["FLD", player.fielding],
      ["LEAD", player.leadership]
    ];
    return '<div class="rating-stack">' + ratings.map(function (rating) {
      return '<div><span>' + rating[0] + '</span><meter min="0" max="100" value="' + rating[1] + '"></meter><b>' + rating[1] + '</b></div>';
    }).join("") + '</div>';
  }

  function renderCaptain() {
    var players = selectedPlayers();
    var composition = engine.getTeamComposition(players);
    var valid = engine.isValidTeam(players, state.mode);
    return [
      '<section class="captain-layout">',
      '<div class="panel">',
      '<div class="section-title"><span>Captain Selection</span><strong>' + (valid ? "Valid XI" : "Balance Warning") + '</strong></div>',
      renderComposition(composition),
      '<div class="captain-grid">',
      players.map(function (player) {
        var active = state.captainId === player.id ? " active" : "";
        return [
          '<button class="captain-card' + active + '" type="button" data-action="select-captain" data-player-id="' + player.id + '">',
          '<span>' + escapeHtml(player.name) + '</span>',
          '<small>' + escapeHtml(player.role) + '</small>',
          '<strong>Leadership ' + player.leadership + '</strong>',
          '</button>'
        ].join("");
      }).join(""),
      '</div>',
      '<div class="action-row">',
      '<button class="secondary" data-action="back-to-draft" type="button">Back</button>',
      '<button class="primary" data-action="season-preview" type="button"' + (state.captainId && valid ? "" : " disabled") + '>Season Preview</button>',
      '</div>',
      '</div>',
      '</section>'
    ].join("");
  }

  function renderPreview() {
    var players = selectedPlayers();
    var captain = engine.getPlayerById(state.captainId);
    var analysis = engine.previewAnalysis(players, captain, state.schedule, state.mode);
    return [
      '<section class="preview-grid">',
      '<div class="panel preview-hero">',
      '<div class="eyebrow">Season Preview</div>',
      '<h2>' + escapeHtml(state.teamName) + '</h2>',
      '<div class="preview-score"><span>Team Rating</span><strong>' + analysis.ratings.overall + '</strong></div>',
      '<div class="preview-metrics">',
      '<div><span>Win Probability</span><strong>' + analysis.averageWinProbability + '%</strong></div>',
      '<div><span>Power Ranking</span><strong>#' + analysis.powerRanking + '</strong></div>',
      '<div><span>Expected Wins</span><strong>' + analysis.expectedWins.toFixed(1) + '</strong></div>',
      '</div>',
      '</div>',
      '<div class="panel"><div class="section-title"><span>Strengths</span></div>' + renderCategoryList(analysis.strengths) + '</div>',
      '<div class="panel"><div class="section-title"><span>Weaknesses</span></div>' + renderCategoryList(analysis.weaknesses) + '</div>',
      '<div class="panel"><div class="section-title"><span>Chemistry</span></div>' + renderChemistry(analysis.ratings.chemistryPairs) + '</div>',
      '<div class="panel schedule-panel"><div class="section-title"><span>League Journey</span><strong>14 matches</strong></div>' + renderScheduleList() + '</div>',
      '<div class="action-row wide">',
      '<button class="secondary" data-action="captain" type="button">Captain</button>',
      '<button class="primary" data-action="start-season" type="button">Start IPL Journey</button>',
      '</div>',
      '</section>'
    ].join("");
  }

  function renderCategoryList(items) {
    return '<div class="category-list">' + items.map(function (item) {
      return '<div><span>' + escapeHtml(item.label) + '</span><meter min="0" max="100" value="' + item.value + '"></meter><strong>' + Math.round(item.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderChemistry(pairs) {
    if (!pairs.length) return '<p class="muted">No known partnerships activated.</p>';
    return '<div class="chemistry-list">' + pairs.map(function (pair) {
      return '<span>' + escapeHtml(pair.label) + ' +' + pair.bonus + '</span>';
    }).join("") + '</div>';
  }

  function renderScheduleList() {
    return '<ol class="schedule-list">' + state.schedule.map(function (match) {
      var opponent = engine.getOpponent(match.opponentCode);
      return '<li><span>M' + match.matchNumber + '</span><strong>' + escapeHtml(match.opponentCode) + '</strong><small>' + escapeHtml(match.pitch) + ' at ' + escapeHtml(opponent.homeGround) + '</small></li>';
    }).join("") + '</ol>';
  }

  function renderSeason() {
    var record = currentRecord();
    var nextMatch = state.schedule[state.results.length];
    var stage = engine.pressureStage(record.wins, record.losses);
    if (!nextMatch) {
      buildRun();
      state.screen = "results";
      return renderResults();
    }
    var opponent = engine.getOpponent(nextMatch.opponentCode);
    var pitch = engine.getPitch(nextMatch.pitch);
    return [
      '<section class="season-layout">',
      '<div class="season-main panel ' + stage.level + '">',
      '<div class="section-title"><span>Match ' + nextMatch.matchNumber + '</span><strong>' + escapeHtml(stage.label) + '</strong></div>',
      '<div class="matchup">',
      '<div><span>' + escapeHtml(state.teamName) + '</span><strong>' + record.wins + '-' + record.losses + '</strong></div>',
      '<b>vs</b>',
      '<div><span>' + escapeHtml(opponent.name) + '</span><strong>' + escapeHtml(opponent.code) + '</strong></div>',
      '</div>',
      '<div class="match-details">',
      '<div><span>Venue</span><strong>' + escapeHtml(opponent.homeGround) + '</strong></div>',
      '<div><span>Pitch</span><strong>' + escapeHtml(pitch.type) + '</strong></div>',
      '<div><span>Opponent Form</span><strong>' + opponent.ratings.form + '</strong></div>',
      '</div>',
      '<div class="opponent-profile">',
      opponent.strengthProfile.map(function (strength) { return '<span>' + escapeHtml(strength) + '</span>'; }).join(""),
      '</div>',
      '<button class="primary simulate-button" data-action="simulate-match" type="button">Simulate Match</button>',
      '</div>',
      '<aside class="panel journey-panel">',
      '<div class="record-display"><span>Record Tracker</span><strong>' + record.wins + '-' + record.losses + '</strong><small>' + escapeHtml(stage.label) + '</small></div>',
      renderLastResult(),
      '</aside>',
      '</section>'
    ].join("");
  }

  function renderLastResult() {
    var result = state.lastResult;
    if (!result) return '<div class="empty-slot">Awaiting first match.</div>';
    return [
      '<article class="result-card ' + (result.playerWon ? "won" : "lost") + '">',
      '<div class="eyebrow">Match Complete</div>',
      '<h3>' + (result.playerWon ? "Victory" : "Defeat") + '</h3>',
      '<div class="innings"><span>' + escapeHtml(result.playerInnings.name) + '</span><strong>' + result.playerInnings.runs + '/' + result.playerInnings.wickets + '</strong></div>',
      '<div class="innings"><span>' + escapeHtml(result.opponentInnings.name) + '</span><strong>' + result.opponentInnings.runs + '/' + result.opponentInnings.wickets + '</strong></div>',
      '<p>' + escapeHtml(result.margin) + '</p>',
      '<small>Win model: ' + result.probability + '% before variance</small>',
      '</article>'
    ].join("");
  }

  function renderResults() {
    if (!state.run) buildRun();
    var run = state.run;
    return [
      '<section class="results-layout">',
      '<div class="panel results-hero ' + (run.wins === 14 && run.losses === 0 ? "immortal" : "") + '">',
      '<div class="eyebrow">Final Record</div>',
      '<h2>' + run.wins + '-' + run.losses + '</h2>',
      '<strong class="grade">' + escapeHtml(run.grade) + '</strong>',
      '<p>' + escapeHtml(run.teamName) + ' captained by ' + escapeHtml(run.captain) + '</p>',
      '<div class="action-row">',
      '<button class="primary" data-action="save-results" type="button"' + (state.savedRunId === run.id ? " disabled" : "") + '>' + (state.savedRunId === run.id ? "Saved" : "Save Results") + '</button>',
      '<button class="secondary" data-action="new-run" type="button">New Run</button>',
      '</div>',
      '</div>',
      '<div class="panel"><div class="section-title"><span>Awards</span></div>' + renderAwards(run.awards) + '</div>',
      '<div class="panel"><div class="section-title"><span>Achievements</span></div>' + renderRunAchievements(run.achievements) + '</div>',
      '<div class="panel final-xi"><div class="section-title"><span>Final XI</span><strong>Rating ' + run.teamRating + '</strong></div>' + renderFinalXI(run.finalXI) + '</div>',
      '<div class="panel"><div class="section-title"><span>Match Results</span></div>' + renderResultTimeline(run.results) + '</div>',
      '</section>'
    ].join("");
  }

  function renderAwards(awards) {
    return '<div class="award-grid">' + awards.map(function (award) {
      return '<div><span>' + escapeHtml(award.label) + '</span><strong>' + escapeHtml(award.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderRunAchievements(ids) {
    if (!ids.length) return '<p class="muted">No achievements unlocked on this run.</p>';
    return '<div class="achievement-list">' + ids.map(function (id) {
      var item = storage.achievementCatalog.find(function (achievement) { return achievement.id === id; });
      return '<span>' + escapeHtml(item ? item.name : id) + '</span>';
    }).join("") + '</div>';
  }

  function renderFinalXI(players) {
    return '<ol class="final-list">' + players.map(function (player) {
      return '<li><span>' + escapeHtml(player.name) + '</span><small>' + player.franchise + ' ' + player.season + ' | ' + player.role + '</small></li>';
    }).join("") + '</ol>';
  }

  function renderResultTimeline(results) {
    return '<div class="timeline">' + results.map(function (result) {
      return '<div class="' + (result.playerWon ? "win" : "loss") + '"><span>M' + result.matchNumber + ' ' + result.opponentCode + '</span><strong>' + (result.playerWon ? "W" : "L") + '</strong><small>' + escapeHtml(result.margin) + '</small></div>';
    }).join("") + '</div>';
  }

  function renderLeaderboard() {
    var store = storage.readStore();
    var rows = store.leaderboard;
    return [
      '<section class="panel data-view">',
      '<div class="section-title"><span>Global 14-0 Leaderboard</span><strong>' + rows.length + ' entries</strong></div>',
      rows.length ? '<div class="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th>Team</th><th>Captain</th><th>Mode</th><th>Rating</th><th>Date</th></tr></thead><tbody>' + rows.map(function (row, index) {
        return '<tr><td>' + (index + 1) + '</td><td>' + escapeHtml(row.playerName) + '</td><td>' + escapeHtml(row.teamName) + '</td><td>' + escapeHtml(row.captain) + '</td><td>' + escapeHtml(modeLabel(row.mode)) + '</td><td>' + row.teamRating + '</td><td>' + formatDate(row.date) + '</td></tr>';
      }).join("") + '</tbody></table></div>' : '<div class="empty-slot">No undefeated teams yet.</div>',
      '</section>'
    ].join("");
  }

  function renderHall() {
    var store = storage.readStore();
    var query = state.hallSearch.toLowerCase();
    var rows = store.hallOfFame.filter(function (run) {
      var matchesSearch = !query || [run.playerName, run.teamName, run.captain, run.mode].join(" ").toLowerCase().indexOf(query) >= 0;
      var matchesFilter = state.hallFilter === "all" || run.wins === Number(state.hallFilter);
      return matchesSearch && matchesFilter;
    });
    return [
      '<section class="panel data-view">',
      '<div class="section-title"><span>Hall of Fame</span><strong>' + rows.length + ' runs</strong></div>',
      '<div class="filter-row">',
      '<input data-field="hallSearch" value="' + escapeHtml(state.hallSearch) + '" placeholder="Search runs">',
      '<select data-field="hallFilter">',
      ['all', '14', '13', '12', '11', '10'].map(function (filter) {
        var label = filter === 'all' ? 'All records' : filter + ' wins';
        return '<option value="' + filter + '"' + (state.hallFilter === filter ? " selected" : "") + '>' + label + '</option>';
      }).join(""),
      '</select>',
      '</div>',
      rows.length ? '<div class="run-grid">' + rows.map(renderRunSummary).join("") + '</div>' : '<div class="empty-slot">No completed runs match the filter.</div>',
      '</section>'
    ].join("");
  }

  function renderRunSummary(run) {
    return [
      '<article class="run-card">',
      '<div><span>' + escapeHtml(run.teamName) + '</span><strong>' + run.wins + '-' + run.losses + '</strong></div>',
      '<p>' + escapeHtml(run.playerName) + ' | ' + escapeHtml(run.captain) + '</p>',
      '<small>' + escapeHtml(modeLabel(run.mode)) + ' | Rating ' + run.teamRating + ' | ' + formatDate(run.date) + '</small>',
      '</article>'
    ].join("");
  }

  function renderStats() {
    var stats = storage.computedStats();
    var store = storage.readStore();
    var visibleAchievements = storage.achievementCatalog.map(function (achievement) {
      var unlocked = Boolean(store.achievements[achievement.id]);
      var name = achievement.hidden && !unlocked ? "Hidden Achievement" : achievement.name;
      var description = achievement.hidden && !unlocked ? "Complete special runs to reveal." : achievement.description;
      return '<div class="' + (unlocked ? "unlocked" : "locked") + '"><span>' + escapeHtml(name) + '</span><small>' + escapeHtml(description) + '</small></div>';
    }).join("");
    var cards = [
      ["Total Drafts", stats.totalDrafts],
      ["Average Wins", stats.averageWins],
      ["Highest Win Total", stats.highestWinTotal],
      ["Most Drafted Player", stats.mostDraftedPlayer + " (" + stats.mostDraftedCount + ")"],
      ["Most Successful Captain", stats.mostSuccessfulCaptain + " (" + stats.mostSuccessfulCaptainWins + ")"],
      ["Most Successful Franchise", stats.mostSuccessfulFranchise + " (" + stats.mostSuccessfulFranchiseWins + ")"],
      ["Most Successful Chemistry Pair", stats.mostSuccessfulChemistryPair + " (" + stats.mostSuccessfulChemistryWins + ")"],
      ["Total 14-0 Runs", stats.totalPerfectRuns]
    ];
    return [
      '<section class="stats-layout">',
      '<div class="panel data-view">',
      '<div class="section-title"><span>Statistics</span></div>',
      '<div class="stat-grid">' + cards.map(function (card) {
        return '<div><span>' + escapeHtml(card[0]) + '</span><strong>' + escapeHtml(card[1]) + '</strong></div>';
      }).join("") + '</div>',
      '</div>',
      '<div class="panel data-view">',
      '<div class="section-title"><span>Achievements</span></div>',
      '<div class="all-achievements">' + visibleAchievements + '</div>',
      '</div>',
      '</section>'
    ].join("");
  }

  function renderSettings() {
    var store = storage.readStore();
    return [
      '<section class="panel settings-view">',
      '<div class="section-title"><span>Settings</span></div>',
      '<label class="toggle-row"><span>Smooth Animations</span><input type="checkbox" data-field="animations" ' + (store.settings.animations ? "checked" : "") + '></label>',
      '<div class="action-row">',
      '<button class="danger" data-action="clear-storage" type="button">Reset Local Data</button>',
      '<button class="secondary" data-action="home" type="button">Done</button>',
      '</div>',
      '</section>'
    ].join("");
  }

  function startDraft() {
    var playerName = state.playerName.trim() || "Anonymous";
    var teamName = state.teamName.trim() || "Jaipur Titans";
    state.playerName = playerName;
    state.teamName = teamName;
    state.draft = {
      selectedIds: [],
      lostNames: [],
      history: [],
      board: null
    };
    state.captainId = null;
    state.schedule = [];
    state.results = [];
    state.lastResult = null;
    state.run = null;
    state.savedRunId = null;
    storage.recordDraftStart();
    state.draft.board = engine.generateDraftBoard(state.draft.selectedIds, state.draft.lostNames, state.mode);
    state.screen = "draft";
    render();
  }

  function pickPlayer(playerId) {
    var player = engine.getPlayerById(playerId);
    if (!player || !engine.selectionKeepsTeamPossible(state.draft.selectedIds, player, state.mode)) return;
    var boardPlayers = engine.getPlayers(state.draft.board.options);
    state.draft.selectedIds.push(player.id);
    boardPlayers.forEach(function (option) {
      if (option.name !== player.name && state.draft.lostNames.indexOf(option.name) < 0) {
        state.draft.lostNames.push(option.name);
      }
    });
    state.draft.history.push({
      board: state.draft.board,
      picked: player.id
    });
    if (state.draft.selectedIds.length >= 11) {
      state.screen = "captain";
    } else {
      state.draft.board = engine.generateDraftBoard(state.draft.selectedIds, state.draft.lostNames, state.mode);
    }
    render();
  }

  function createPreview() {
    state.schedule = engine.createSchedule();
    state.screen = "preview";
    render();
  }

  function simulateNextMatch() {
    var match = state.schedule[state.results.length];
    if (!match) return;
    var record = currentRecord();
    var opponent = engine.getOpponent(match.opponentCode);
    var pitch = engine.getPitch(match.pitch);
    var result = engine.simulateMatch(
      selectedPlayers(),
      engine.getPlayerById(state.captainId),
      opponent,
      pitch,
      match.matchNumber,
      record.wins,
      record.losses,
      state.mode,
      state.teamName
    );
    state.results.push(result);
    state.lastResult = result;
    if (state.results.length >= 14) {
      buildRun();
      state.screen = "results";
    }
    render();
  }

  function buildRun() {
    var players = selectedPlayers();
    var captain = engine.getPlayerById(state.captainId);
    var record = currentRecord();
    var ratings = engine.teamRatings(players, captain, state.mode);
    var run = {
      id: "run-" + Date.now() + "-" + Math.floor(Math.random() * 100000),
      playerName: state.playerName,
      teamName: state.teamName,
      mode: state.mode,
      captain: captain ? captain.name : "None",
      date: new Date().toISOString(),
      finalXI: players.map(function (player) {
        return {
          id: player.id,
          name: player.name,
          franchise: player.franchise,
          season: player.season,
          role: player.role,
          tier: player.tier,
          overseas: player.overseas
        };
      }),
      teamRating: ratings.overall,
      chemistryPairs: ratings.chemistryPairs,
      wins: record.wins,
      losses: record.losses,
      grade: engine.gradeForWins(record.wins, record.losses),
      results: state.results,
      awards: engine.awardsForRun(players, captain, state.results)
    };
    run.achievements = engine.achievementsForRun(run);
    state.run = run;
  }

  function saveResults() {
    if (!state.run) buildRun();
    storage.saveRun(state.run);
    state.savedRunId = state.run.id;
    render();
  }

  function resetToHome() {
    state.screen = "identity";
    state.draft = null;
    state.captainId = null;
    state.schedule = [];
    state.results = [];
    state.lastResult = null;
    state.run = null;
    render();
  }

  app.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) return;
    var action = target.getAttribute("data-action");
    if (action === "home") resetToHome();
    if (action === "mode") {
      state.mode = target.getAttribute("data-mode");
      render();
    }
    if (action === "start-draft") startDraft();
    if (action === "pick-player") pickPlayer(target.getAttribute("data-player-id"));
    if (action === "select-captain") {
      state.captainId = target.getAttribute("data-player-id");
      render();
    }
    if (action === "back-to-draft") {
      state.screen = "draft";
      render();
    }
    if (action === "captain") {
      state.screen = "captain";
      render();
    }
    if (action === "season-preview") createPreview();
    if (action === "start-season") {
      state.screen = "season";
      render();
    }
    if (action === "simulate-match") simulateNextMatch();
    if (action === "save-results") saveResults();
    if (action === "new-run") resetToHome();
    if (action === "leaderboard") {
      state.screen = "leaderboard";
      render();
    }
    if (action === "hall") {
      state.screen = "hall";
      render();
    }
    if (action === "stats") {
      state.screen = "stats";
      render();
    }
    if (action === "settings") {
      state.screen = "settings";
      render();
    }
    if (action === "clear-storage") {
      if (window.confirm("Reset leaderboard, hall of fame, statistics, and achievements on this browser?")) {
        storage.clearAll();
        render();
      }
    }
  });

  app.addEventListener("input", function (event) {
    var field = event.target.getAttribute("data-field");
    if (!field) return;
    if (field === "playerName") state.playerName = event.target.value;
    if (field === "teamName") state.teamName = event.target.value;
    if (field === "hallSearch") {
      state.hallSearch = event.target.value;
      render();
    }
  });

  app.addEventListener("change", function (event) {
    var field = event.target.getAttribute("data-field");
    if (!field) return;
    if (field === "hallFilter") {
      state.hallFilter = event.target.value;
      render();
    }
    if (field === "animations") {
      storage.saveSettings({ animations: event.target.checked });
      render();
    }
  });

  render();
})();
