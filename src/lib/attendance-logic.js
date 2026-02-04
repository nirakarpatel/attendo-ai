export const calculateStatus = (total, attended, target) => {
    if (total === 0) return { status: 'safe', message: 'No classes yet' };

    const currentPercentage = (attended / total) * 100;

    // How many more classes can I miss?
    // Formula: (Attended) / (Total + X) >= Target%
    // Attended >= Target * (Total + X)
    // Attended/Target >= Total + X
    // X <= (Attended/Target) - Total

    let safeBunks = 0;
    // Brute force check next 20 classes
    for (let i = 1; i < 50; i++) {
        const futureTotal = total + i;
        // Assuming we miss the next 'i' classes
        const futurePct = (attended / futureTotal) * 100;
        if (futurePct >= target) {
            safeBunks = i;
        } else {
            break;
        }
    }

    if (currentPercentage >= target) {
        if (safeBunks > 0) {
            return {
                status: 'safe',
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
                message: `You can safely bunt ${safeBunks} more ${safeBunks === 1 ? 'class' : 'classes'}.`
            }
        } else {
            return {
                status: 'warning',
                color: 'text-yellow-400',
                bg: 'bg-yellow-400/10',
                message: `You are on track, but don't miss the next class!`
            }
        }
    } else {
        // Need to attend
        // Formula: (Attended + X) / (Total + X) >= Target%
        let needed = 0;
        for (let i = 1; i < 50; i++) {
            const futureTotal = total + i;
            const futureAttended = attended + i;
            if ((futureAttended / futureTotal) * 100 >= target) {
                needed = i;
                break;
            }
        }
        return {
            status: 'danger',
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
            message: `Attend next ${needed} classes to get back on track.`
        }
    }
}

/**
 * Simulate taking N days of leave (absences)
 * Returns the projected attendance and recovery plan
 */
export const simulateLeave = (total, attended, target, leaveDays) => {
    if (leaveDays <= 0 || total === 0) {
        return {
            currentPercentage: total === 0 ? 100 : Math.round((attended / total) * 100),
            futurePercentage: total === 0 ? 100 : Math.round((attended / total) * 100),
            isSafe: true,
            recoveryClasses: 0,
            message: "No change in attendance."
        };
    }

    const currentPercentage = Math.round((attended / total) * 100);
    const futureTotal = total + leaveDays;
    const futureAttended = attended; // No new attendance during leave
    const futurePercentage = Math.round((futureAttended / futureTotal) * 100);

    const isSafe = futurePercentage >= target;

    // Calculate recovery: how many consecutive classes to attend after leave to reach target
    let recoveryClasses = 0;
    if (!isSafe) {
        for (let i = 1; i <= 100; i++) {
            const recoveryTotal = futureTotal + i;
            const recoveryAttended = futureAttended + i;
            if ((recoveryAttended / recoveryTotal) * 100 >= target) {
                recoveryClasses = i;
                break;
            }
        }
    }

    let message = "";
    if (isSafe) {
        message = `After ${leaveDays} day${leaveDays > 1 ? 's' : ''} leave, you'll still be at ${futurePercentage}%. You're safe! ✅`;
    } else {
        message = `After ${leaveDays} day${leaveDays > 1 ? 's' : ''} leave, attendance drops to ${futurePercentage}%. Attend ${recoveryClasses} consecutive classes to recover. ⚠️`;
    }

    return {
        currentPercentage,
        futurePercentage,
        isSafe,
        recoveryClasses,
        leaveDays,
        message
    };
}

