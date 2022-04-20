import datetime

def parse_expenses(expenses_string):
    """Parse the list of expenses and return the list of triples (date, value, currency).
    Ignore lines starting with #.
    Parse the date using datetime.
    Example expenses_string:
        2016-01-02 -34.01 USD
        2016-01-03 2.59 DKK
        2016-01-03 -2.72 EUR
    """
    expenses = []
    for line in expenses_string.splitlines():
        if line.startswith('#'):
            continue
        date, value, currency = line.split()
        expenses.append((datetime.datetime.strptime(date, '%Y-%m-%d'), float(value), currency))
    return expenses

print(parse_expenses('2016-01-02 -34.01 USD\n2016-01-03 2.59 DKK\n2016-01-03 -2.72 EUR'))