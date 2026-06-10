(function () {
  "use strict";

  var data = window.IPL_DATA;
  var playerById = {};
  data.players.forEach(function (player) {
    playerById[player.id] = player;
  });

  var draftWindows = data.players.reduce(function (windows, player) {
    var key = player.franchise + "-" + player.season;
    if (!windows.some(function (window) { return window.key === key; })) {
      windows.push({ key: key, franchise: player.franchise, season: player.season });
    }
    return windows;
  }, []);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }
    return copy;
  }

  function sample(items, count) {
    return shuffle(items).slice(0, count);
  }

  function average(values) {
    if (!values.length) return 0;
    return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
  }

  function topAverage(players, key, count) {
    var values = players.map(function (player) { return player[key]; }).sort(function (a, b) { return b - a; });
    return average(values.slice(0, Math.min(count, values.length)));
  }

  function isBattingOption(player) {
    return player.batting >= 68 || /Batter|Opener|Finisher|All-rounder|Anchor|Hitter|Machine|Top Order|Middle Order/.test(player.role);
  }

  function isBowlingOption(player) {
    return player.bowling >= 68 || /Bowler|Spinner|All-rounder|Pace|Spin|Mystery|Yorker/.test(player.role);
  }

  function getPlayers(ids) {
    return (ids || []).map(function (id) { return playerById[id]; }).filter(Boolean);
  }

  function overseasCount(players) {
    return players.filter(function (player) { return player.overseas; }).length;
  }

  function getTeamComposition(players) {
    var batting = players.filter(isBattingOption).length;
    var bowling = players.filter(isBowlingOption).length;
    var wicketkeepers = players.filter(function (player) { return player.wicketkeeper; }).length;
    var overseas = overseasCount(players);
    return {
      batting: batting,
      bowling: bowling,
      wicketkeepers: wicketkeepers,
      overseas: overseas,
      battingNeeded: Math.max(0, 5 - batting),
      bowlingNeeded: Math.max(0, 5 - bowling),
      wicketkeeperNeeded: wicketkeepers >= 1 ? 0 : 1,
      validBase: batting >= 5 && bowling >= 5 && wicketkeepers >= 1
    };
  }

  function getMode(modeId) {
    return data.modes.find(function (mode) { return mode.id === modeId; }) || data.modes[0];
  }

  function isValidTeam(players, modeId) {
    var composition = getTeamComposition(players);
    return composition.validBase && (modeId !== "realist" || composition.overseas <= 4);
  }

  function selectionKeepsTeamPossible(selectedIds, player, modeId) {
    var selected = getPlayers(selectedIds).concat(player);
    var remaining = 11 - selected.length;
    var composition = getTeamComposition(selected);
    if (modeId === "realist" && composition.overseas > 4) return false;
    if (composition.battingNeeded > remaining) return false;
    if (composition.bowlingNeeded > remaining) return false;
    if (composition.wicketkeeperNeeded > remaining) return false;
    return true;
  }

  function isUnavailable(player, selectedNames, lostNames) {
    return selectedNames[player.name] || lostNames[player.name];
  }

  function uniqueByName(players) {
    var seen = {};
    return players.filter(function (player) {
      if (seen[player.name]) return false;
      seen[player.name] = true;
      return true;
    });
  }

  function availablePool(selectedIds, lostNamesList, modeId) {
    var selected = getPlayers(selectedIds);
    var selectedNames = {};
    var lostNames = {};
    selected.forEach(function (player) { selectedNames[player.name] = true; });
    (lostNamesList || []).forEach(function (name) { lostNames[name] = true; });
    return data.players.filter(function (player) {
      if (isUnavailable(player, selectedNames, lostNames)) return false;
      return selectionKeepsTeamPossible(selectedIds, player, modeId);
    });
  }

  function boardFitScore(window, selectedIds, lostNamesList, modeId) {
    var pool = availablePool(selectedIds, lostNamesList, modeId);
    var selected = getPlayers(selectedIds);
    var composition = getTeamComposition(selected);
    var remaining = 11 - selected.length;
    var candidates = pool.filter(function (player) {
      return player.franchise === window.franchise && player.season === window.season;
    });
    var score = candidates.length;
    if (composition.wicketkeeperNeeded && remaining <= 4) {
      score += candidates.filter(function (player) { return player.wicketkeeper; }).length * 4;
    }
    if (composition.bowlingNeeded >= Math.max(1, remaining - 3)) {
      score += candidates.filter(isBowlingOption).length * 2;
    }
    if (composition.battingNeeded >= Math.max(1, remaining - 3)) {
      score += candidates.filter(isBattingOption).length * 2;
    }
    return score;
  }

  function generateDraftBoard(selectedIds, lostNamesList, modeId) {
    var pool = availablePool(selectedIds, lostNamesList, modeId);
    var shuffledWindows = shuffle(draftWindows).sort(function (a, b) {
      return boardFitScore(b, selectedIds, lostNamesList, modeId) - boardFitScore(a, selectedIds, lostNamesList, modeId);
    });
    var chosenWindow = shuffledWindows.find(function (window) {
      return pool.filter(function (player) {
        return player.franchise === window.franchise && player.season === window.season;
      }).length >= 5;
    }) || shuffledWindows[0];

    var primary = pool.filter(function (player) {
      return player.franchise === chosenWindow.franchise && player.season === chosenWindow.season;
    });
    var sameFranchise = pool.filter(function (player) {
      return player.franchise === chosenWindow.franchise && player.season !== chosenWindow.season;
    });
    var options = sample(primary, 5);

    if (options.length < 5) {
      options = options.concat(sample(sameFranchise.filter(function (player) {
        return !options.some(function (option) { return option.name === player.name; });
      }), 5 - options.length));
    }

    if (options.length < 5) {
      options = options.concat(sample(pool.filter(function (player) {
        return !options.some(function (option) { return option.name === player.name; });
      }), 5 - options.length));
    }

    var composition = getTeamComposition(getPlayers(selectedIds));
    var note = "Random franchise and season board";
    if (composition.wicketkeeperNeeded && 11 - selectedIds.length <= 4) {
      note = "Wicketkeeper scarcity is now active";
    } else if (composition.bowlingNeeded > 0 && 11 - selectedIds.length <= 5) {
      note = "Bowling balance is under pressure";
    } else if (composition.battingNeeded > 0 && 11 - selectedIds.length <= 5) {
      note = "Batting depth is under pressure";
    }

    return {
      franchise: chosenWindow.franchise,
      season: chosenWindow.season,
      note: note,
      options: options.map(function (player) { return player.id; })
    };
  }

  function chemistryFor(players) {
    var names = {};
    players.forEach(function (player) { names[player.name] = true; });
    return data.chemistryPairs.filter(function (pair) {
      return names[pair.a] && names[pair.b];
    });
  }

  function tierScore(players) {
    return players.reduce(function (sum, player) {
      if (player.tier === "S") return sum + 4;
      if (player.tier === "A") return sum + 2;
      if (player.tier === "B") return sum + 1;
      return sum;
    }, 0);
  }

  function captainBonus(captain) {
    if (!captain) return 0;
    if (captain.leadership >= 95) return 4;
    if (captain.leadership >= 90) return 3;
    if (captain.leadership >= 84) return 2;
    return 0;
  }

  function teamRatings(players, captain, modeId) {
    var chemistry = chemistryFor(players);
    var chemistryBonus = chemistry.reduce(function (sum, pair) { return sum + pair.bonus; }, 0);
    var batting = topAverage(players, "batting", 7);
    var bowling = topAverage(players, "bowling", 5);
    var fielding = average(players.map(function (player) { return player.fielding; }));
    var form = average(players.map(function (player) { return player.form; }));
    var leadership = Math.max(captain ? captain.leadership : 0, topAverage(players, "leadership", 2) - 8);
    var balance = getTeamComposition(players);
    var balancePenalty = isValidTeam(players, modeId) ? 0 : 10;
    var overall = batting * 0.27 + bowling * 0.27 + fielding * 0.12 + leadership * 0.15 + form * 0.1 + chemistryBonus * 0.8 + tierScore(players) * 0.22 - balancePenalty;

    return {
      batting: Math.round(clamp(batting + chemistryBonus * 0.2, 1, 100)),
      bowling: Math.round(clamp(bowling + chemistryBonus * 0.2, 1, 100)),
      fielding: Math.round(clamp(fielding, 1, 100)),
      leadership: Math.round(clamp(leadership + captainBonus(captain), 1, 100)),
      form: Math.round(clamp(form, 1, 100)),
      chemistry: chemistryBonus,
      overall: Math.round(clamp(overall, 1, 100)),
      composition: balance,
      valid: isValidTeam(players, modeId),
      sTierCount: players.filter(function (player) { return player.tier === "S"; }).length,
      chemistryPairs: chemistry
    };
  }

  function pitchAdjustedRatings(players, ratings, pitch) {
    var spinBowlers = players.filter(function (player) { return player.style === "spin" && isBowlingOption(player); }).length;
    var paceBowlers = players.filter(function (player) { return player.style === "pace" && isBowlingOption(player); }).length;
    return Object.assign({}, ratings, {
      batting: ratings.batting + pitch.batting,
      bowling: ratings.bowling + pitch.bowling + spinBowlers * pitch.spin * 0.12 + paceBowlers * pitch.pace * 0.12,
      fielding: ratings.fielding,
      leadership: ratings.leadership,
      form: ratings.form,
      overall: ratings.overall + pitch.batting * 0.08 + pitch.bowling * 0.12
    });
  }

  function pressureStage(wins, losses) {
    if (wins === 14 && losses === 0) return { label: "Immortality", level: "immortal" };
    if (wins === 13 && losses === 0) return { label: "One Match From Immortality", level: "brink" };
    if (wins >= 10 && losses === 0) return { label: "Historic Run", level: "historic" };
    if (wins >= 5 && losses === 0) return { label: "Hot Streak", level: "hot" };
    if (losses > 0) return { label: "Pride Campaign", level: "pride" };
    return { label: "Normal", level: "normal" };
  }

  function opponentStrength(opponent) {
    var r = opponent.ratings;
    return r.batting * 0.27 + r.bowling * 0.27 + r.fielding * 0.12 + r.leadership * 0.15 + r.form * 0.14;
  }

  function winProbability(players, captain, opponent, pitch, wins, losses, modeId) {
    var ratings = pitchAdjustedRatings(players, teamRatings(players, captain, modeId), pitch);
    var opp = opponent.ratings;
    var pressure = pressureStage(wins, losses);
    var pressureLoad = pressure.level === "brink" ? 8 : pressure.level === "historic" ? 5 : pressure.level === "hot" ? 2 : 0;
    var leadershipShield = Math.max(0, ratings.leadership - 78) * 0.15;
    var chemistryShield = ratings.chemistry * 0.35;
    var playerStrength = ratings.batting * 0.27 + ratings.bowling * 0.29 + ratings.fielding * 0.11 + ratings.leadership * 0.14 + ratings.form * 0.12 + chemistryShield;
    var opponentTotal = opp.batting * 0.27 + opp.bowling * 0.29 + opp.fielding * 0.11 + opp.leadership * 0.14 + opp.form * 0.12;
    var differential = playerStrength - opponentTotal - pressureLoad + leadershipShield;
    return clamp(0.5 + differential / 100, 0.09, 0.91);
  }

  function scoreForSide(batting, bowlingAgainst, pitch, winnerBoost) {
    return Math.round(clamp(158 + pitch.score + (batting - 78) * 1.45 - (bowlingAgainst - 78) * 0.72 + randomInt(-15, 16) + winnerBoost, 92, 248));
  }

  function wicketsForSide(batting, bowlingAgainst, pitch, didWin) {
    var value = 6 + (bowlingAgainst - batting) / 14 + pitch.pressure * 0.35 + randomInt(-2, 2) - (didWin ? 1 : 0);
    return Math.round(clamp(value, 2, 10));
  }

  function simulateMatch(players, captain, opponent, pitch, matchNumber, wins, losses, modeId, teamName) {
    var ratings = pitchAdjustedRatings(players, teamRatings(players, captain, modeId), pitch);
    var probability = winProbability(players, captain, opponent, pitch, wins, losses, modeId);
    var variance = (Math.random() - 0.5) * 0.18;
    var playerWon = probability + variance >= 0.5;
    var playerBattedFirst = Math.random() >= 0.5;
    var oppBowling = opponent.ratings.bowling + pitch.bowling;
    var oppBatting = opponent.ratings.batting + pitch.batting;
    var playerScore = scoreForSide(ratings.batting, oppBowling, pitch, playerWon ? 8 : -4);
    var opponentScore = scoreForSide(oppBatting, ratings.bowling, pitch, playerWon ? -4 : 8);

    if (playerWon && playerScore <= opponentScore) {
      playerScore = opponentScore + randomInt(1, 22);
    }
    if (!playerWon && opponentScore <= playerScore) {
      opponentScore = playerScore + randomInt(1, 22);
    }

    var playerWickets = wicketsForSide(ratings.batting, oppBowling, pitch, playerWon);
    var opponentWickets = wicketsForSide(oppBatting, ratings.bowling, pitch, !playerWon);
    var marginValue;
    var margin;

    if ((playerWon && playerBattedFirst) || (!playerWon && !playerBattedFirst)) {
      marginValue = Math.abs(playerScore - opponentScore);
      margin = (playerWon ? "Won" : "Lost") + " by " + marginValue + " Runs";
    } else {
      marginValue = clamp(10 - (playerWon ? playerWickets : opponentWickets), 1, 9);
      margin = (playerWon ? "Won" : "Lost") + " by " + marginValue + " Wickets";
    }

    var closeFinish = Math.abs(playerScore - opponentScore) <= 12 || marginValue <= 3;
    var stage = pressureStage(wins + (playerWon ? 1 : 0), losses + (playerWon ? 0 : 1));
    return {
      id: "M" + matchNumber + "-" + Date.now() + "-" + randomInt(100, 999),
      matchNumber: matchNumber,
      opponentCode: opponent.code,
      opponentName: opponent.name,
      venue: opponent.homeGround,
      pitch: pitch.type,
      probability: Math.round(probability * 100),
      playerWon: playerWon,
      closeFinish: closeFinish,
      margin: margin,
      stage: stage,
      playerInnings: {
        name: teamName,
        runs: playerScore,
        wickets: playerWickets
      },
      opponentInnings: {
        name: opponent.name,
        runs: opponentScore,
        wickets: opponentWickets
      }
    };
  }

  function createSchedule() {
    var firstTen = shuffle(data.opponents);
    var repeats = sample(data.opponents, 4);
    return firstTen.concat(repeats).map(function (opponent, index) {
      return {
        matchNumber: index + 1,
        opponentCode: opponent.code,
        pitch: sample(data.pitches, 1)[0].type
      };
    });
  }

  function getOpponent(code) {
    return data.opponents.find(function (opponent) { return opponent.code === code; });
  }

  function getPitch(type) {
    return data.pitches.find(function (pitch) { return pitch.type === type; }) || data.pitches[0];
  }

  function previewAnalysis(players, captain, schedule, modeId) {
    var ratings = teamRatings(players, captain, modeId);
    var projected = schedule.map(function (match, index) {
      var opponent = getOpponent(match.opponentCode);
      var pitch = getPitch(match.pitch);
      return winProbability(players, captain, opponent, pitch, index, 0, modeId);
    });
    var expectedWins = projected.reduce(function (sum, probability) { return sum + probability; }, 0);
    var teams = data.opponents.map(function (opponent) {
      return { name: opponent.name, value: opponentStrength(opponent) };
    }).concat({ name: "Your XI", value: ratings.overall });
    var ranking = teams.sort(function (a, b) { return b.value - a.value; }).findIndex(function (team) { return team.name === "Your XI"; }) + 1;
    var categories = [
      { label: "Batting", value: ratings.batting },
      { label: "Bowling", value: ratings.bowling },
      { label: "Fielding", value: ratings.fielding },
      { label: "Leadership", value: ratings.leadership },
      { label: "Form", value: ratings.form },
      { label: "Chemistry", value: Math.min(100, ratings.chemistry * 10) }
    ];
    var sorted = categories.slice().sort(function (a, b) { return b.value - a.value; });

    return {
      ratings: ratings,
      expectedWins: expectedWins,
      averageWinProbability: Math.round(average(projected) * 100),
      powerRanking: ranking,
      strengths: sorted.slice(0, 3),
      weaknesses: sorted.slice(-3).reverse()
    };
  }

  function gradeForWins(wins, losses) {
    if (wins === 14 && losses === 0) return "Immortal";
    if (wins === 13) return "Legendary";
    if (wins >= 12) return "Dynasty";
    if (wins >= 10) return "Elite";
    if (wins >= 8) return "Playoff Class";
    if (wins >= 6) return "Competitive";
    return "Rebuild";
  }

  function awardsForRun(players, captain, results) {
    var bestBatter = players.slice().sort(function (a, b) { return b.batting + b.form * 0.15 - (a.batting + a.form * 0.15); })[0];
    var bestBowler = players.slice().sort(function (a, b) { return b.bowling + b.form * 0.15 - (a.bowling + a.form * 0.15); })[0];
    var bestFielder = players.slice().sort(function (a, b) { return b.fielding - a.fielding; })[0];
    var clutchWins = results.filter(function (result) { return result.playerWon && result.closeFinish; }).length;
    return [
      { label: "Orange Cap", value: bestBatter ? bestBatter.name : "None" },
      { label: "Purple Cap", value: bestBowler ? bestBowler.name : "None" },
      { label: "Safe Hands", value: bestFielder ? bestFielder.name : "None" },
      { label: "Captaincy Medal", value: captain ? captain.name : "None" },
      { label: "Close Wins", value: String(clutchWins) }
    ];
  }

  function achievementsForRun(run) {
    var names = {};
    run.finalXI.forEach(function (player) { names[player.name] = true; });
    var achievements = [];
    if (run.wins === 14 && run.losses === 0) achievements.push("immortal");
    if (run.wins === 13 && run.losses === 1) achievements.push("near-miss");
    if (run.wins >= 12) achievements.push("dynasty-builder");
    if (run.finalXI.filter(function (player) { return player.tier === "S"; }).length >= 5) achievements.push("master-drafter");
    if (run.captain === "MS Dhoni" && run.wins >= 1) achievements.push("captain-fantastic");
    if (run.chemistryPairs.length >= 2) achievements.push("bond-market");
    if (run.mode === "knowledge" && run.wins >= 10) achievements.push("memory-merchant");
    if (run.results.filter(function (result) { return result.playerWon && result.closeFinish; }).length >= 3) achievements.push("last-over-legend");
    if (names["Jasprit Bumrah"] && names["Lasith Malinga"]) achievements.push("yorker-bank");
    return achievements;
  }

  window.IPL_ENGINE = {
    getPlayers: getPlayers,
    getPlayerById: function (id) { return playerById[id]; },
    getTeamComposition: getTeamComposition,
    isBattingOption: isBattingOption,
    isBowlingOption: isBowlingOption,
    isValidTeam: isValidTeam,
    selectionKeepsTeamPossible: selectionKeepsTeamPossible,
    generateDraftBoard: generateDraftBoard,
    chemistryFor: chemistryFor,
    teamRatings: teamRatings,
    pressureStage: pressureStage,
    createSchedule: createSchedule,
    getOpponent: getOpponent,
    getPitch: getPitch,
    simulateMatch: simulateMatch,
    previewAnalysis: previewAnalysis,
    gradeForWins: gradeForWins,
    awardsForRun: awardsForRun,
    achievementsForRun: achievementsForRun,
    getMode: getMode,
    clamp: clamp
  };
})();
