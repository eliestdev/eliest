package helpers_test

import (
	"lottoshared/helpers"
	"testing"
)

func TestDayStartUnix(t *testing.T) {
	result := 1609480801
    unix := helpers.DayStartUnix(2021, 1, 1)
    if unix != int64(result)  {
        t.Fatalf(`DayStartUnix(2021, 1, 1) = %v, %v, want "", error`, result, unix)
    }
}