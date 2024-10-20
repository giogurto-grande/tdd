import functools
import operator

from money import Money

class Portfolio:
    def __init__(self):
        self.moneys = []
        self._eur_to_usd = 1.2

    def evaluate(self, bank, currency):
        total = 0.0
        failures = []

        for m in self.moneys:
            try:
                total += bank.convert(m, currency).amount
            except Exception as ke:
                failures.append(ke)

        if len(failures) == 0:
            return Money(total, currency)

        failureMessage = ",".join(f.args[0] for f in failures)
        raise Exception("Brakuje kursu (kursów) wymiany:[" + failureMessage + "]")

    def add(self, *moneys):
        self.moneys.extend(moneys)
