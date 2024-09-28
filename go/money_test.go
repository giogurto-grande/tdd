package main

import (
    "testing"
    s "tdd/stocks"
)

func TestMultiplication(t *testing.T) {
    tenEuros := s.NewMoney(10, "EUR")
    actualResult := tenEuros.Times(2)
    expectedResult := s.NewMoney(20, "EUR")

    assertEqual(t, expectedResult, actualResult)
}

func TestDivision(t *testing.T) {
    originalMoney := s.NewMoney(4002, "KRW")
    actualMoneyAfterDivision := originalMoney.Divide(4)
    expectedMoneyAfterDivision := s.NewMoney(1000.5, "KRW")

    assertEqual(t, expectedMoneyAfterDivision, actualMoneyAfterDivision)
}

func TestAddition(t *testing.T) {
    var portfolio s.Portfolio
    var portfolioInDollars s.Money

    fiveDollars := s.NewMoney(5, "USD")
    tenDollars := s.NewMoney(10, "USD")
    fifteenDollars := s.NewMoney(15, "USD")

    portfolio = portfolio.Add(fiveDollars)
    portfolio = portfolio.Add(tenDollars)

    portfolioInDollars, _ = portfolio.Evaluate("USD")

    assertEqual(t, fifteenDollars, portfolioInDollars)
}

func TestAdditionOfDollarsAndEuros(t *testing.T) {
    var portfolio s.Portfolio
    fiveDollars := s.NewMoney(5, "USD")
    tenEuros := s.NewMoney(10, "EUR")

    portfolio = portfolio.Add(fiveDollars)
    portfolio = portfolio.Add(tenEuros)

    expectedValue := s.NewMoney(17, "USD")
    actualValue, _ := portfolio.Evaluate("USD")

    assertEqual(t, expectedValue, actualValue)
}

func TestAdditionOfDollarsAndWons(t *testing.T) {
    var portfolio s.Portfolio

    oneDollar := s.NewMoney(1, "USD")
    elevenHundredWon:= s.NewMoney(1100, "KRW")

    portfolio = portfolio.Add(oneDollar)
    portfolio = portfolio.Add(elevenHundredWon)

    expectedValue := s.NewMoney(2200, "KRW")
    actualValue, _ := portfolio.Evaluate("KRW")

    assertEqual(t, expectedValue, actualValue)
}

func TestAdditionWithMultipleMissingExchangeRates(t *testing.T) {
    var portfolio s.Portfolio

    oneDollar := s.NewMoney(1, "USD")
    oneEuro := s.NewMoney(1, "EUR")
    oneWon := s.NewMoney(1, "KRW")

    portfolio = portfolio.Add(oneDollar)
    portfolio = portfolio.Add(oneEuro)
    portfolio = portfolio.Add(oneWon)

    expectedErrorMessage :=
        "Brakuje kursu (kursów) wymiany:[USD->Kalganid,EUR->Kalganid,KRW->Kalganid,]"
    _, actualError := portfolio.Evaluate("Kalganid")

    assertEqual(t, expectedErrorMessage, actualError.Error())
}

func TestConversion(t *testing.T) {
    bank := s.NewBank()
    bank.AddExchangeRate("EUR", "USD", 1.2)
    tenEuros := s.NewMoney(10, "EUR")
    actualConvertedMoney, err := bank.Convert(tenEuros, "USD")
    assertNil(t, err)
    assertEqual(t, s.NewMoney(12, "USD"), *actualConvertedMoney)
}

func TestConversionWithMissingExchangeRate(t *testing.T) {
    bank := s.NewBank()
    tenEuros := s.NewMoney(10, "EUR")
    actualConvertedMoney, err := bank.Convert(tenEuros, "Kalganid")

    assertNilif actualConvertedMoney != nil {
        t.Errorf("Oczekiwane pieniądze to nil, znaleziono [%+v]", actualConvertedMoney)
    }

    assertEqual(t, "EUR->Kalganid", err.Error())
}


func assertEqual(t *testing.T, expected interface{}, actual interface{}) {
    if expected != actual {
        t.Errorf("Oczekiwano %+v Otrzymano %+v", expected, actual)
    }
}

func assertNil(t *testing.T, err error) {
    if err != nil {
        t.Errorf("Oczekiwany błąd to nil, znaleziono: [%s]", err)
    }
}