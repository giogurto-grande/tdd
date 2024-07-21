import functools
import operator

from money import Money

class Portfolio:
    def __init__(self):
        self.moneys = []

    def evaluate(self, currency):
        total = functools.reduce(
            operator.add, map(lambda m: m.amount, self.moneys), 0
        )

        return Money(total, currency)

    def add(self, *moneys):
        self.moneys.extend(moneys)
