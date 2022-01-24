package logger

import "go.uber.org/zap"

type LogHandler interface {
	LogInfo(s string)
	LogError(s string)
	LogFatal(s string)
}

type Applogger struct {
	Log *zap.SugaredLogger
}

func (z *Applogger) LogInfo(warning string) {
	z.Log.Info(warning)
}

func (z *Applogger) LogError(err string) {
	z.Log.Error(err)
}

func (z *Applogger) LogFatal(fatal string) {
	z.Log.Fatal(fatal)
}
