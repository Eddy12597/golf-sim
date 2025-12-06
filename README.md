# golf-sim

Simulate strategies for golf.

1) Model & assumptions (plain language)

Course: 18 holes, each hole is par = 4 (for simplicity).
Two players: Trump and Obama.
Two tee options: Short (lands before lake = safer) and Long (attempt to clear lake = riskier but, if successful, gives higher chance of par).
Trump’s strategy: on each hole he chooses Long with probability 2/3, Short with probability 1/3 (independent across holes).
Obama’s strategy: on hole i, Obama looks at cumulative scores after the first i−1 holes:

If Obama’s cumulative score is ≥ Trump’s (i.e., Obama is tied or behind/worse), Obama chooses Long (to catch up).

If Obama’s cumulative score is < Trump’s (i.e., Obama is leading), Obama chooses Short (play safe).

Long success probability: the long shot has some probability of success (clearing the lake). This success probability can differ by player (Trump may be less accurate than Obama). If long succeeds, the chance of par is higher; if long fails, the expected score is worse (penalty).

Short shot: safe — lower chance of par than a successful long, but failure penalty is small/none.

Holes are independent except for Obama’s decision rule which uses cumulative scores (introduces dependence between players' choices across holes).

Simplified scoring model per hole (easy to interpret and simulate):


If you get "par outcome" → you score 4.

If you get "miss outcome" → you score 5 (bogey).

If you have a severe failure (long fail) → you score 6 (double bogey).

You can adjust to use more realistic score distributions later.



Simulation Procedure 
In our simulation, we model an 18-hole golf match between Donald Trump and Barack Obama. Each hole starts with a tee shot over a small lake(Yes, every hole has a lake). The player must decide whether to hit a long shot (which carries the lake) or a short shot (which lands before the lake). This decision affects how difficult the rest of the hole becomes.

Step 1: Decide the tee-shot strategy.
Trump uses a fixed strategy: he chooses a long shot 2/3 of the time and a short shot 1/3 of the time. Obama uses an adaptive strategy: if his total score is tied with Trump or worse than Trump, he chooses the long shot. If he is currently ahead of Trump, he chooses the short shot to stay safe.

Step 2: Simulate whether the tee shot succeeds or fails.
Each type of tee shot has a probability of success.
Long shot: Success rate 55%, failed rate 45%
Short shot: Success rate 85%, failed rate 15%
(subject to change)

Long shot outcomes:
a. A successful long shot lands safely over the lake and gives a good position.
b. A failed long shot means the ball does not cross the lake and gives a bad position.

Shot shot outcomes:
a. A successful short shot lands safely before the lake, which is safe but farther from the hole.
b. A failed short shot means a mishit that still stays before the lake, but ends up in a worse lie or angle.

Step 3: Assign a probability distribution for the number of strokes needed to finish the hole.
Each of the four tee-shot outcomes has its own distribution for how many more strokes are needed to complete the hole. These distributions reflect realistic golf situations: good lies usually allow fewer strokes, while bad lies require more.

If the long tee shot succeeds, the distribution favors lower stroke counts (like 2–4 more strokes).

x	1	2	3	4	5	6	7
p(x)	0.05	0.2	0.4	0.25	0.08	0.02	0

If the long shot fails, the distribution shifts toward higher stroke counts.

x	1	2	3	4	5	6	7
p(x)	0	0	0.2	0.35	0.25	0.15	0.05

Successful short shots lead to a moderate distribution.
x	1	2	3	4	5	6	7
p(x)	0.02	0.15	0.4	0.3	0.1	0.03	0

Failed short shots lead to the highest expected strokes.
x	1	2	3	4	5	6	7
p(x)	0	0.12	0.3	0.32	0.18	0.06	0.02
(subject to change)

Step 4: Add 1 stroke for the tee shot and record the total for the hole.
The total strokes for each hole = 1 (tee shot) + the random draw from the distribution.

Step 5: Update scores and continue to the next hole.
After each hole, we add the strokes to each player’s total score. Obama’s strategy for the next hole depends on his score relative to Trump.

Step 6: Repeat the simulation for 18 holes, and repeat the entire match many times.
By running many simulated matches, we can estimate the probability that the adaptive strategy (Obama) performs better than the fixed strategy (Trump), as well as compare average scores and score distributions.

Assumptions
-Max strokes per hole = 8 (tee shot + x where x ≤ 7).
-Homogeneous holes: all 18 holes use the same success probabilities and stroke distributions (no hole difficulty variation).
-Independence between holes conditional on strategy (except that Obama’s decision uses cumulative score).
-No weather or momentum effects (no wind, no hot-hand). These could be future extensions.
-Short-fail definition: a short fail is a poor lie or mishit that stays before the lake but makes the approach harder.
-Long-fail penalty: a long fail means a severe setback (e.g., water), so x = 1 or 2 are impossible.
-Players’ skill is constant across the round (probabilities do not change with fatigue).
-Tie rule: ties count as ties (no extra holes simulated).


