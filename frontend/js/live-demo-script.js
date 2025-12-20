challengeText = [
  {
    primaryWeakness: "Bad Lobs",
    whyItMatters:
      "Poor lobs can lead to easy overheads for the opponents, putting the player on the defensive. This can disrupt the player's positioning and overall game strategy, often resulting in losing points.",
    challenge:
      "During your next match, focus on assessing the positioning of your opponents before attempting a lob. Aim to hit lobs only when you are sure it will create an advantageous situation or force a weak return.",
  },
  {
    primaryWeakness: "Inconsistent Net Positioning",
    whyItMatters:
      "Poor positioning at the net creates gaps that opponents can exploit with passing shots or lobs. This often forces the player into reactive movements, reducing control over the point.",
    challenge:
      "In your next match, focus on maintaining a compact net position with your partner. After each shot, quickly recover to an optimal position instead of drifting too wide or too deep.",
  },
  {
    primaryWeakness: "Weak Second Serve",
    whyItMatters:
      "A passive or predictable second serve allows opponents to attack immediately, putting pressure on the serving team from the first shot of the rally.",
    challenge:
      "During your next match, commit to a consistent second serve with sufficient depth and margin. Prioritise placement over power to prevent aggressive returns.",
  },
  {
    primaryWeakness: "Poor Shot Selection Under Pressure",
    whyItMatters:
      "Choosing high-risk shots in defensive situations often leads to unnecessary errors and lost points, especially during long rallies.",
    challenge:
      "During your next match, consciously choose safer, higher-margin shots when under pressure. Focus on extending rallies instead of attempting low-percentage winners.",
  },
  {
    primaryWeakness: "Late Preparation",
    whyItMatters:
      "Late racket preparation reduces shot quality and limits available options, often resulting in rushed or poorly controlled shots.",
    challenge:
      "In your next match, focus on early racket preparation as soon as you recognize the incoming ball. Prioritise readiness over power on every shot.",
  },
  {
    primaryWeakness: "Poor Communication With Partner",
    whyItMatters:
      "Lack of communication leads to confusion, missed balls, and poor court coverage, which opponents can exploit easily.",
    challenge:
      "During your next match, actively communicate with your partner by calling balls, signaling intentions, and offering quick feedback between points.",
  },
  {
    primaryWeakness: "Overusing Power",
    whyItMatters:
      "Relying too much on power increases unforced errors and reduces consistency, especially when margins are small.",
    challenge:
      "In your next match, intentionally reduce shot power and focus on control, placement, and spin to build points more effectively.",
  },
  {
    primaryWeakness: "Poor Recovery After Shots",
    whyItMatters:
      "Failing to recover after hitting a shot leaves open spaces and makes it harder to respond to the opponent’s next ball.",
    challenge:
      "During your next match, make recovery your priority after every shot. Take one or two quick adjustment steps to regain optimal positioning.",
  },
  {
    primaryWeakness: "Hesitation at the Net",
    whyItMatters:
      "Hesitating at the net leads to missed attacking opportunities and allows opponents to regain control of the rally.",
    challenge:
      "In your next match, commit fully when moving to the net. If the ball is attackable, decide early and execute confidently.",
  },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

regenerateChallengeBtn = document.querySelector(".regenerate-challenge-btn");

progressBar = document.querySelector(".progress-bar");

let previousNumber = null;

regenerateChallengeBtn.addEventListener("click", (event) => {
  let lengthOfArray = challengeText.length;
  let randomNumber = getRandomInt(lengthOfArray);
  while (previousNumber == randomNumber) {
    randomNumber = getRandomInt(lengthOfArray);
  }
  let randomChallenge = challengeText[randomNumber];
  let primaryWeaknessText = randomChallenge.primaryWeakness;
  let whyItMatters = randomChallenge.whyItMatters;
  let challenge = randomChallenge.challenge;
  previousNumber = randomNumber;

  document.getElementById("sub-heading").textContent =
    "Improve Your " + primaryWeaknessText;
  document.getElementById("whyitmatters-text").textContent = whyItMatters;
  document.getElementById("challenge-text").textContent = challenge;
  document.getElementById("matches-progress").textContent = "0/3 Matches";
  progressBar.setAttribute("aria-valuenow", "0");
  progressBar.style.width = "0%";
});
