// Golf Simulation: Trump vs Obama
import { trump_p_l, trump_l_s, trump_s_s, obama_l_s, obama_s_s } from "./input.js";

class GolfSimulation {
    constructor(options = {}) {
        // Strategy probabilities
        this.trumpLongProb = options.trumpLongProb || 2/3;
        this.trumpShortProb = 1 - this.trumpLongProb;
        
        // Tee shot success probabilities
        this.trumpLongSuccessProb = options.trumpLongSuccessProb || 0.55;
        this.trumpShortSuccessProb = options.trumpShortSuccessProb || 0.85;
        this.obamaLongSuccessProb = options.obamaLongSuccessProb || 0.55;
        this.obamaShortSuccessProb = options.obamaShortSuccessProb || 0.85;
        
        // Stroke distributions for different scenarios
        this.distributions = {
            longSuccess: {
                values: [1, 2, 3, 4, 5, 6, 7],
                probabilities: [0.05, 0.20, 0.40, 0.25, 0.08, 0.02, 0]
            },
            longFail: {
                values: [1, 2, 3, 4, 5, 6, 7],
                probabilities: [0, 0, 0.20, 0.35, 0.25, 0.15, 0.05]
            },
            shortSuccess: {
                values: [1, 2, 3, 4, 5, 6, 7],
                probabilities: [0.02, 0.15, 0.40, 0.30, 0.10, 0.03, 0]
            },
            shortFail: {
                values: [1, 2, 3, 4, 5, 6, 7],
                probabilities: [0, 0.12, 0.30, 0.32, 0.18, 0.06, 0.02]
            }
        };
        
        // Validate probabilities sum to 1
        this.validateDistributions();
    }
    
    validateDistributions() {
        for (const [key, dist] of Object.entries(this.distributions)) {
            const sum = dist.probabilities.reduce((a, b) => a + b, 0);
            if (Math.abs(sum - 1) > 0.001) {
                console.warn(`Distribution ${key} probabilities sum to ${sum}, not 1`);
            }
        }
    }
    
    // Helper: get random value from distribution
    sampleFromDistribution(dist) {
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < dist.probabilities.length; i++) {
            cumulative += dist.probabilities[i];
            if (random <= cumulative) {
                return dist.values[i];
            }
        }
        
        // Fallback: return last value
        return dist.values[dist.values.length - 1];
    }
    
    // Simulate one hole for a player
    simulateHole(player, trumpCumulative, obamaCumulative, isObama = false) {
        let teeShotType;
        let teeShotSuccess;
        
        // Determine tee shot type based on strategy
        if (isObama) {
            // Obama's adaptive strategy
            if (obamaCumulative >= trumpCumulative) {
                // Tied or behind - go Long to catch up
                teeShotType = 'long';
            } else {
                // Ahead - play safe with Short
                teeShotType = 'short';
            }
        } else {
            // Trump's fixed strategy
            teeShotType = Math.random() < this.trumpLongProb ? 'long' : 'short';
        }
        
        // Determine if tee shot succeeds
        if (teeShotType === 'long') {
            if (player == 'trump') teeShotSuccess = Math.random() < this.trumpLongSuccessProb;
            else teeShotSuccess = Math.random() < this.obamaLongSuccessProb;
        } else {
            if (player == 'trump') teeShotSuccess = Math.random() < this.trumpShortSuccessProb;
            else teeShotSuccess = Math.random() < this.obamaShortSuccessProb;
        }
        
        // Get additional strokes based on outcome
        let additionalStrokes;
        if (teeShotType === 'long' && teeShotSuccess) {
            additionalStrokes = this.sampleFromDistribution(this.distributions.longSuccess);
        } else if (teeShotType === 'long' && !teeShotSuccess) {
            additionalStrokes = this.sampleFromDistribution(this.distributions.longFail);
        } else if (teeShotType === 'short' && teeShotSuccess) {
            additionalStrokes = this.sampleFromDistribution(this.distributions.shortSuccess);
        } else {
            additionalStrokes = this.sampleFromDistribution(this.distributions.shortFail);
        }
        
        // Total strokes: 1 for tee shot + additional strokes
        const totalStrokes = 1 + additionalStrokes;
        
        return {
            teeShotType,
            teeShotSuccess,
            additionalStrokes,
            totalStrokes,
            holeScore: totalStrokes
        };
    }
    
    // Simulate one complete round (18 holes)
    simulateRound() {
        let trumpScore = 0;
        let obamaScore = 0;
        
        const trumpHoleDetails = [];
        const obamaHoleDetails = [];
        
        for (let hole = 1; hole <= 18; hole++) {
            // Simulate Trump's hole
            const trumpHole = this.simulateHole('trump', trumpScore, obamaScore, false);
            trumpScore += trumpHole.totalStrokes;
            trumpHoleDetails.push({
                hole,
                ...trumpHole,
                cumulativeScore: trumpScore
            });
            
            // Simulate Obama's hole
            const obamaHole = this.simulateHole('obama', trumpScore, obamaScore, true);
            obamaScore += obamaHole.totalStrokes;
            obamaHoleDetails.push({
                hole,
                ...obamaHole,
                cumulativeScore: obamaScore
            });
        }
        
        return {
            trumpFinalScore: trumpScore,
            obamaFinalScore: obamaScore,
            trumpHoleDetails,
            obamaHoleDetails,
            winner: trumpScore < obamaScore ? 'Trump' : (trumpScore > obamaScore ? 'Obama' : 'Tie')
        };
    }
    
    // Run multiple simulations
    runSimulations(numSimulations = 10000) {
        const results = {
            trumpWins: 0,
            obamaWins: 0,
            ties: 0,
            trumpTotalScore: 0,
            obamaTotalScore: 0,
            trumpScores: [],
            obamaScores: [],
            trumpParBreaks: { birdie: 0, par: 0, bogey: 0, doubleBogey: 0, worse: 0 },
            obamaParBreaks: { birdie: 0, par: 0, bogey: 0, doubleBogey: 0, worse: 0 },
            trumpStrategyStats: { long: 0, short: 0 },
            obamaStrategyStats: { long: 0, short: 0 },
            holeByHoleAnalysis: Array(18).fill().map(() => ({
                trumpAvg: 0,
                obamaAvg: 0,
                trumpLongPercentage: 0,
                obamaLongPercentage: 0
            }))
        };
        
        for (let i = 0; i < numSimulations; i++) {
            const round = this.simulateRound();
            
            // Count wins
            if (round.winner === 'Trump') {
                results.trumpWins++;
            } else if (round.winner === 'Obama') {
                results.obamaWins++;
            } else {
                results.ties++;
            }
            
            // Accumulate scores
            results.trumpTotalScore += round.trumpFinalScore;
            results.obamaTotalScore += round.obamaFinalScore;
            results.trumpScores.push(round.trumpFinalScore);
            results.obamaScores.push(round.obamaFinalScore);
            
            // Analyze hole-by-hole data
            round.trumpHoleDetails.forEach((hole, index) => {
                // Accumulate for hole averages
                results.holeByHoleAnalysis[index].trumpAvg += hole.totalStrokes;
                results.holeByHoleAnalysis[index].trumpLongPercentage += (hole.teeShotType === 'long' ? 1 : 0);
                
                // Count score outcomes
                const relativeToPar = hole.totalStrokes - 4;
                if (relativeToPar === -1) results.trumpParBreaks.birdie++;
                else if (relativeToPar === 0) results.trumpParBreaks.par++;
                else if (relativeToPar === 1) results.trumpParBreaks.bogey++;
                else if (relativeToPar === 2) results.trumpParBreaks.doubleBogey++;
                else if (relativeToPar > 2) results.trumpParBreaks.worse++;
                
                // Count strategy usage
                if (hole.teeShotType === 'long') results.trumpStrategyStats.long++;
                else results.trumpStrategyStats.short++;
            });
            
            round.obamaHoleDetails.forEach((hole, index) => {
                // Accumulate for hole averages
                results.holeByHoleAnalysis[index].obamaAvg += hole.totalStrokes;
                results.holeByHoleAnalysis[index].obamaLongPercentage += (hole.teeShotType === 'long' ? 1 : 0);
                
                // Count score outcomes
                const relativeToPar = hole.totalStrokes - 4;
                if (relativeToPar === -1) results.obamaParBreaks.birdie++;
                else if (relativeToPar === 0) results.obamaParBreaks.par++;
                else if (relativeToPar === 1) results.obamaParBreaks.bogey++;
                else if (relativeToPar === 2) results.obamaParBreaks.doubleBogey++;
                else if (relativeToPar > 2) results.obamaParBreaks.worse++;
                
                // Count strategy usage
                if (hole.teeShotType === 'long') results.obamaStrategyStats.long++;
                else results.obamaStrategyStats.short++;
            });
        }
        
        // Calculate averages
        results.trumpAvgScore = results.trumpTotalScore / numSimulations;
        results.obamaAvgScore = results.obamaTotalScore / numSimulations;
        
        // Calculate percentages
        results.trumpWinPercentage = (results.trumpWins / numSimulations) * 100;
        results.obamaWinPercentage = (results.obamaWins / numSimulations) * 100;
        results.tiePercentage = (results.ties / numSimulations) * 100;
        
        // Normalize hole-by-hole data
        results.holeByHoleAnalysis = results.holeByHoleAnalysis.map(hole => ({
            trumpAvg: hole.trumpAvg / numSimulations,
            obamaAvg: hole.obamaAvg / numSimulations,
            trumpLongPercentage: (hole.trumpLongPercentage / numSimulations) * 100,
            obamaLongPercentage: (hole.obamaLongPercentage / numSimulations) * 100
        }));
        
        // Calculate strategy percentages
        results.trumpStrategyStats.longPercentage = (results.trumpStrategyStats.long / (numSimulations * 18)) * 100;
        results.trumpStrategyStats.shortPercentage = (results.trumpStrategyStats.short / (numSimulations * 18)) * 100;
        results.obamaStrategyStats.longPercentage = (results.obamaStrategyStats.long / (numSimulations * 18)) * 100;
        results.obamaStrategyStats.shortPercentage = (results.obamaStrategyStats.short / (numSimulations * 18)) * 100;
        
        return results;
    }
    
    // Run simulation with detailed analysis
    runDetailedAnalysis(numSimulations = 10000) {
        const results = this.runSimulations(numSimulations);
        
        // Calculate standard deviations
        results.trumpStdDev = this.calculateStdDev(results.trumpScores, results.trumpAvgScore);
        results.obamaStdDev = this.calculateStdDev(results.obamaScores, results.obamaAvgScore);
        
        // Calculate confidence intervals (95%)
        results.trumpConfidenceInterval = this.calculateConfidenceInterval(results.trumpAvgScore, results.trumpStdDev, numSimulations);
        results.obamaConfidenceInterval = this.calculateConfidenceInterval(results.obamaAvgScore, results.obamaStdDev, numSimulations);
        
        // Find best and worst scores
        results.trumpBestScore = Math.min(...results.trumpScores);
        results.trumpWorstScore = Math.max(...results.trumpScores);
        results.obamaBestScore = Math.min(...results.obamaScores);
        results.obamaWorstScore = Math.max(...results.obamaScores);
        
        return results;
    }
    
    calculateStdDev(scores, mean) {
        const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
        return Math.sqrt(variance);
    }
    
    calculateConfidenceInterval(mean, stdDev, n) {
        const z = 1.96; // 95% confidence
        const margin = z * (stdDev / Math.sqrt(n));
        return {
            lower: mean - margin,
            upper: mean + margin
        };
    }
    
    // Print results to console
    printResults(results) {
        console.log('=== GOLF SIMULATION RESULTS ===');
        console.log(`Simulations run: ${results.trumpScores.length}`);
        console.log('\n--- WIN/LOSS RECORD ---');
        console.log(`Trump wins: ${results.trumpWins} (${results.trumpWinPercentage.toFixed(2)}%)`);
        console.log(`Obama wins: ${results.obamaWins} (${results.obamaWinPercentage.toFixed(2)}%)`);
        console.log(`Ties: ${results.ties} (${results.tiePercentage.toFixed(2)}%)`);
        
        console.log('\n--- AVERAGE SCORES ---');
        console.log(`Trump average: ${results.trumpAvgScore.toFixed(2)} (95% CI: ${results.trumpConfidenceInterval.lower.toFixed(2)} - ${results.trumpConfidenceInterval.upper.toFixed(2)})`);
        console.log(`Obama average: ${results.obamaAvgScore.toFixed(2)} (95% CI: ${results.obamaConfidenceInterval.lower.toFixed(2)} - ${results.obamaConfidenceInterval.upper.toFixed(2)})`);
        
        console.log('\n--- SCORE DISTRIBUTIONS ---');
        console.log('Trump:');
        console.log(`  Best: ${results.trumpBestScore}, Worst: ${results.trumpWorstScore}, Std Dev: ${results.trumpStdDev.toFixed(2)}`);
        console.log('Obama:');
        console.log(`  Best: ${results.obamaBestScore}, Worst: ${results.obamaWorstScore}, Std Dev: ${results.obamaStdDev.toFixed(2)}`);
        
        console.log('\n--- STRATEGY USAGE ---');
        console.log(`Trump: Long ${results.trumpStrategyStats.longPercentage.toFixed(1)}%, Short ${results.trumpStrategyStats.shortPercentage.toFixed(1)}%`);
        console.log(`Obama: Long ${results.obamaStrategyStats.longPercentage.toFixed(1)}%, Short ${results.obamaStrategyStats.shortPercentage.toFixed(1)}%`);
        
        console.log('\n--- HOLE-BY-HOLE AVERAGES ---');
        results.holeByHoleAnalysis.forEach((hole, index) => {
            console.log(`Hole ${index + 1}: Trump ${hole.trumpAvg.toFixed(2)} (${hole.trumpLongPercentage.toFixed(1)}% long), Obama ${hole.obamaAvg.toFixed(2)} (${hole.obamaLongPercentage.toFixed(1)}% long)`);
        });
        
        console.log('\n--- SCORE OUTCOMES PER HOLE ---');
        console.log('Trump:');
        console.log(`  Birdie: ${results.trumpParBreaks.birdie} (${(results.trumpParBreaks.birdie/(results.trumpScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Par: ${results.trumpParBreaks.par} (${(results.trumpParBreaks.par/(results.trumpScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Bogey: ${results.trumpParBreaks.bogey} (${(results.trumpParBreaks.bogey/(results.trumpScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Double Bogey: ${results.trumpParBreaks.doubleBogey} (${(results.trumpParBreaks.doubleBogey/(results.trumpScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Worse: ${results.trumpParBreaks.worse} (${(results.trumpParBreaks.worse/(results.trumpScores.length * 18)*100).toFixed(1)}%)`);
        
        console.log('\nObama:');
        console.log(`  Birdie: ${results.obamaParBreaks.birdie} (${(results.obamaParBreaks.birdie/(results.obamaScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Par: ${results.obamaParBreaks.par} (${(results.obamaParBreaks.par/(results.obamaScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Bogey: ${results.obamaParBreaks.bogey} (${(results.obamaParBreaks.bogey/(results.obamaScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Double Bogey: ${results.obamaParBreaks.doubleBogey} (${(results.obamaParBreaks.doubleBogey/(results.obamaScores.length * 18)*100).toFixed(1)}%)`);
        console.log(`  Worse: ${results.obamaParBreaks.worse} (${(results.obamaParBreaks.worse/(results.obamaScores.length * 18)*100).toFixed(1)}%)`);
    }
}

// Example usage:
function runExampleSimulation() {
    console.log('Starting golf simulation...\n');
    
    const sim = new GolfSimulation({
        trumpLongProb: trump_p_l,
        trumpLongSuccessProb: trump_l_s,
        obamaLongSuccessProb: obama_l_s,
        trumpShortSuccessProb: trump_s_s,
        obamaShortSuccessProb: obama_s_s
    });
    
    // Run detailed analysis with 10,000 simulations
    const results = sim.runDetailedAnalysis(10_000);
    
    // Print results
    sim.printResults(results);
    
    // Return results for further analysis if needed
    return results;
}

// Run the simulation when loaded
// Note: You may want to call this manually to avoid automatic execution
// runExampleSimulation();

export { GolfSimulation };