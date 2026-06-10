(function () {
  "use strict";

  var KEY = "ipl-challenge-v1";
  var memoryStore = null;

  var achievementCatalog = [
    { id: "immortal", name: "Immortal", description: "Achieve 14-0.", hidden: false },
    { id: "near-miss", name: "Near Miss", description: "Finish 13-1.", hidden: false },
    { id: "dynasty-builder", name: "Dynasty Builder", description: "Win 12 or more games.", hidden: false },
    { id: "master-drafter", name: "Master Drafter", description: "Draft five S-tier players.", hidden: false },
    { id: "captain-fantastic", name: "Captain Fantastic", description: "Win with MS Dhoni as captain.", hidden: false },
    { id: "bond-market", name: "Bond Market", description: "Activate two chemistry pairs.", hidden: false },
    { id: "memory-merchant", name: "Memory Merchant", description: "Win 10 or more games in Knowledge Mode.", hidden: true },
    { id: "last-over-legend", name: "Last Over Legend", description: "Win three close finishes in one run.", hidden: true },
    { id: "yorker-bank", name: "Yorker Bank", description: "Draft Bumrah and Malinga together.", hidden: true }
  ];

  function blankStore() {
    return {
      version: 1,
      leaderboard: [],
      hallOfFame: [],
      achievements: {},
      settings: {
        animations: true
      },
      stats: {
        totalDrafts: 0,
        completedRuns: 0,
        totalWins: 0,
        highestWinTotal: 0,
        totalPerfectRuns: 0,
        draftedCounts: {},
        captainCounts: {},
        captainWins: {},
        franchiseCounts: {},
        franchiseWins: {},
        chemistryCounts: {},
        chemistryWins: {}
      }
    };
  }

  function normalizeStore(raw) {
    var clean = blankStore();
    if (!raw || typeof raw !== "object") return clean;
    clean.leaderboard = Array.isArray(raw.leaderboard) ? raw.leaderboard : [];
    clean.hallOfFame = Array.isArray(raw.hallOfFame) ? raw.hallOfFame : [];
    clean.achievements = raw.achievements && typeof raw.achievements === "object" ? raw.achievements : {};
    clean.settings = Object.assign(clean.settings, raw.settings || {});
    clean.stats = Object.assign(clean.stats, raw.stats || {});
    [
      "draftedCounts",
      "captainCounts",
      "captainWins",
      "franchiseCounts",
      "franchiseWins",
      "chemistryCounts",
      "chemistryWins"
    ].forEach(function (key) {
      if (!clean.stats[key] || typeof clean.stats[key] !== "object") clean.stats[key] = {};
    });
    return clean;
  }

  function readStore() {
    if (memoryStore) return normalizeStore(memoryStore);
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return blankStore();
      return normalizeStore(JSON.parse(raw));
    } catch (error) {
      return blankStore();
    }
  }

  function writeStore(store) {
    var clean = normalizeStore(store);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(clean));
    } catch (error) {
      memoryStore = clean;
    }
    return clean;
  }

  function increment(map, key, by) {
    if (!key) return;
    map[key] = (map[key] || 0) + (by || 1);
  }

  function recordDraftStart() {
    var store = readStore();
    store.stats.totalDrafts += 1;
    writeStore(store);
    return store;
  }

  function saveSettings(settings) {
    var store = readStore();
    store.settings = Object.assign({}, store.settings, settings || {});
    writeStore(store);
    return store.settings;
  }

  function saveRun(run) {
    var store = readStore();
    if (store.hallOfFame.some(function (entry) { return entry.id === run.id; })) {
      return { store: store, unlocked: [] };
    }

    store.hallOfFame.unshift(run);
    store.hallOfFame = store.hallOfFame.slice(0, 200);
    if (run.wins === 14 && run.losses === 0) {
      store.leaderboard.push({
        id: run.id,
        playerName: run.playerName,
        teamName: run.teamName,
        captain: run.captain,
        mode: run.mode,
        date: run.date,
        finalXI: run.finalXI,
        teamRating: run.teamRating
      });
      store.leaderboard.sort(function (a, b) {
        if (b.teamRating !== a.teamRating) return b.teamRating - a.teamRating;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      store.leaderboard = store.leaderboard.slice(0, 100);
      store.stats.totalPerfectRuns += 1;
    }

    store.stats.completedRuns += 1;
    store.stats.totalWins += run.wins;
    store.stats.highestWinTotal = Math.max(store.stats.highestWinTotal, run.wins);
    increment(store.stats.captainCounts, run.captain, 1);
    increment(store.stats.captainWins, run.captain, run.wins);

    run.finalXI.forEach(function (player) {
      increment(store.stats.draftedCounts, player.name, 1);
      increment(store.stats.franchiseCounts, player.franchise, 1);
      increment(store.stats.franchiseWins, player.franchise, run.wins);
    });

    run.chemistryPairs.forEach(function (pair) {
      increment(store.stats.chemistryCounts, pair.label, 1);
      increment(store.stats.chemistryWins, pair.label, run.wins);
    });

    var unlocked = [];
    run.achievements.forEach(function (id) {
      if (!store.achievements[id]) {
        store.achievements[id] = new Date().toISOString();
        unlocked.push(id);
      }
    });

    writeStore(store);
    return { store: store, unlocked: unlocked };
  }

  function topEntry(map) {
    var entries = Object.keys(map || {}).map(function (key) {
      return { key: key, value: map[key] };
    }).sort(function (a, b) { return b.value - a.value; });
    return entries[0] || { key: "None", value: 0 };
  }

  function topAverage(counts, totals) {
    var entries = Object.keys(counts || {}).map(function (key) {
      return {
        key: key,
        value: counts[key] ? totals[key] / counts[key] : 0,
        count: counts[key] || 0
      };
    }).filter(function (entry) {
      return entry.count > 0;
    }).sort(function (a, b) {
      if (b.value !== a.value) return b.value - a.value;
      return b.count - a.count;
    });
    return entries[0] || { key: "None", value: 0, count: 0 };
  }

  function computedStats() {
    var store = readStore();
    var stats = store.stats;
    var mostDrafted = topEntry(stats.draftedCounts);
    var captain = topAverage(stats.captainCounts, stats.captainWins);
    var franchise = topAverage(stats.franchiseCounts, stats.franchiseWins);
    var chemistry = topAverage(stats.chemistryCounts, stats.chemistryWins);
    return {
      totalDrafts: stats.totalDrafts,
      completedRuns: stats.completedRuns,
      averageWins: stats.completedRuns ? (stats.totalWins / stats.completedRuns).toFixed(1) : "0.0",
      highestWinTotal: stats.highestWinTotal,
      mostDraftedPlayer: mostDrafted.key,
      mostDraftedCount: mostDrafted.value,
      mostSuccessfulCaptain: captain.key,
      mostSuccessfulCaptainWins: captain.value.toFixed ? captain.value.toFixed(1) : "0.0",
      mostSuccessfulFranchise: franchise.key,
      mostSuccessfulFranchiseWins: franchise.value.toFixed ? franchise.value.toFixed(1) : "0.0",
      mostSuccessfulChemistryPair: chemistry.key,
      mostSuccessfulChemistryWins: chemistry.value.toFixed ? chemistry.value.toFixed(1) : "0.0",
      totalPerfectRuns: stats.totalPerfectRuns
    };
  }

  function clearAll() {
    try {
      window.localStorage.removeItem(KEY);
    } catch (error) {
      memoryStore = null;
    }
  }

  window.IPL_STORAGE = {
    readStore: readStore,
    writeStore: writeStore,
    recordDraftStart: recordDraftStart,
    saveSettings: saveSettings,
    saveRun: saveRun,
    computedStats: computedStats,
    clearAll: clearAll,
    achievementCatalog: achievementCatalog
  };
})();
