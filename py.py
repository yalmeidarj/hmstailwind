"""

I'm working on a NextJs 13 project and I was hoping you could assist me with a code review session. I'm a fullstack dev myself, but I'm still quite unexperienced with a few things.
My idea is to have an online call where I can walk you through my project and ask some basic questions. It's more about getting a second set of eyes on my code and having an experienced dev give their opinions before I push the project online.

For your time and insights, I'd be happy to offer $35/hour. I predict this could take around 2 hours.
Let me know if you're available and interested

https://glitter-romano-d6e.notion.site/TDX-16f087bbcb824c16a918b41d8a60ddcc

I'm using the new app dir, my code is a bit messy, but I can share the repo

"""


"""
THE HOUSE WITH 'NO' AS STATUS
AECON last name
1657 TEAKDALE AV
Orleans, ON, K1C6M2
"""

"""
Feed - select type - always as 'Buried'
if no email is provided, 'noreply@aecon.com' will be used

Previous Consent Notes: 'Letter, hanger and paper delivered Garcia1  2023-06-15'


$#unRK89#Ja

"""


import random

def simulate_transactions(initial_stake, target_amount, win_probability, payoff_ratio, kelly_fraction_percentage):
    """
    Simulates a series of transactions using a betting strategy based on the Kelly Criterion.

    :param initial_stake: Initial amount of money available for transactions.
    :param target_amount: Target amount of money to be reached.
    :param win_probability: Probability of winning a transaction.
    :param payoff_ratio: Ratio of money won if a transaction is successful.
    :param kelly_fraction_percentage: Percentage of the Kelly fraction to be used in the strategy.
    :return: Final stake after series of transactions, number of transactions made, Kelly fraction percentage used, and a list of outcomes for each transaction.
    """

    current_stake = initial_stake
    kelly_fraction = win_probability - ((1 - win_probability) / payoff_ratio)
    bet_fraction = kelly_fraction * kelly_fraction_percentage
    transaction_outcomes = []
    transaction_counter = 0

    while current_stake < target_amount:
        transaction_counter += 1
        bet_amount = current_stake * bet_fraction
        # print(f"current_stake: {current_stake}\nbet_fraction: {bet_fraction}\nbet_amount: {bet_amount}")

        # Randomly determine if this transaction is a win or loss
        if random.random() < win_probability:
            current_stake += bet_amount * payoff_ratio
            transaction_outcomes.append(f'Transaction {transaction_counter}:\nWin. Current stake: ${current_stake:.2f}\nbet_amount: {bet_amount}')
        else:
            current_stake -= bet_amount
            transaction_outcomes.append(f'Transaction {transaction_counter}:\nLoss. Current stake: ${current_stake:.2f}\nbet_amount: {bet_amount}')

        if current_stake <= 0:
            print(f'Your current stake is: {current_stake}\nYou LOST ALL your funds!')
            break

    return current_stake, transaction_counter, kelly_fraction_percentage, transaction_outcomes


def calculate_winning_ratio(transaction_outcomes):
    """
    Calculates the winning ratio from a list of transaction outcomes.

    :param transaction_outcomes: List of transaction outcomes.
    :return: Winning ratio.
    """
    win_count = sum('Win' in outcome for outcome in transaction_outcomes)
    total_transactions = len(transaction_outcomes)

    if total_transactions == 0:
        return 0  # avoid division by zero

    winning_ratio = win_count / total_transactions
    return winning_ratio




initial_stake = 20  # Initial stake in dollars
target_amount = initial_stake * 10  # Target amount in dollars
win_probability = 0.53  # Probability of winning a transaction
payoff_ratio = 1.45  # Ratio of stake won if a transaction is successful
kelly_fraction_percentage = 0.4  # Percentage of the Kelly fraction to use for bets

# print(kelly_fraction_percentage * initial_stake)



final_stake, num_transactions, kelly_fraction_percentage_used, transaction_outcomes = simulate_transactions(initial_stake, target_amount, win_probability, payoff_ratio, kelly_fraction_percentage)

print(f'Final stake: ${final_stake:.2f}')
print(f'Number of transactions: {num_transactions}')
print(f'Kelly fraction percentage used: {kelly_fraction_percentage_used * 100:.2f}%')
for outcome in transaction_outcomes:
    print(outcome)

winning_ratio = calculate_winning_ratio(transaction_outcomes)
print(f'Winning ratio: {winning_ratio * 100:.2f}%')



