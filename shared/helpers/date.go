package helpers

import "time"

func DayStartUnix(year, month, day int) int64 {
	// Defining t in UTC for Unix method
	t := time.Date(year, time.Month(month), day, 0, 0, 1, 0, time.Now().Location())
	// Calling Unix method
	unix := t.Unix()
	return unix
}

func DayEndUnix(year, month, day int) int64 {
	// Defining t in UTC for Unix method
	t := time.Date(year, time.Month(month), day, 23, 59, 59, 0, time.Now().Location())
	// Calling Unix method
	unix := t.Unix()
	return unix
}

func YesterdayDates() (int, int, int) {
	yesterday := time.Now().AddDate(0, 0, -1)
	return yesterday.Year(), int(yesterday.Month()), yesterday.Day()
}



func YesterdayStartUnix() int64 {
	y, m, d := YesterdayDates()
	unix := DayStartUnix(y,m,d)
	return unix
}

func YesterdayEndUnix() int64 {
	y, m, d := YesterdayDates()
	unix := DayEndUnix(y,m,d)
	return unix
}


