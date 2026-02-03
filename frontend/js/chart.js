fetch(
  "https://purple-sky-0eae4c803.6.azurestaticapps.net/get_user_match_history",
)
  .then(function (response) {
    return response.json();
  })
  .then(function (responseData) {
    // GRAB NUMBER TOTAL NUMBER OF MATCHES

    const matchNumber = [];
    const N = responseData.length;
    for (let i = 1; i <= N; i++) {
      matchNumber.push(i);
    }

    // ADD START POINT TO MATCH NUMBER ARRAY
    matchNumber.unshift("Start");

    // CREATE RATINGS ARRAY

    // GET USER'S MATCH HISTORY AND SORT BY DATE ASC

    const matchesSortedByDateAsc = responseData.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // GET START RATING AND ADD TO RATINGS ARRAY

    ratingsAdded = [];

    const startRatingValue = localStorage.getItem("start-rating");
    ratingsAdded.unshift(parseFloat(startRatingValue));

    const floatStartRatingValue = parseFloat(startRatingValue);

    // ADD MATCH HISTORY RATING ARRAY

    let n = 0;
    let rating;
    for (let match of matchesSortedByDateAsc) {
      let result = match.result;
      let rawRating = match.rating;
      let matchType = match.matchType;
      if (matchType === "Competitive") {
        if (result === "Loss") {
          rating = Number("-" + parseFloat(rawRating));
        } else if (result === "Win") {
          rating = Number("+" + parseFloat(rawRating));
        } else if (result === "Draw") {
          rating = parseFloat(rawRating);
        }
      } else {
        rating = 0;
      }

      let combinedRating = ratingsAdded[n] + rating;
      ratingsAdded.push(combinedRating);
      n = n + 1;
    }

    // LATEST RATING

    lastIndex = ratingsAdded.length - 1;
    lastRatingOfArray = ratingsAdded[lastIndex].toFixed(2);

    // RATING IN CHART HEADING

    // CHECK START RATING EXISTS

    if (Number.isFinite(Number(lastRatingOfArray)) !== true) {
      lastRatingOfArray = "Set Start Rating";
    }

    const chartTextHeading = document.querySelector("#chartTextHeading");
    chartTextHeading.textContent = lastRatingOfArray;

    // CHART SUB-HEADING STAT

    const rawRatingArray = [];

    for (let match of matchesSortedByDateAsc) {
      let rating = 0;
      let result = match.result;
      let rawRating = match.rating;
      let matchType = match.matchType;
      if (matchType === "Competitive") {
        if (result === "Loss") {
          rating = Number("-" + parseFloat(rawRating));
          rawRatingArray.push(rating);
        } else if (result === "Win") {
          rating = Number("+" + parseFloat(rawRating));
          rawRatingArray.push(rating);
        } else if (result === "Draw") {
          rating = parseFloat(rawRating);
          rawRatingArray.push(rating);
        }
      } else {
        rating = 0;
        rawRatingArray.push(rating);
      }
    }

    let sumOfRatings = 0;
    let minusOrPlus;

    rawRatingArray.forEach((num) => {
      sumOfRatings += num;
    });

    if (Math.sign(sumOfRatings) === -1) {
      minusOrPlus = "";
    }

    if (Math.sign(sumOfRatings) === 1) {
      minusOrPlus = "+";
    }

    if (Math.sign(sumOfRatings) === 0) {
      minusOrPlus = "";
    }

    const chartSubHeadingStat = document.querySelector(
      "#chart-text-subheading",
    );
    chartSubHeadingStat.textContent =
      minusOrPlus +
      sumOfRatings.toFixed(2) +
      " " +
      "POINTS FROM LAST" +
      " " +
      matchesSortedByDateAsc.length +
      " " +
      "MATCHES";

    // CHART ICON STAT

    const chartIconStat = document.querySelector("#chartIconStatNumber");

    const startRatingValueNum = parseFloat(startRatingValue);

    let ratingPercentGrowth =
      ((startRatingValueNum + sumOfRatings - startRatingValueNum) /
        startRatingValueNum) *
      100;

    chartIconStat.textContent = " " + ratingPercentGrowth.toFixed(2) + "%";

    //RATING CARD

    const ratingCardCurrentRating = document.querySelector(".rating-number");
    ratingCardCurrentRating.textContent = lastRatingOfArray;

    // RATING CARD - BEGINNER - ADVANCED

    const ratingStat = document.querySelector("#ratingExperience");
    if (lastRatingOfArray >= 0 && lastRatingOfArray < 2) {
      ratingStat.textContent = "Beginner";
    } else if (lastRatingOfArray >= 2 && lastRatingOfArray < 3) {
      ratingStat.textContent = "Intermediate";
    } else if (lastRatingOfArray >= 3) {
      ratingStat.textContent = "Advance";
    }

    // WINRATE CARD AND WINRATE CALCULATION

    let w = 0;
    let l = 0;

    for (let match of matchesSortedByDateAsc) {
      let result = match.result;
      if (result === "Win") {
        w++;
      }
      if (result === "Loss") {
        l++;
      }
    }

    let winrateStat = (w / (w + l)) * 100;

    const winrateNumberCard = document.querySelector(".winrate-number");

    if (Number.isFinite(winrateStat) !== true) {
      winrateStat = 0;
      winrateNumberCard.textContent = "-";
    } else {
      winrateNumberCard.textContent = Math.round(winrateStat) + "%";
    }

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear - 1;

    let year = currentYear;

    if (previousMonth === 0) {
      previousMonth = 12;
      year = previousYear;
    }

    let currentYearMonthCombined = currentYear + "-" + currentMonth;
    let previousYearMonthCombined = year + "-" + previousMonth;

    if (currentMonth < 10) {
      currentYearMonthCombined = currentYear + "-" + "0" + currentMonth;
    }

    if (previousMonth < 10) {
      previousYearMonthCombined = year + "-" + "0" + previousMonth;
    }

    const previousMonthWins = [];
    const previousMonthLoss = [];

    const currentMonthWins = [];
    const currentMonthLoss = [];

    for (let match of matchesSortedByDateAsc) {
      const date = match.date;
      const result = match.result;
      let dateArray = date.split("-");
      let Matchmonth = dateArray[1];
      let Matchyear = dateArray[0];
      let monthYearCombined = Matchyear + "-" + Matchmonth;
      if (monthYearCombined === currentYearMonthCombined) {
        if (result === "Win") {
          currentMonthWins.push(result);
        } else if (result === "Loss") {
          currentMonthLoss.push(result);
        }
      }
      if (monthYearCombined === previousYearMonthCombined) {
        if (result === "Win") {
          previousMonthWins.push(result);
        } else if (result === "Loss") {
          previousMonthLoss.push(result);
        }
      }
    }

    // CALCULATE PREVIOUS MONTH'S WINRATE AND CURRENT MONTH'S WINRATE

    const winrateCardMiniTrendIcon = document.querySelector(
      "#winrateCardMiniTrendIcon",
    );
    const winRateThisMonthStat = document.querySelector(
      "#winRateThisMonthStat",
    );

    const winrateCardTrendIcon = document.querySelector(
      "#winrateCardTrendIcon",
    );

    const winRateCard = document.querySelector(".winrate-card-positive");
    const winRateIconBoxCard = document.querySelector(".winrate-icon-box-win");

    let currentTotal = currentMonthWins.length + currentMonthLoss.length;
    let previousTotal = previousMonthWins.length + previousMonthLoss.length;

    let currentMonthWinrateStat = 0;
    let previousMonthWinrateStat = 0;

    if (currentTotal > 0) {
      currentMonthWinrateStat = (currentMonthWins.length / currentTotal) * 100;
    }

    if (previousTotal > 0) {
      previousMonthWinrateStat =
        (previousMonthWins.length / previousTotal) * 100;
    }

    winrateDifference = currentMonthWinrateStat - previousMonthWinrateStat;

    if (Math.sign(winrateDifference) === -1) {
      winrateCardMiniTrendIcon.src = "images/trending-down.svg";
      winRateThisMonthStat.style.color = "red";
      winrateCardTrendIcon.src = "images/trending-down.svg";
      winRateCard.classList.remove("winrate-card-positive");
      winRateCard.classList.add("winrate-card-negative");
      winRateIconBoxCard.classList.remove("winrate-icon-box-win");
      winRateIconBoxCard.classList.add("winrate-icon-box-loss");
    }

    if (Math.sign(winrateDifference) === 1) {
      winrateCardMiniTrendIcon.src = "images/trending-up.svg";
      winRateThisMonthStat.style.color = "#009866";
      winrateCardTrendIcon.src = "images/trending-up.svg";
      winRateCard.classList.remove("winrate-card-negative");
      winRateCard.classList.add("winrate-card-positive");
      winRateIconBoxCard.classList.remove("winrate-icon-box-loss");
      winRateIconBoxCard.classList.add("winrate-icon-box-win");
    }

    winRateThisMonthStat.textContent =
      Math.round(winrateDifference) + "% this month";

    //   TOTAL MATCHES CARD

    totalMatchesCardStat = document.querySelector(".total-matches-number");

    totalMatchesCardStat.textContent = matchesSortedByDateAsc.length;

    // WIN STREAK CARD

    const matchesSortedByDateDesc = responseData.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    let winStreak = 0;
    for (let match of matchesSortedByDateDesc) {
      const result = match.result;
      const matchType = match.matchType;
      if (result === "Win" && matchType === "Competitive") {
        winStreak++;
      } else if (result === "Draw" && matchType === "Competitive") {
        break;
      } else if (result === "Loss" && matchType === "Competitive") {
        break;
      }
    }

    winStreakStat = document.querySelector(".winstreak-number");
    winStreakText = document.querySelector(".winstreak-stat");
    winStreakStat.textContent = winStreak;

    if (winStreak === 0) {
      winStreakText.textContent = " Don't give up!";
    } else if (winStreak > 0) {
      winStreakText.textContent = " Keep it going!";
    }

    // CHART

    const title = (tooltipItems) => {
      let firstIndex = tooltipItems[0];
      let matchNumber = firstIndex.dataIndex;
      if (matchNumber === 0) {
        return "Start";
      } else {
        return "Match " + matchNumber;
      }
    };

    const label = (tooltipItem) => {
      let matchIndex = tooltipItem.dataIndex;
      return ["rating : " + ratingsAdded[matchIndex].toFixed(2)];
    };

    const myChart = new Chart("line-chart", {
      type: "line",
      data: {
        labels: matchNumber,
        datasets: [
          {
            label: "Match Number",
            borderColor: "#4487f6",
            data: ratingsAdded,
            tension: 0.1,
            pointRadius: (ctx) => {
              const lastIndex = ratingsAdded.length - 1;
              if (ctx.dataIndex === lastIndex) {
                return 5;
              } else {
                return 3;
              }
            },
            pointBackgroundColor: (ctx) => {
              const lastIndex = ratingsAdded.length - 1;
              if (ctx.dataIndex === lastIndex) {
                return "#2662eb";
              } else {
                return "#3c82f6";
              }
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 30,
            right: 15,
          },
        },
        scales: {
          y: {
            border: {
              color: "#f1f3f7",
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 4,
            },
            title: {
              display: true,
              text: "Rating",
              color: "#969ba3",
            },
            grid: {
              drawOnChartArea: false,
            },
            position: "left",
            display: true,
          },
          x: {
            border: {
              color: "#f1f3f7",
            },
            title: {
              display: true,
              text: "Match Number",
              color: "#969ba3",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            titleColor: "#99a1aaff",
            backgroundColor: "#ffffff",
            bodyColor: "#679ff8",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            bodyFont: {
              weight: "bold",
            },
            callbacks: {
              title: title,
              label: label,
            },
          },
        },
      },
    });
  });
