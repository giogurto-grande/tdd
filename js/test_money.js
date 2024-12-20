const assert = require('assert');
const Money = require('./money');
const Portfolio = require('./portfolio');
const Bank = require('./bank');

class MoneyTest {
    setUp() {
        this.bank = new Bank();
        this.bank.addExchangeRate('EUR', 'USD', 1.2);
        this.bank.addExchangeRate('USD', 'KRW', 1100);

    }

    testMultiplication() {
        let tenEuros = new Money(10, 'EUR');
        let twentyEuros = new Money(20, 'EUR');

        assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
    }

    testDivision() {
        let originalMoney = new Money(4002, 'KRW');
        let expectedMoneyAfterDivision = new Money(1000.5, 'KRW');

        assert.deepStrictEqual(originalMoney.divide(4), expectedMoneyAfterDivision);
    }

    testAddition() {
        let fiveDollars = new Money(5, 'USD');
        let tenDollars = new Money(10, 'USD');
        let fifteenDollars = new Money(15, 'USD');
        let portfolio = new Portfolio();

        portfolio.add(fiveDollars, tenDollars);
        assert.deepStrictEqual(portfolio.evaluate(this.bank, 'USD'), fifteenDollars);
    }

    testAdditionOfDollarsAndEuros() {
        let fiveDollars = new Money(5, 'USD');
        let tenEuros = new Money(10, 'EUR');
        let portfolio = new Portfolio();

        portfolio.add(fiveDollars, tenEuros);
        let expectedValue = new Money(17, 'USD');

        assert.deepStrictEqual(portfolio.evaluate(this.bank, 'USD'), expectedValue);
    }

    testAdditionOfDollarsAndWons() {
        let oneDollar = new Money(1, 'USD');
        let elevenHundredWons = new Money(1100, 'KRW');

        let portfolio = new Portfolio();
        portfolio.add(oneDollar, elevenHundredWons);

        let expectedValue = new Money(2200, 'KRW');
        assert.deepStrictEqual(portfolio.evaluate(this.bank, 'KRW'), expectedValue);
    }

    testAdditionWithMultipleMissingExchangeRates() {
        let oneDollar = new Money(1, 'USD');
        let oneEuro = new Money(1, 'EUR');
        let oneWon = new Money(1, 'KRW');
        let portfolio = new Portfolio();

        portfolio.add(oneDollar, oneEuro, oneWon);
        let expectedError = new Error(
            'Brakuje kursu (kursów) wymiany:[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]'
        );

        assert.throws(() => {
            portfolio.evaluate(this.bank, 'Kalganid')
        }, expectedError);
    }

    testConversionWithDifferentRatesBetweenTwoCurrencies() {
        let tenEuros = new Money(10, 'EUR');

        assert.deepStrictEqual(
            this.bank.convert(tenEuros, 'USD'),
            new Money(12, 'USD')
        );

        this.bank.addExchangeRate('EUR', 'USD', 1.3);

        assert.deepStrictEqual(
            this.bank.convert(tenEuros, 'USD'),
            new Money(13, 'USD')
        );
    }

    testConversionWithMissingExchangeRate() {
        let tenEuros = new Money(10, 'EUR');
        let expectedError = new Error('EUR->Kalganid');
        let bank = this.bank;

        assert.throws(function () {
            bank.convert(tenEuros, 'Kalganid');
        }, expectedError);
    }

    getAllTestMethods() {
        let moneyPrototype = MoneyTest.prototype;
        let allProps = Object.getOwnPropertyNames(moneyPrototype);

        return allProps.filter(p => {
            return typeof moneyPrototype[p] === 'function' && p.startsWith('test');
        });
    }

    randomizeTestOrder(testMethods) {
        for (let i = testMethods.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [testMethods[i], testMethods[j]] = [testMethods[j], testMethods[i]];
        }

        return testMethods;
    }

    runAllTests() {
        let testMethods = this.randomizeTestOrder(this.getAllTestMethods());
        testMethods.forEach(m => {
            let method = Reflect.get(this, m);
            console.log('uruchamianie ' + m);
            try {
                this.setUp();
                Reflect.apply(method, this, []);
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    console.log(e);
                } else {
                    throw e;
                }
            }
        })
    }
}

new MoneyTest().runAllTests();